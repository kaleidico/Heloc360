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

// --- Portable Text builders (mirror app/(site)/terms/page.tsx exactly) -------
const span = (text, marks = []) => ({ _type: 'span', _key: k('s'), text, marks })
// paragraph styles map to the source's exact bottom-margin utilities:
//   'normal'       → mb-4
//   'normal-mb6'   → mb-6
//   'normal-flush' → (no margin; group's mb-12 governs spacing)
const p = (children, markDefs = []) => ({ _type: 'block', _key: k('b'), style: 'normal', markDefs, children })
const p6 = (children, markDefs = []) => ({ _type: 'block', _key: k('b'), style: 'normal-mb6', markDefs, children })
const pf = (children, markDefs = []) => ({ _type: 'block', _key: k('b'), style: 'normal-flush', markDefs, children })
const h3 = (text) => ({ _type: 'block', _key: k('b'), style: 'h3', markDefs: [], children: [span(text)] })
const oli = (children, markDefs = []) => ({ _type: 'block', _key: k('b'), style: 'normal', listItem: 'number', level: 1, markDefs, children })
const oliSm = (children, markDefs = []) => ({ _type: 'block', _key: k('b'), style: 'normal', listItem: 'number-sm', level: 1, markDefs, children })
const uli = (children, markDefs = []) => ({ _type: 'block', _key: k('b'), style: 'normal', listItem: 'bullet', level: 1, markDefs, children })

const s = (text) => span(text)

// --- Group bodies -----------------------------------------------------------

// 1. Website Ownership (icon FileText)
const g1 = {
  _key: k('g'), _type: 'headingGroup', icon: 'FileText', heading: 'Website Ownership',
  body: [
    pf([s('This website is owned and operated by My Perfect Leads LLC, 1121 Annapolis RD #218, Odenton, MD 21113, which is referred to below as "My Perfect Leads" or "we" or "us" or "Company" or "our."')]),
  ],
}

// 2. Permitted Use (icon Shield)
const g2 = {
  _key: k('g'), _type: 'headingGroup', icon: 'Shield', heading: 'Permitted Use',
  body: [
    p([s('You agree that:')]),
    oli([s('your use of this website is subject to and governed by these Terms of Use,')]),
    oli([s('you will only access or use this website and transact business with us if you are at least 18 years old,')]),
    oli([s('you will comply with and be bound by these Terms of Use as they appear on this website each time you access and use this website,')]),
    oli([s('each use of this website by you indicates and confirms your assent to and agreement to be bound by these Terms of Use, and')]),
    oli([s('these Terms of Use are a legally binding agreement between you and My Perfect Leads that will be enforceable against you.')]),
    p([s('You agree that you will not use or attempt to use this website for any purpose other than conducting mortgage banking related business with My Perfect Leads as a bona fide client of My Perfect Leads; you may not use or attempt to use this website or any part of this site for any purpose:')]),
    oliSm([s('that interferes with or induces a breach of the contractual relationships between My Perfect Leads and its employees,')]),
    oliSm([s('that is any way unlawful or prohibited, or that is harmful or destructive to anyone or their property,')]),
    oliSm([s('that transmits any advertisements, solicitations, schemes, spam, flooding, or other unsolicited email, unsolicited commercial communications,')]),
    oliSm([s('that transmits any harmful or disabling computer codes or viruses,')]),
    oliSm([s('that harvests email addresses from this site,')]),
    oliSm([s('that transmits unsolicited email to this site or to anyone whose email address included the domain name under on this website,')]),
    oliSm([s('that interferes with our network services;')]),
    oliSm([s('that attempts to gain unauthorized access to our network services,')]),
    oliSm([s('that suggests an express or implied affiliation with My Perfect Leads or broker relationship with My Perfect Leads (without the express written permission of My Perfect Leads),')]),
    oliSm([s("that impairs or limits our ability to operate this website or any other person's ability to access and use this website, and/or")]),
    oliSm([s('that uses any methods, means or devices to click on to this website or cause a visit to this website for the purpose of manipulating the results of any Internet search engine, or for any other purpose other than conducting mortgage banking related business with My Perfect Leads as a bona fide client of My Perfect Leads.')]),
    oliSm([s('that unlawfully impersonates or otherwise misrepresents your affiliation with any person or entity;')]),
    oliSm([s('that harms minors in any way, including, but not limited to, transmitting or uploading content that violates child pornography laws, child sexual exploitation laws and laws prohibiting the depiction of minors engaged in sexual conduct;')]),
    oliSm([s('that transmits or uploads pornographic, violent, obscene, sexually explicit, discriminatory, hateful, threatening, abusive, defamatory, offensive, harassing, or otherwise objectionable content or images;')]),
    oliSm([s('that harms, threatens, harasses, abuses or intimidates another person in any way or involves images or content that depicts, promotes, encourages, indicates, advocates or tends to incite the commission of a crime or other unlawful activities;')]),
    oliSm([s('that dilutes or depreciates the name and reputation of My Perfect Leads or any of its affiliates;')]),
    oliSm([s("that transmits or uploads any content or images that infringes any third party's intellectual property rights or infringes any third party's right of privacy; or")]),
    oliSm([s('that unlawfully transmits or uploads any confidential, proprietary or trade secret information.')]),
  ],
}

