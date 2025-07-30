import Link from "next/link"
import { Scale, Shield, FileText, AlertTriangle, Mail, MapPin } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Use - HELOC360",
  description:
    "Review HELOC360's terms of use, including website usage guidelines, intellectual property rights, and legal agreements governing your use of our services.",
  alternates: {
    canonical: "https://heloc360.com/terms",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#1b75bc] to-[#02c39a] py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Navigate Your Journey Understanding Terms of Use</h1>
            <p className="text-lg opacity-90">
              Please read these terms carefully as they govern your use of our website and services
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg prose-gray">
            {/* Website Ownership */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#1b75bc] mb-4 flex items-center gap-3">
                <FileText className="w-6 h-6" />
                Website Ownership
              </h2>
              <p className="text-lg leading-relaxed">
                This website is owned and operated by My Perfect Leads LLC, 1121 Annapolis RD #218, Odenton, MD 21113,
                which is referred to below as "My Perfect Leads" or "we" or "us" or "Company" or "our."
              </p>
            </div>

            {/* Permitted Use */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#1b75bc] mb-4 flex items-center gap-3">
                <Shield className="w-6 h-6" />
                Permitted Use
              </h2>
              <p className="text-lg leading-relaxed mb-4">You agree that:</p>
              <ol className="list-decimal pl-6 space-y-2 mb-6">
                <li>your use of this website is subject to and governed by these Terms of Use,</li>
                <li>
                  you will only access or use this website and transact business with us if you are at least 18 years
                  old,
                </li>
                <li>
                  you will comply with and be bound by these Terms of Use as they appear on this website each time you
                  access and use this website,
                </li>
                <li>
                  each use of this website by you indicates and confirms your assent to and agreement to be bound by
                  these Terms of Use, and
                </li>
                <li>
                  these Terms of Use are a legally binding agreement between you and My Perfect Leads that will be
                  enforceable against you.
                </li>
              </ol>

              <p className="text-lg leading-relaxed mb-4">
                You agree that you will not use or attempt to use this website for any purpose other than conducting
                mortgage banking related business with My Perfect Leads as a bona fide client of My Perfect Leads; you
                may not use or attempt to use this website or any part of this site for any purpose:
              </p>

              <ol className="list-decimal pl-6 space-y-2 text-sm">
                <li>
                  that interferes with or induces a breach of the contractual relationships between My Perfect Leads and
                  its employees,
                </li>
                <li>
                  that is any way unlawful or prohibited, or that is harmful or destructive to anyone or their property,
                </li>
                <li>
                  that transmits any advertisements, solicitations, schemes, spam, flooding, or other unsolicited email,
                  unsolicited commercial communications,
                </li>
                <li>that transmits any harmful or disabling computer codes or viruses,</li>
                <li>that harvests email addresses from this site,</li>
                <li>
                  that transmits unsolicited email to this site or to anyone whose email address included the domain
                  name under on this website,
                </li>
                <li>that interferes with our network services;</li>
                <li>that attempts to gain unauthorized access to our network services,</li>
                <li>
                  that suggests an express or implied affiliation with My Perfect Leads or broker relationship with My
                  Perfect Leads (without the express written permission of My Perfect Leads),
                </li>
                <li>
                  that impairs or limits our ability to operate this website or any other person's ability to access and
                  use this website, and/or
                </li>
                <li>
                  that uses any methods, means or devices to click on to this website or cause a visit to this website
                  for the purpose of manipulating the results of any Internet search engine, or for any other purpose
                  other than conducting mortgage banking related business with My Perfect Leads as a bona fide client of
                  My Perfect Leads.
                </li>
                <li>
                  that unlawfully impersonates or otherwise misrepresents your affiliation with any person or entity;
                </li>
                <li>
                  that harms minors in any way, including, but not limited to, transmitting or uploading content that
                  violates child pornography laws, child sexual exploitation laws and laws prohibiting the depiction of
                  minors engaged in sexual conduct;
                </li>
                <li>
                  that transmits or uploads pornographic, violent, obscene, sexually explicit, discriminatory, hateful,
                  threatening, abusive, defamatory, offensive, harassing, or otherwise objectionable content or images;
                </li>
                <li>
                  that harms, threatens, harasses, abuses or intimidates another person in any way or involves images or
                  content that depicts, promotes, encourages, indicates, advocates or tends to incite the commission of
                  a crime or other unlawful activities;
                </li>
                <li>
                  that dilutes or depreciates the name and reputation of My Perfect Leads or any of its affiliates;
                </li>
                <li>
                  that transmits or uploads any content or images that infringes any third party's intellectual property
                  rights or infringes any third party's right of privacy; or
                </li>
                <li>that unlawfully transmits or uploads any confidential, proprietary or trade secret information.</li>
              </ol>
            </div>

            {/* Access to Website */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#1b75bc] mb-4">Access to this Website</h2>
              <p className="text-lg leading-relaxed">
                My Perfect Leads reserves the right at all times, in its sole discretion and without notice to you, to
                deny your access to and use of this website.
              </p>
            </div>

            {/* Use of Website */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#1b75bc] mb-4">Use of this Website</h2>
              <p className="text-lg leading-relaxed">
                You agree and acknowledge that you have the sole responsibility and liability for your use of this
                website and for providing or obtaining, and for maintaining, all of the hardware, software, electrical
                power, telecommunications, Internet services, and other products or services necessary or desirable for
                you to access and use this website.
              </p>
            </div>

            {/* Intellectual Property Rights */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#1b75bc] mb-4">Intellectual Property Rights</h2>
              <p className="text-lg leading-relaxed mb-4">
                "My Perfect Leads" is a registered service mark of My Perfect Leads, LLC. All other marks used on this
                website are the property of their respective owners.
              </p>

              <h3 className="text-xl font-semibold text-[#1b75bc] mb-4">Web Page Content:</h3>
              <p className="text-lg leading-relaxed mb-4">You acknowledge and agree that:</p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>
                  all content, Web pages, source code, calculations, products, materials, data, information, text,
                  screens, functionality, services, design, layout, screen interfaces, "look and feel", and the
                  operation of this website (collectively "Web Page Content") are protected by various intellectual
                  property laws, including, but not limited to, copyrights, patents, trade secrets, trademarks, and
                  service marks; and
                </li>
                <li>
                  all rights associated with the Web Page Content are owned by My Perfect Leads, its licensors, or
                  content providers.
                </li>
              </ul>

              <p className="text-lg leading-relaxed mb-4">
                Furthermore, you acknowledge and agree that you do not acquire any ownership rights by downloading or
                viewing any Web Page Content. You further acknowledge and agree that you will not in any way copy,
                reproduce, publish, create derivative works from, perform, upload, post, distribute, transfer, transmit,
                modify, adapt, reverse engineer, frame in any Web page, or alter the appearance of any Web Page Content.
              </p>

              <p className="text-lg leading-relaxed mb-4">
                You may not use Web Page Content, domain names (in whole or in part), or Email addresses related to or
                derived from this website, nor any data, trademarks, functionality, service marks, trade names, brand
                names and/or logos contained within or derived from this website, for any purpose; meaning that you may
                not, among other prohibited uses, use any Web Page Content, domain names, Email addresses, data,
                trademarks, service marks, trade names, brand names and/or logos on or derived from this website:
              </p>

              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>in or as any meta-tags or hidden text;</li>
                <li>in or as part of any contextual marketing directory, index, or triggering term;</li>
                <li>
                  as content or advertising related to any other website including, but not limited to,
                  comparative/informational websites; and/or
                </li>
                <li>
                  as a variable or data element in any algorithm that causes another Internet browser to appear on,
                  over, or at the same time as the Company's website or controls the content of any other Internet
                  browser window.
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-[#1b75bc] mb-4">Submissions:</h3>
              <p className="text-lg leading-relaxed mb-6">
                You acknowledge and agree that all submissions to My Perfect Leads containing any comments,
                improvements, suggestions, and ideas regarding this website will become and remain our exclusive
                property, including any future rights associated with such submissions, even if the provisions of these
                Terms of Use are later modified or terminated. This means that you forever disclaim any proprietary
                rights in such submissions, and you acknowledge My Perfect Leads' unrestricted right to use, publish,
                and commercially exploit, identical, similar, or derivative ideas originating from your submission, in
                any medium, now and in the future, without notice, compensation or other obligation to you or any other
                person.
              </p>

              <h3 className="text-xl font-semibold text-[#1b75bc] mb-4">Testimonials:</h3>
              <p className="text-lg leading-relaxed">
                You acknowledge and agree that all testimonials submitted to My Perfect Leads will become and remain our
                exclusive property, even if the provisions of these Terms of Use are later modified or terminated. This
                means that you irrevocably grant to My Perfect Leads the unrestricted right (now and in the future,
                without notice, compensation or other obligation to you or any other person) to use your statement,
                image, likeness, as they may be used, in any medium, in connection with an advertisement or for any
                other publicity purpose. You further agree that My Perfect Leads may use any percentage of your
                testimonial, image, likeness and/or works, in any way that it sees fit, and may exclude your name or use
                a fictitious name herewith.
              </p>
            </div>

            {/* Linking */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#1b75bc] mb-4">Linking</h2>

              <h3 className="text-xl font-semibold text-[#1b75bc] mb-4">
                Not Responsible For Links to Other websites:
              </h3>
              <p className="text-lg leading-relaxed mb-6">
                For your convenience, this website may provide links to other websites on the World Wide Web. Unless
                expressly stated otherwise on this website, My Perfect Leads does not endorse, approve, sponsor or
                control, and we are not in any way responsible for, any of the content, services, calculations,
                information, products or materials available at or through any websites to which this website may
                provide a link. By using this website you acknowledge and agree that My Perfect Leads will not be
                responsible or liable to you or any other person for any damages or claims that might result from your
                use of such content, services, calculation, information, products or materials.
              </p>

              <h3 className="text-xl font-semibold text-[#1b75bc] mb-4">No Advertising / No Links:</h3>
              <p className="text-lg leading-relaxed">
                My Perfect Leads does not permit third-party advertising on this website. Except with the written
                permission of My Perfect Leads, you agree that you will not create links from any website or Web page to
                this website or any Web page within this website.
              </p>
            </div>

            {/* Privacy and Security */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#1b75bc] mb-4">Privacy and Security</h2>
              <p className="text-lg leading-relaxed mb-4">
                Respecting and protecting the privacy of those who visit or use our website is the number one priority
                at My Perfect Leads When we collect information from you, we want you to know how it is used. To
                demonstrate our commitment to fair information practices, we have adopted leading industry privacy
                guidelines.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                By using our website, you are consenting to the use of information and agreeing to these guidelines and
                the other My Perfect Leads policies as listed on our website. My Perfect Leads does not share your
                personal information with outside companies for their promotional use without your consent.
              </p>
              <p className="text-lg leading-relaxed">
                Because of the financial nature of our business, our websites are not designed to appeal to children
                under the age of 13. Therefore, we don't knowingly attempt to solicit or receive any information from
                children.
              </p>
            </div>

            {/* Communications with Company */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#1b75bc] mb-4">Communications with Company</h2>

              <div className="bg-yellow-50 border-l-4 border-l-yellow-400 p-6 mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-yellow-800 mb-2">Time Sensitive Instructions:</h3>
                    <p className="text-yellow-700 text-sm">
                      When communicating with us through this website, chat or via email, do not use the website, chat
                      or email to communicate any time-sensitive instructions that are in any way related to or affect
                      your loan, loan application or closing (such as interest rates locks, cancellation of a closing,
                      rescissions, or the like). Such instructions may not be honored. All transactions conducted on
                      this website, chat or via email, must be confirmed in writing by us to be accepted by and binding
                      upon us.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-[#1b75bc] mb-4">Loan Approvals:</h3>
              <p className="text-lg leading-relaxed mb-6">
                All loan approvals, pre-qualifications, pre-approvals, rate locks, deposit and refund agreements, and
                the like, are only made by My Perfect Leads in writing. Approvals, pre-qualifications and pre-approvals
                are conditional in accordance with the terms, except as specifically provided for in writing signed by
                My Perfect Leads.
              </p>

              <h3 className="text-xl font-semibold text-[#1b75bc] mb-4">Credit Reports:</h3>
              <p className="text-lg leading-relaxed mb-6">
                By applying for credit, you are authorizing My Perfect Leads to obtain a copy of your credit report. As
                a result, a "hard" inquiry may appear on your credit report. A hard inquiry may negatively affect your
                credit score.
              </p>

              <h3 className="text-xl font-semibold text-[#1b75bc] mb-4">Recording & Monitoring of Communications:</h3>
              <p className="text-lg leading-relaxed">
                Your communications with us via the website, chat email, and telephone may be recorded or monitored and
                by using such communications methods you are consenting to the recording or monitoring of the same.
              </p>
            </div>

            {/* Disclaimers */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#1b75bc] mb-4">Disclaimers</h2>
              <p className="text-lg leading-relaxed mb-4">
                The web page content on or available through this website are provided "as is" and without warranties of
                any kind, either express or implied. To the fullest extent permissible under applicable law, My Perfect
                Leads disclaims all warranties, express or implied, including, but not limited to, all implied
                warranties of merchantability, fitness for a particular purpose, title and non-infringement.
              </p>
              <p className="text-lg leading-relaxed">
                My Perfect Leads makes no representation or warranty regarding the web page content or its use thereof.
                The web page content on or available through this website could include inaccuracies or typographical
                errors and could become inaccurate because of developments occurring after their respective dates of
                preparation or publication. My Perfect Leads has no obligation to maintain the currency or accuracy of
                any web page content on or available through this website.
              </p>
            </div>

            {/* Governing Law */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#1b75bc] mb-4 flex items-center gap-3">
                <Scale className="w-6 h-6" />
                Governing Law
              </h2>
              <p className="text-lg leading-relaxed">
                You agree that these Terms of Use shall be governed by and construed in accordance with the laws of the
                State of Michigan, without giving effect to any principles of conflicts of law. You agree that any
                action at law or in equity arising out of or relating to these Terms of Use or the use of this website
                shall be filed only in the state or federal courts located in Wayne County, Michigan, and you hereby
                consent and submit to the personal jurisdiction of such courts for the purposes of litigating any such
                action.
              </p>
            </div>

            {/* Copyright Infringement */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#1b75bc] mb-4">Copyright Infringement</h2>
              <p className="text-lg leading-relaxed mb-4">
                My Perfect Leads is committed to protecting copyrights and expects you to do the same. The Digital
                Millennium Copyright Act of 1998 (the "DMCA") provides recourse for copyright owners who believe that
                material appearing on the Internet infringes their rights under U.S. copyright law.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                If you believe in good faith that any material used or displayed on the My Perfect Leads infringes your
                copyright, you (or your agent) may send us a notice requesting that the material be removed, or access
                to it blocked.
              </p>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-[#1b75bc] mb-4">DMCA Agent Contact Information:</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">By Mail:</p>
                      <p className="text-gray-700">
                        My Perfect Leads
                        <br />
                        Attn: Compliance Team
                        <br />
                        1121 Annapolis RD #218
                        <br />
                        Odenton, MD 21113
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium">By Email:</p>
                      <a
                        href="mailto:help@heloc360.com"
                        className="text-[#1b75bc] hover:text-[#02c39a] transition-colors"
                      >
                        help@heloc360.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* California Privacy Rights */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#1b75bc] mb-4">Your California Privacy Rights</h2>
              <p className="text-lg leading-relaxed mb-4">
                California Civil Code § 1798.83 permits our visitors who are California residents to request certain
                information regarding their disclosure of personal information to third parties for their direct
                marketing purposes.
              </p>
              <p className="text-lg leading-relaxed">
                To make such a request, please send an email to{" "}
                <a href="mailto:help@heloc360.com" className="text-[#1b75bc] hover:text-[#02c39a] transition-colors">
                  help@heloc360.com
                </a>{" "}
                or write us at the address above.
              </p>
            </div>

            {/* Equal Opportunity */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#1b75bc] mb-4">Equal Opportunity Employer</h2>
              <p className="text-lg leading-relaxed">
                The Company is an equal opportunity employer. Any complaints or concerns about the Company's employment
                practices may be directed to the Director of Human Resources at{" "}
                <a href="tel:313-488-5625" className="text-[#1b75bc] hover:text-[#02c39a] transition-colors">
                  313-488-5625
                </a>
                .
              </p>
            </div>

            {/* Contact Section */}
            <div className="bg-gradient-to-r from-[#1b75bc]/10 to-[#02c39a]/10 p-8 rounded-lg">
              <h3 className="text-xl font-semibold text-[#1b75bc] mb-4">Questions About These Terms?</h3>
              <p className="text-lg leading-relaxed mb-6">
                If you have any questions about these terms of use or need clarification on any provisions, please don't
                hesitate to contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="mailto:help@heloc360.com"
                  className="inline-flex items-center justify-center px-6 py-3 bg-[#1b75bc] hover:bg-[#1b75bc]/90 text-white font-medium rounded-lg transition-colors"
                >
                  Email Support Team
                </a>
                <Link
                  href="/privacy"
                  className="inline-flex items-center justify-center px-6 py-3 border border-[#1b75bc] text-[#1b75bc] hover:bg-[#1b75bc] hover:text-white font-medium rounded-lg transition-colors"
                >
                  View Privacy Policy
                </Link>
              </div>
            </div>

            {/* Last Updated */}
            <div className="text-center mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                These terms of use are effective as of the date of your use of our website. We may update these terms
                from time to time, and we will post any changes on this page.
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <Link href="/" className="text-[#1b75bc] hover:text-[#02c39a] transition-colors">
                  Return to Home
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
