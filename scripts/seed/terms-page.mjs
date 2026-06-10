import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '2a445j5i',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || '2024-12-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

// Deterministic key helper so re-runs don't churn keys.
let n = 0
const k = (p) => `${p}-${n++}`

// --- Portable Text builders (mirror app/(site)/terms/page.tsx) ---------------
// proseSection -> LegalPortableText. Block styles:
//   normal      -> <p className="text-lg leading-relaxed mb-6">
//   normalMb4   -> <p className="text-lg leading-relaxed mb-4">
//   normalFlush -> <p className="text-lg leading-relaxed">       (last-in-group)
//   h2          -> <h2 className="text-2xl font-bold text-[#1b75bc] mb-6">
//   h3          -> <h3 className="text-xl font-semibold text-[#1b75bc] mb-4">
// Lists:
//   bullet -> <ul className="list-disc pl-6 mb-8 space-y-2">
//   number -> <ol className="list-decimal pl-6 mb-6 space-y-2">
// Margins are picked to mirror each source paragraph's trailing class:
//   text-lg leading-relaxed       -> normalFlush
//   text-lg leading-relaxed mb-4  -> normalMb4
//   text-lg leading-relaxed mb-6  -> normal
const span = (text, marks = []) => ({ _type: 'span', _key: k('s'), text, marks })
const block = (style, children, markDefs = []) => ({ _type: 'block', _key: k('b'), style, markDefs, children })
const p = (children, markDefs = []) => block('normal', children, markDefs) // mb-6
const pMb4 = (children, markDefs = []) => block('normalMb4', children, markDefs) // mb-4
const pFlush = (children, markDefs = []) => block('normalFlush', children, markDefs) // no margin
const h2 = (text) => block('h2', [span(text)])
const h3 = (text) => block('h3', [span(text)])
const oli = (children, markDefs = []) =>
  ({ _type: 'block', _key: k('b'), style: 'normal', listItem: 'number', level: 1, markDefs, children })
const uli = (children, markDefs = []) =>
  ({ _type: 'block', _key: k('b'), style: 'normal', listItem: 'bullet', level: 1, markDefs, children })
const s = (text) => span(text)

// alertCallout body: 'normal'-only PT.
const an = (children, markDefs = []) => block('normal', children, markDefs)

// --- bare proseSection wrapper (lives inside the contentSection shell) --------
const prose = (body) => ({ _type: 'proseSection', _key: k('sec'), bare: true, maxWidth: '4xl', body })

// iconHeading: H2 with leading lucide icon (mb-4, matching source `mb-4`).
const iconH2 = (icon, text) => ({ _type: 'iconHeading', _key: k('sec'), icon, level: 'h2', marginBottom: '4', text })