// 3. Access to this Website (no icon)
const g3 = {
  _key: k('g'), _type: 'headingGroup', heading: 'Access to this Website',
  body: [
    pf([s('My Perfect Leads reserves the right at all times, in its sole discretion and without notice to you, to deny your access to and use of this website.')]),
  ],
}

// 4. Use of this Website (no icon)
const g4 = {
  _key: k('g'), _type: 'headingGroup', heading: 'Use of this Website',
  body: [
    pf([s('You agree and acknowledge that you have the sole responsibility and liability for your use of this website and for providing or obtaining, and for maintaining, all of the hardware, software, electrical power, telecommunications, Internet services, and other products or services necessary or desirable for you to access and use this website.')]),
  ],
}

// 5. Intellectual Property Rights (no icon)
const g5 = {
  _key: k('g'), _type: 'headingGroup', heading: 'Intellectual Property Rights',
  body: [
    p([s('"My Perfect Leads" is a registered service mark of My Perfect Leads, LLC. All other marks used on this website are the property of their respective owners.')]),
    h3('Web Page Content:'),
    p([s('You acknowledge and agree that:')]),
    uli([s('all content, Web pages, source code, calculations, products, materials, data, information, text, screens, functionality, services, design, layout, screen interfaces, "look and feel", and the operation of this website (collectively "Web Page Content") are protected by various intellectual property laws, including, but not limited to, copyrights, patents, trade secrets, trademarks, and service marks; and')]),
    uli([s('all rights associated with the Web Page Content are owned by My Perfect Leads, its licensors, or content providers.')]),
    p6([s('Furthermore, you acknowledge and agree that you do not acquire any ownership rights by downloading or viewing any Web Page Content. You further acknowledge and agree that you will not in any way copy, reproduce, publish, create derivative works from, perform, upload, post, distribute, transfer, transmit, modify, adapt, reverse engineer, frame in any Web page, or alter the appearance of any Web Page Content.')]),
    p6([s('You may not use Web Page Content, domain names (in whole or in part), or Email addresses related to or derived from this website, nor any data, trademarks, functionality, service marks, trade names, brand names and/or logos contained within or derived from this website, for any purpose; meaning that you may not, among other prohibited uses, use any Web Page Content, domain names, Email addresses, data, trademarks, service marks, trade names, brand names and/or logos on or derived from this website:')]),
    uli([s('in or as any meta-tags or hidden text;')]),
    uli([s('in or as part of any contextual marketing directory, index, or triggering term;')]),
    uli([s('as content or advertising related to any other website including, but not limited to, comparative/informational websites; and/or')]),
    uli([s("as a variable or data element in any algorithm that causes another Internet browser to appear on, over, or at the same time as the Company's website or controls the content of any other Internet browser window.")]),
    h3('Submissions:'),
    p6([s("You acknowledge and agree that all submissions to My Perfect Leads containing any comments, improvements, suggestions, and ideas regarding this website will become and remain our exclusive property, including any future rights associated with such submissions, even if the provisions of these Terms of Use are later modified or terminated. This means that you forever disclaim any proprietary rights in such submissions, and you acknowledge My Perfect Leads' unrestricted right to use, publish, and commercially exploit, identical, similar, or derivative ideas originating from your submission, in any medium, now and in the future, without notice, compensation or other obligation to you or any other person.")]),
    h3('Testimonials:'),
    pf([s('You acknowledge and agree that all testimonials submitted to My Perfect Leads will become and remain our exclusive property, even if the provisions of these Terms of Use are later modified or terminated. This means that you irrevocably grant to My Perfect Leads the unrestricted right (now and in the future, without notice, compensation or other obligation to you or any other person) to use your statement, image, likeness, as they may be used, in any medium, in connection with an advertisement or for any other publicity purpose. You further agree that My Perfect Leads may use any percentage of your testimonial, image, likeness and/or works, in any way that it sees fit, and may exclude your name or use a fictitious name herewith.')]),
  ],
}

