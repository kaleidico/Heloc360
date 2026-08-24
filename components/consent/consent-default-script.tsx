import Script from "next/script"
import {
  CONSENT_COOKIE,
  CONSENT_MODE,
  CONSENT_VERSION,
} from "@/lib/consent"

/**
 * Google Consent Mode v2 defaults.
 *
 * This must execute BEFORE any Google tag loads, otherwise the tag has already
 * written to storage by the time consent is known. It runs ahead of React, so
 * it reads the consent cookie itself rather than waiting for the provider.
 *
 * `wait_for_update` gives the provider a moment to send the real values after
 * hydration, so tags do not fire on the defaults and then immediately again.
 */
export default function ConsentDefaultScript() {
  const impliedGranted = CONSENT_MODE === "opt-out"

  const js = `
(function () {
  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  var implied = ${impliedGranted ? "true" : "false"};
  var state = { analytics: implied, marketing: implied, fraud: implied };

  try {
    var m = document.cookie.split('; ').find(function (r) {
      return r.indexOf('${CONSENT_COOKIE}=') === 0;
    });
    if (m) {
      var stored = JSON.parse(decodeURIComponent(m.slice(${CONSENT_COOKIE.length + 1})));
      if (stored && stored.v === ${CONSENT_VERSION} && stored.categories) {
        state.analytics = stored.categories.analytics === true;
        state.marketing = stored.categories.marketing === true;
        state.fraud = stored.categories.fraud === true;
      }
    }
  } catch (e) { /* fall back to the implied default */ }

  function g(on) { return on ? 'granted' : 'denied'; }

  gtag('consent', 'default', {
    ad_storage: g(state.marketing),
    ad_user_data: g(state.marketing),
    ad_personalization: g(state.marketing),
    analytics_storage: g(state.analytics),
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500
  });

  gtag('set', 'ads_data_redaction', !state.marketing);
  gtag('set', 'url_passthrough', true);
})();
`.trim()

  return (
    <Script
      id="hl360-consent-default"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: js }}
    />
  )
}