// --- Body fragments, in source order -----------------------------------------
const content = [
  // 1. Website Ownership (icon FileText) — single flush paragraph.
  iconH2('FileText', 'Website Ownership'),
  prose([
    pFlush([s('This website is owned and operated by My Perfect Leads LLC, 1121 Annapolis RD #218, Odenton, MD 21113, which is referred to below as "My Perfect Leads" or "we" or "us" or "Company" or "our."')]),
  ]),

  // 2. Permitted Use (icon Shield) — two ORDERED lists.
  iconH2('Shield', 'Permitted Use'),
  prose([
    pMb4([s('You agree that:')]),
    oli([s('your use of this website is subject to and governed by these Terms of Use,')]),
    oli([s('you will only access or use this website and transact business with us if you are at least 18 years old,')]),
    oli([s('you will comply with and be bound by these Terms of Use as they appear on this website each time you access and use this website,')]),
    oli([s('each use of this website by you indicates and confirms your assent to and agreement to be bound by these Terms of Use, and')]),
    oli([s('these Terms of Use are a legally binding agreement between you and My Perfect Leads that will be enforceable against you.')]),
    pMb4([s('You agree that you will not use or attempt to use this website for any purpose other than conducting mortgage banking related business with My Perfect Leads as a bona fide client of My Perfect Leads; you may not use or attempt to use this website or any part of this site for any purpose:')]),
    oli([s('that interferes with or induces a breach of the contractual relationships between My Perfect Leads and its employees,')]),
    oli([s('that is any way unlawful or prohibited, or that is harmful or destructive to anyone or their property,')]),
    oli([s('that transmits any advertisements, solicitations, schemes, spam, flooding, or other unsolicited email, unsolicited commercial communications,')]),
    oli([s('that transmits any harmful or disabling computer codes or viruses,')]),
    oli([s('that harvests email addresses from this site,')]),
    oli([s('that transmits unsolicited email to this site or to anyone whose email address included the domain name under on this website,')]),
    oli([s('that interferes with our network services;')]),
    oli([s('that attempts to gain unauthorized access to our network services,')]),
    oli([s('that suggests an express or implied affiliation with My Perfect Leads or broker relationship with My Perfect Leads (without the express written permission of My Perfect Leads),')]),
    oli([s("that impairs or limits our ability to operate this website or any other person's ability to access and use this website, and/or")]),
    oli([s('that uses any methods, means or devices to click on to this website or cause a visit to this website for the purpose of manipulating the results of any Internet search engine, or for any other purpose other than conducting mortgage banking related business with My Perfect Leads as a bona fide client of My Perfect Leads.')]),
    oli([s('that unlawfully impersonates or otherwise misrepresents your affiliation with any person or entity;')]),
    oli([s('that harms minors in any way, including, but not limited to, transmitting or uploading content that violates child pornography laws, child sexual exploitation laws and laws prohibiting the depiction of minors engaged in sexual conduct;')]),
    oli([s('that transmits or uploads pornographic, violent, obscene, sexually explicit, discriminatory, hateful, threatening, abusive, defamatory, offensive, harassing, or otherwise objectionable content or images;')]),
    oli([s('that harms, threatens, harasses, abuses or intimidates another person in any way or involves images or content that depicts, promotes, encourages, indicates, advocates or tends to incite the commission of a crime or other unlawful activities;')]),
    oli([s('that dilutes or depreciates the name and reputation of My Perfect Leads or any of its affiliates;')]),
    oli([s("that transmits or uploads any content or images that infringes any third party's intellectual property rights or infringes any third party's right of privacy; or")]),
    oli([s('that unlawfully transmits or uploads any confidential, proprietary or trade secret information.')]),
  ]),

  // 3. Access to this Website (no icon) — single flush paragraph.
  prose([
    h2('Access to this Website'),
    pFlush([s('My Perfect Leads reserves the right at all times, in its sole discretion and without notice to you, to deny your access to and use of this website.')]),
  ]),

  // 4. Use of this Website (no icon) — single flush paragraph.
  prose([
    h2('Use of this Website'),
    pFlush([s('You agree and acknowledge that you have the sole responsibility and liability for your use of this website and for providing or obtaining, and for maintaining, all of the hardware, software, electrical power, telecommunications, Internet services, and other products or services necessary or desirable for you to access and use this website.')]),
  ]),

  // 5. Intellectual Property Rights (no icon).
  prose([
    h2('Intellectual Property Rights'),
    pMb4([s('"My Perfect Leads" is a registered service mark of My Perfect Leads, LLC. All other marks used on this website are the property of their respective owners.')]),
    h3('Web Page Content:'),
    pMb4([s('You acknowledge and agree that:')]),
    uli([s('all content, Web pages, source code, calculations, products, materials, data, information, text, screens, functionality, services, design, layout, screen interfaces, "look and feel", and the operation of this website (collectively "Web Page Content") are protected by various intellectual property laws, including, but not limited to, copyrights, patents, trade secrets, trademarks, and service marks; and')]),
    uli([s('all rights associated with the Web Page Content are owned by My Perfect Leads, its licensors, or content providers.')]),
    pMb4([s('Furthermore, you acknowledge and agree that you do not acquire any ownership rights by downloading or viewing any Web Page Content. You further acknowledge and agree that you will not in any way copy, reproduce, publish, create derivative works from, perform, upload, post, distribute, transfer, transmit, modify, adapt, reverse engineer, frame in any Web page, or alter the appearance of any Web Page Content.')]),
    pMb4([s('You may not use Web Page Content, domain names (in whole or in part), or Email addresses related to or derived from this website, nor any data, trademarks, functionality, service marks, trade names, brand names and/or logos contained within or derived from this website, for any purpose; meaning that you may not, among other prohibited uses, use any Web Page Content, domain names, Email addresses, data, trademarks, service marks, trade names, brand names and/or logos on or derived from this website:')]),
    uli([s('in or as any meta-tags or hidden text;')]),
    uli([s('in or as part of any contextual marketing directory, index, or triggering term;')]),
    uli([s('as content or advertising related to any other website including, but not limited to, comparative/informational websites; and/or')]),
    uli([s("as a variable or data element in any algorithm that causes another Internet browser to appear on, over, or at the same time as the Company's website or controls the content of any other Internet browser window.")]),
    h3('Submissions:'),
    block('normal', [s("You acknowledge and agree that all submissions to My Perfect Leads containing any comments, improvements, suggestions, and ideas regarding this website will become and remain our exclusive property, including any future rights associated with such submissions, even if the provisions of these Terms of Use are later modified or terminated. This means that you forever disclaim any proprietary rights in such submissions, and you acknowledge My Perfect Leads' unrestricted right to use, publish, and commercially exploit, identical, similar, or derivative ideas originating from your submission, in any medium, now and in the future, without notice, compensation or other obligation to you or any other person.")]),
    h3('Testimonials:'),
    pFlush([s('You acknowledge and agree that all testimonials submitted to My Perfect Leads will become and remain our exclusive property, even if the provisions of these Terms of Use are later modified or terminated. This means that you irrevocably grant to My Perfect Leads the unrestricted right (now and in the future, without notice, compensation or other obligation to you or any other person) to use your statement, image, likeness, as they may be used, in any medium, in connection with an advertisement or for any other publicity purpose. You further agree that My Perfect Leads may use any percentage of your testimonial, image, likeness and/or works, in any way that it sees fit, and may exclude your name or use a fictitious name herewith.')]),
  ]),

  // 6. Linking (no icon).
  prose([
    h2('Linking'),
    h3('Not Responsible For Links to Other websites:'),
    block('normal', [s('For your convenience, this website may provide links to other websites on the World Wide Web. Unless expressly stated otherwise on this website, My Perfect Leads does not endorse, approve, sponsor or control, and we are not in any way responsible for, any of the content, services, calculations, information, products or materials available at or through any websites to which this website may provide a link. By using this website you acknowledge and agree that My Perfect Leads will not be responsible or liable to you or any other person for any damages or claims that might result from your use of such content, services, calculation, information, products or materials.')]),
    h3('No Advertising / No Links:'),
    pFlush([s('My Perfect Leads does not permit third-party advertising on this website. Except with the written permission of My Perfect Leads, you agree that you will not create links from any website or Web page to this website or any Web page within this website.')]),
  ]),

  // 7. Privacy and Security (no icon) — three paragraphs (mb-4, mb-4, flush).
  prose([
    h2('Privacy and Security'),
    pMb4([s('Respecting and protecting the privacy of those who visit or use our website is the number one priority at My Perfect Leads When we collect information from you, we want you to know how it is used. To demonstrate our commitment to fair information practices, we have adopted leading industry privacy guidelines.')]),
    pMb4([s('By using our website, you are consenting to the use of information and agreeing to these guidelines and the other My Perfect Leads policies as listed on our website. My Perfect Leads does not share your personal information with outside companies for their promotional use without your consent.')]),
    pFlush([s("Because of the financial nature of our business, our websites are not designed to appeal to children under the age of 13. Therefore, we don't knowingly attempt to solicit or receive any information from children.")]),
  ]),

  // 8. Communications with Company (no icon) — H2, yellow warning box, then sub-sections.
  prose([
    h2('Communications with Company'),
  ]),
  {
    _type: 'alertCallout',
    _key: k('sec'),
    variant: 'warning',
    icon: 'AlertTriangle',
    rounded: false,
    outerMargin: '6',
    heading: 'Time Sensitive Instructions:',
    body: [
      an([s('When communicating with us through this website, chat or via email, do not use the website, chat or email to communicate any time-sensitive instructions that are in any way related to or affect your loan, loan application or closing (such as interest rates locks, cancellation of a closing, rescissions, or the like). Such instructions may not be honored. All transactions conducted on this website, chat or via email, must be confirmed in writing by us to be accepted by and binding upon us.')]),
    ],
  },
  prose([
    h3('Loan Approvals:'),
    block('normal', [s('All loan approvals, pre-qualifications, pre-approvals, rate locks, deposit and refund agreements, and the like, are only made by My Perfect Leads in writing. Approvals, pre-qualifications and pre-approvals are conditional in accordance with the terms, except as specifically provided for in writing signed by My Perfect Leads.')]),
    h3('Credit Reports:'),
    block('normal', [s('By applying for credit, you are authorizing My Perfect Leads to obtain a copy of your credit report. As a result, a "hard" inquiry may appear on your credit report. A hard inquiry may negatively affect your credit score.')]),
    h3('Recording & Monitoring of Communications:'),
    pFlush([s('Your communications with us via the website, chat email, and telephone may be recorded or monitored and by using such communications methods you are consenting to the recording or monitoring of the same.')]),
  ]),

  // 9. Disclaimers (no icon) — two paragraphs (mb-4, flush).
  prose([
    h2('Disclaimers'),
    pMb4([s('The web page content on or available through this website are provided "as is" and without warranties of any kind, either express or implied. To the fullest extent permissible under applicable law, My Perfect Leads disclaims all warranties, express or implied, including, but not limited to, all implied warranties of merchantability, fitness for a particular purpose, title and non-infringement.')]),
    pFlush([s('My Perfect Leads makes no representation or warranty regarding the web page content or its use thereof. The web page content on or available through this website could include inaccuracies or typographical errors and could become inaccurate because of developments occurring after their respective dates of preparation or publication. My Perfect Leads has no obligation to maintain the currency or accuracy of any web page content on or available through this website.')]),
  ]),

  // 10. Governing Law (icon Scale) — single flush paragraph.
  iconH2('Scale', 'Governing Law'),
  prose([
    pFlush([s('You agree that these Terms of Use shall be governed by and construed in accordance with the laws of the State of Michigan, without giving effect to any principles of conflicts of law. You agree that any action at law or in equity arising out of or relating to these Terms of Use or the use of this website shall be filed only in the state or federal courts located in Wayne County, Michigan, and you hereby consent and submit to the personal jurisdiction of such courts for the purposes of litigating any such action.')]),
  ]),

  // 11. Copyright Infringement (no icon) + gray DMCA contact card.
  prose([
    h2('Copyright Infringement'),
    pMb4([s('My Perfect Leads is committed to protecting copyrights and expects you to do the same. The Digital Millennium Copyright Act of 1998 (the "DMCA") provides recourse for copyright owners who believe that material appearing on the Internet infringes their rights under U.S. copyright law.')]),
    pMb4([s('If you believe in good faith that any material used or displayed on the My Perfect Leads infringes your copyright, you (or your agent) may send us a notice requesting that the material be removed, or access to it blocked.')]),
  ]),
  {
    _type: 'infoCard',
    _key: k('sec'),
    variant: 'grayRows',
    heading: 'DMCA Agent Contact Information:',
    rows: [
      {
        _key: k('r'),
        icon: 'MapPin',
        label: 'By Mail:',
        lines: ['My Perfect Leads', 'Attn: Compliance Team', '1121 Annapolis RD #218', 'Odenton, MD 21113'],
      },
      {
        _key: k('r'),
        icon: 'Mail',
        label: 'By Email:',
        linkLabel: 'help@heloc360.com',
        linkHref: 'mailto:help@heloc360.com',
      },
    ],
  },

  // 12. Your California Privacy Rights (no icon) — two paragraphs (mb-4, flush w/ link).
  prose([
    h2('Your California Privacy Rights'),
    pMb4([s('California Civil Code § 1798.83 permits our visitors who are California residents to request certain information regarding their disclosure of personal information to third parties for their direct marketing purposes.')]),
    pFlush(
      [
        s('To make such a request, please send an email to '),
        span('help@heloc360.com', ['l0']),
        s(' or write us at the address above.'),
      ],
      [{ _key: 'l0', _type: 'link', href: 'mailto:help@heloc360.com' }],
    ),
  ]),

  // 13. Equal Opportunity Employer (no icon) — single flush paragraph w/ tel link.
  prose([
    h2('Equal Opportunity Employer'),
    pFlush(
      [
        s("The Company is an equal opportunity employer. Any complaints or concerns about the Company's employment practices may be directed to the Director of Human Resources at "),
        span('313-488-5625', ['l0']),
        s('.'),
      ],
      [{ _key: 'l0', _type: 'link', href: 'tel:313-488-5625' }],
    ),
  ]),

  // Contact callout (Questions About These Terms?).
  {
    _type: 'contactCallout',
    _key: k('sec'),
    heading: 'Questions About These Terms?',
    bodyText: "If you have any questions about these terms of use or need clarification on any provisions, please don't hesitate to contact us.",
    buttons: [
      { _key: k('btn'), label: 'Email Support Team', href: 'mailto:help@heloc360.com', style: 'primary' },
      { _key: k('btn'), label: 'View Privacy Policy', href: '/privacy', style: 'outline' },
    ],
  },

  // Footer note (Last Updated + Return to Home).
  {
    _type: 'pageFooterNote',
    _key: k('sec'),
    text: 'These terms of use are effective as of the date of your use of our website. We may update these terms from time to time, and we will post any changes on this page.',
    showReturnHome: true,
  },
]