// 6. Linking (no icon)
const g6 = {
  _key: k('g'), _type: 'headingGroup', heading: 'Linking',
  body: [
    h3('Not Responsible For Links to Other websites:'),
    p6([s('For your convenience, this website may provide links to other websites on the World Wide Web. Unless expressly stated otherwise on this website, My Perfect Leads does not endorse, approve, sponsor or control, and we are not in any way responsible for, any of the content, services, calculations, information, products or materials available at or through any websites to which this website may provide a link. By using this website you acknowledge and agree that My Perfect Leads will not be responsible or liable to you or any other person for any damages or claims that might result from your use of such content, services, calculation, information, products or materials.')]),
    h3('No Advertising / No Links:'),
    pf([s('My Perfect Leads does not permit third-party advertising on this website. Except with the written permission of My Perfect Leads, you agree that you will not create links from any website or Web page to this website or any Web page within this website.')]),
  ],
}

// 7. Privacy and Security (no icon)
const g7 = {
  _key: k('g'), _type: 'headingGroup', heading: 'Privacy and Security',
  body: [
    p([s('Respecting and protecting the privacy of those who visit or use our website is the number one priority at My Perfect Leads When we collect information from you, we want you to know how it is used. To demonstrate our commitment to fair information practices, we have adopted leading industry privacy guidelines.')]),
    p([s('By using our website, you are consenting to the use of information and agreeing to these guidelines and the other My Perfect Leads policies as listed on our website. My Perfect Leads does not share your personal information with outside companies for their promotional use without your consent.')]),
    pf([s("Because of the financial nature of our business, our websites are not designed to appeal to children under the age of 13. Therefore, we don't knowingly attempt to solicit or receive any information from children.")]),
  ],
}

// 8. Communications with Company (no icon)
const g8 = {
  _key: k('g'), _type: 'headingGroup', heading: 'Communications with Company',
  body: [
    {
      _type: 'alertCallout', _key: k('a'), icon: 'AlertTriangle',
      heading: 'Time Sensitive Instructions:',
      text: 'When communicating with us through this website, chat or via email, do not use the website, chat or email to communicate any time-sensitive instructions that are in any way related to or affect your loan, loan application or closing (such as interest rates locks, cancellation of a closing, rescissions, or the like). Such instructions may not be honored. All transactions conducted on this website, chat or via email, must be confirmed in writing by us to be accepted by and binding upon us.',
    },
    h3('Loan Approvals:'),
    p6([s('All loan approvals, pre-qualifications, pre-approvals, rate locks, deposit and refund agreements, and the like, are only made by My Perfect Leads in writing. Approvals, pre-qualifications and pre-approvals are conditional in accordance with the terms, except as specifically provided for in writing signed by My Perfect Leads.')]),
    h3('Credit Reports:'),
    p6([s('By applying for credit, you are authorizing My Perfect Leads to obtain a copy of your credit report. As a result, a "hard" inquiry may appear on your credit report. A hard inquiry may negatively affect your credit score.')]),
    h3('Recording & Monitoring of Communications:'),
    pf([s('Your communications with us via the website, chat email, and telephone may be recorded or monitored and by using such communications methods you are consenting to the recording or monitoring of the same.')]),
  ],
}

// 9. Disclaimers (no icon)
const g9 = {
  _key: k('g'), _type: 'headingGroup', heading: 'Disclaimers',
  body: [
    p([s('The web page content on or available through this website are provided "as is" and without warranties of any kind, either express or implied. To the fullest extent permissible under applicable law, My Perfect Leads disclaims all warranties, express or implied, including, but not limited to, all implied warranties of merchantability, fitness for a particular purpose, title and non-infringement.')]),
    pf([s('My Perfect Leads makes no representation or warranty regarding the web page content or its use thereof. The web page content on or available through this website could include inaccuracies or typographical errors and could become inaccurate because of developments occurring after their respective dates of preparation or publication. My Perfect Leads has no obligation to maintain the currency or accuracy of any web page content on or available through this website.')]),
  ],
}

