/**
 * HELOC360 approval scoring — shared by the Node test harness and the browser.
 * Plain ES5-ish JS, no modules, so it can be inlined into the page verbatim.
 *
 * Everything here is empirical except one clearly-labelled heuristic: the
 * credit adjustment. HMDA contains no credit score, so we cannot compute
 * approval odds by FICO. What we CAN observe is what each lender denies people
 * for. A lender whose denials are mostly credit-history is a worse bet for a
 * weak-credit applicant than one whose denials are mostly DTI. That is the
 * adjustment, and it is disclosed as a heuristic on the results page.
 */
var HELOC_SCORE = (function () {
  var CLTV_BANDS = ['<60', '60-70', '70-80', '80-85', '85-90', '90+']
  var DTI_BANDS = ['<36', '36-43', '43-50', '50+']

  function cltvBandIdx(v) {
    if (v < 60) return 0
    if (v < 70) return 1
    if (v < 80) return 2
    if (v < 85) return 3
    if (v < 90) return 4
    return 5
  }
  function dtiBandIdx(v) {
    if (v < 36) return 0
    if (v < 43) return 1
    if (v < 50) return 2
    return 3
  }

  /* Wilson score lower bound (95%). Keeps a 2-for-2 lender from outranking a
     4,000-for-6,000 lender — the same small-sample trap that buried Figure at
     #245 in the first ranking pass. */
  function wilsonLower(o, n) {
    if (!n) return 0
    var z = 1.96
    var p = o / n
    var d = 1 + (z * z) / n
    var c = p + (z * z) / (2 * n)
    var m = z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))
    return Math.max(0, (c - m) / d)
  }

  /* Hierarchical backoff. Most specific cell that clears MIN_N wins; we always
     report which level answered and how many applications it rested on. */
  var MIN_N = 20
  function lookup(P, li, state, cb, db) {
    // lender-wide totals live on the lenderList row: [.., .., .., .., orig, denied]
    var row = P.lenderList[li]
    var wide = [row[4], row[5]]
    var chain = [
      { key: li + '|' + state + '|' + cb + '|' + db, src: P.cells, level: 'state', label: 'in your state, at your LTV and DTI' },
      { key: li + '|' + cb + '|' + db, src: P.cellsNat, level: 'national', label: 'nationally, at your LTV and DTI' },
      { key: li + '|' + cb, src: P.cellsCltv, level: 'cltv', label: 'at your LTV' },
    ]
    for (var i = 0; i < chain.length; i++) {
      var v = chain[i].src[chain[i].key]
      if (v && v[0] + v[1] >= MIN_N) {
        return { o: v[0], d: v[1], n: v[0] + v[1], level: chain[i].level, label: chain[i].label }
      }
    }
    if (!wide || wide[0] + wide[1] === 0) return null
    return {
      o: wide[0],
      d: wide[1],
      n: wide[0] + wide[1],
      level: 'lender',
      label: 'across all their 2025 HELOCs',
    }
  }

  /* Disclosed heuristic, not data. Scales a lender's credit-history denial
     share by how weak the applicant says their credit is. */
  var CREDIT_PENALTY = { excellent: 0, good: 0.12, fair: 0.35, poor: 0.6 }

  /* ------------------------------------------------------------------
     SIZE CORRECTION.

     Approval rate is confounded with lender size at every scale: the
     smallest quintile of lenders approves 15-19 points higher than the
     largest, in every cohort tested. That is an intake artefact, not
     generosity - small lenders take a formal application only after a loan
     officer has pre-qualified the borrower, while large lenders let anyone
     apply online and decline in underwriting.

     Empirical Bayes does NOT fix this (fitted k = 13: the between-lender
     spread is real, so shrinkage says "trust each lender's own data"). A
     variance correction cannot repair a validity problem.

     So we judge each lender against lenders OF ITS OWN SIZE, using the
     log-linear curve fitted at build time, and rank on a blend of that
     residual and raw lending scale.
     ------------------------------------------------------------------ */
  var W_APPROVAL = 0.65
  var W_SCALE = 0.35

  function expectedForSize(P, apps) {
    var c = P.meta.sizeCurve
    if (!c || apps < 1) return null
    return c.intercept + c.slope * (Math.log(apps) / Math.LN10)
  }

  function scalePercentiles(P) {
    if (P.__scalePct) return P.__scalePct
    var origs = []
    for (var i = 0; i < P.lenderList.length; i++) origs.push(P.lenderList[i][4] || 0)
    var sorted = origs.slice().sort(function (a, b) { return a - b })
    var pct = []
    for (var j = 0; j < origs.length; j++) {
      var lo = 0, hi = sorted.length
      while (lo < hi) { var mid = (lo + hi) >> 1; if (sorted[mid] < origs[j]) lo = mid + 1; else hi = mid }
      pct.push(sorted.length > 1 ? lo / (sorted.length - 1) : 1)
    }
    P.__scalePct = pct
    return pct
  }

  function score(P, input) {
    var homeValue = Math.max(0, input.homeValue || 0)
    var balance = Math.max(0, input.balance || 0)
    var want = Math.max(0, input.want || 0)
    var state = input.state
    var credit = input.creditBand || 'good'

    if (!homeValue) return { error: 'no-home-value', results: [] }

    var targetCltv = ((balance + want) / homeValue) * 100
    var cb = cltvBandIdx(targetCltv)
    var db = dtiBandIdx(input.dti)

    var scalePct = scalePercentiles(P)
    var out = []
    for (var li = 0; li < P.lenderList.length; li++) {
      var L = P.lenderList[li]
      // L = [name, type, membershipRequired, nationalScore, orig, denied, slug]

      // must actually lend in this state
      var st = P.cellsState[li + '|' + state]
      if (!st || st[0] === 0) continue

      var hit = lookup(P, li, state, cb, db)
      if (!hit) continue

      var base = wilsonLower(hit.o, hit.n)
      var raw = hit.n ? hit.o / hit.n : 0

      var dn = P.denial[li]
      var creditShare = dn ? dn.creditShare : 0
      var adj = 1 - (CREDIT_PENALTY[credit] || 0) * creditShare
      var likelihood = Math.max(0, Math.min(1, base * adj))
      var apps = (L[4] || 0) + (L[5] || 0)

      // ---- how much they'd likely extend ----
      var cd = P.cltvByDti[li + '|' + db] || P.cltvLender[li] || null
      var cap = P.lineCap[li + '|' + cb] || null
      var typicalCltv = cd ? cd.p50 : null
      var stretchCltv = cd ? cd.p90 : null

      function amountAt(cltv) {
        if (cltv === null || cltv === undefined) return null
        var a = homeValue * (cltv / 100) - balance
        if (a <= 0) return 0
        if (cap && cap.p90) a = Math.min(a, cap.p90)
        return Math.round(a)
      }
      var typicalAmt = amountAt(typicalCltv)
      var maxAmt = amountAt(stretchCltv)

      // does their observed box even reach what this person asked for?
      var reaches = stretchCltv !== null && targetCltv <= stretchCltv + 0.5

      out.push({
        li: li,
        name: L[0],
        slug: L[6] || null,
        type: L[1],
        membershipRequired: L[2],
        nationalScore: L[3],
        likelihood: likelihood,
        base: base,
        adj: adj,
        apps: apps,
        originations: L[4] || 0,
        scalePct: scalePct[li],
        rawRate: raw,
        n: hit.n,
        level: hit.level,
        levelLabel: hit.label,
        approvals: hit.o,
        typicalAmount: typicalAmt,
        maxAmount: maxAmt,
        typicalCltv: typicalCltv,
        maxCltv: stretchCltv,
        reaches: reaches,
        creditShare: creditShare,
        topDenial: dn && dn.top && dn.top.length ? dn.top[0].reason : null,
        topDenialShare: dn && dn.top && dn.top.length ? dn.top[0].share : null,
        stateApps: st[0] + st[1],
        creditAdjusted: adj < 1,
      })
    }

    /* ---- size correction, recentred on THIS profile ----------------------
       The build-time curve was fitted on lender-wide rates. Applying it
       directly to a cell rate would absorb how easy the profile is (an easy
       profile lifts every lender, and every residual with it). So we keep the
       fitted SLOPE - the size effect, which is the part we want - and recentre
       the intercept on the mean rate the eligible lenders actually show for
       this exact profile. The residual then reads correctly: "better or worse
       than lenders its own size, on this same borrower profile." */
    var slope = P.meta.sizeCurve ? P.meta.sizeCurve.slope : 0
    if (out.length) {
      var sumBase = 0, sumLog = 0
      for (var q = 0; q < out.length; q++) {
        sumBase += out[q].base
        sumLog += Math.log(Math.max(1, out[q].apps)) / Math.LN10
      }
      var profileMean = sumBase / out.length
      var meanLog = sumLog / out.length
      for (var w = 0; w < out.length; w++) {
        var r = out[w]
        var expected = profileMean + slope * (Math.log(Math.max(1, r.apps)) / Math.LN10 - meanLog)
        var residual = r.base - expected
        r.sizeResidualPts = Math.round(residual * 100)
        r.sizeAdjusted = Math.max(0, Math.min(1, profileMean + residual))
        r.fit = W_APPROVAL * (r.sizeAdjusted * r.adj) + W_SCALE * r.scalePct
      }
    }

    // Lenders whose observed box reaches the request rank first; within that,
    // by fit (size-adjusted approval blended with scale), then by amount.
    out.sort(function (a, b) {
      if (a.reaches !== b.reaches) return a.reaches ? -1 : 1
      if (Math.abs(b.fit - a.fit) > 0.002) return b.fit - a.fit
      return (b.maxAmount || 0) - (a.maxAmount || 0)
    })

    return {
      targetCltv: targetCltv,
      cltvBand: CLTV_BANDS[cb],
      dtiBand: DTI_BANDS[db],
      results: out,
    }
  }

  return {
    score: score,
    wilsonLower: wilsonLower,
    CLTV_BANDS: CLTV_BANDS,
    DTI_BANDS: DTI_BANDS,
    CREDIT_PENALTY: CREDIT_PENALTY,
    MIN_N: MIN_N,
    W_APPROVAL: W_APPROVAL,
    W_SCALE: W_SCALE,
  }
})()

if (typeof module !== 'undefined' && module.exports) module.exports = HELOC_SCORE