// --- Top-level sections: gradient banner + the single container ---------------
const sections = [
  {
    _type: 'legalHeader',
    _key: k('sec'),
    heading: 'Navigate Your Journey Understanding Terms of Use',
    subheading: 'Please read these terms carefully as they govern your use of our website and services',
  },
  {
    _type: 'contentSection',
    _key: k('sec'),
    maxWidth: '4xl',
    paddingY: '16',
    useProse: true,
    content,
  },
]

const doc = {
  // Dot-free _id: the dataset's anonymous read grant is `_id in path("*")`, which
  // only covers single-segment IDs. A dotted id is NOT publicly readable, so the
  // token-less frontend client would 404. Hyphenated ids render public like posts.
  _id: 'page-terms',
  _type: 'page',
  title: 'Terms of Use',
  // Temporary slug so it does not collide with the live hardcoded /terms route.
  slug: { _type: 'slug', current: 'terms-sanity' },
  sections,
  seoTitle: 'Terms of Use - HELOC360',
  seoDescription:
    "Review HELOC360's terms of use, including website usage guidelines, intellectual property rights, and legal agreements governing your use of our services.",
  canonicalUrl: 'https://heloc360.com/terms',
  noindex: false,
}

const res = await client.createOrReplace(doc)
console.log('Seeded page doc:', res._id, '→ slug', res.slug?.current)
console.log('top-level sections:', res.sections.map((x) => x._type).join(', '))
const cs = res.sections.find((x) => x._type === 'contentSection')
console.log('contentSection.content:', (cs?.content || []).map((x) => x._type).join(', '))