// 10. Governing Law (icon Scale)
const g10 = {
  _key: k('g'), _type: 'headingGroup', icon: 'Scale', heading: 'Governing Law',
  body: [
    pf([s('You agree that these Terms of Use shall be governed by and construed in accordance with the laws of the State of Michigan, without giving effect to any principles of conflicts of law. You agree that any action at law or in equity arising out of or relating to these Terms of Use or the use of this website shall be filed only in the state or federal courts located in Wayne County, Michigan, and you hereby consent and submit to the personal jurisdiction of such courts for the purposes of litigating any such action.')]),
  ],
}

// 11. Copyright Infringement (no icon) + gray DMCA contact card
const g11 = {
  _key: k('g'), _type: 'headingGroup', heading: 'Copyright Infringement',
  body: [
    p([s('My Perfect Leads is committed to protecting copyrights and expects you to do the same. The Digital Millennium Copyright Act of 1998 (the "DMCA") provides recourse for copyright owners who believe that material appearing on the Internet infringes their rights under U.S. copyright law.')]),
    p([s('If you believe in good faith that any material used or displayed on the My Perfect Leads infringes your copyright, you (or your agent) may send us a notice requesting that the material be removed, or access to it blocked.')]),
    {
      _type: 'contactCard', _key: k('c'),
      heading: 'DMCA Agent Contact Information:',
      rows: [
        {
          _key: k('r'), icon: 'MapPin', label: 'By Mail:',
          lines: ['My Perfect Leads', 'Attn: Compliance Team', '1121 Annapolis RD #218', 'Odenton, MD 21113'],
        },
        {
          _key: k('r'), icon: 'Mail', label: 'By Email:',
          linkLabel: 'help@heloc360.com', linkHref: 'mailto:help@heloc360.com',
        },
      ],
    },
  ],
}

// 12. Your California Privacy Rights (no icon)
const g12 = {
  _key: k('g'), _type: 'headingGroup', heading: 'Your California Privacy Rights',
  body: [
    p([s('California Civil Code § 1798.83 permits our visitors who are California residents to request certain information regarding their disclosure of personal information to third parties for their direct marketing purposes.')]),
    pf(
      [
        s('To make such a request, please send an email to '),
        span('help@heloc360.com', ['l0']),
        s(' or write us at the address above.'),
      ],
      [{ _key: 'l0', _type: 'link', href: 'mailto:help@heloc360.com' }],
    ),
  ],
}

// 13. Equal Opportunity Employer (no icon)
const g13 = {
  _key: k('g'), _type: 'headingGroup', heading: 'Equal Opportunity Employer',
  body: [
    pf(
      [
        s("The Company is an equal opportunity employer. Any complaints or concerns about the Company's employment practices may be directed to the Director of Human Resources at "),
        span('313-488-5625', ['l0']),
        s('.'),
      ],
      [{ _key: 'l0', _type: 'link', href: 'tel:313-488-5625' }],
    ),
  ],
}

const doc = {
  // Dot-free _id: the dataset's anonymous read grant is `_id in path("*")`, which
  // only covers single-segment IDs. A dotted id is NOT publicly readable, so the
  // token-less frontend client would 404. Hyphenated ids render public like posts.
  _id: 'page-terms',
  _type: 'page',
  title: 'Terms of Use',
  // Temporary slug so it does not collide with the live hardcoded /terms route.
  slug: { _type: 'slug', current: 'terms-sanity' },
  sections: [
    {
      _type: 'legalHeader', _key: k('sec'),
      heading: 'Navigate Your Journey Understanding Terms of Use',
      subheading: 'Please read these terms carefully as they govern your use of our website and services',
    },
    {
      _type: 'legalContent', _key: k('sec'),
      groups: [g1, g2, g3, g4, g5, g6, g7, g8, g9, g10, g11, g12, g13],
      contactCallout: {
        heading: 'Questions About These Terms?',
        bodyText: "If you have any questions about these terms of use or need clarification on any provisions, please don't hesitate to contact us.",
        emailLabel: 'Email Support Team',
        emailHref: 'mailto:help@heloc360.com',
        secondaryLabel: 'View Privacy Policy',
        secondaryHref: '/privacy',
      },
      footer: {
        text: 'These terms of use are effective as of the date of your use of our website. We may update these terms from time to time, and we will post any changes on this page.',
        showReturnHome: true,
      },
    },
  ],
  seoTitle: 'Terms of Use - HELOC360',
  seoDescription:
    "Review HELOC360's terms of use, including website usage guidelines, intellectual property rights, and legal agreements governing your use of our services.",
  canonicalUrl: 'https://heloc360.com/terms',
  noindex: false,
}

const res = await client.createOrReplace(doc)
console.log('Seeded page doc:', res._id, '→ slug', res.slug?.current)
