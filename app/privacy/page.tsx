import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy - HELOC360",
  description:
    "Learn how HELOC360 protects your privacy and personal information. Our comprehensive privacy policy outlines our data collection, usage, and security practices.",
  alternates: {
    canonical: "https://heloc360.com/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#1b75bc] to-[#02c39a] py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your Security, Our Priority Understanding Our Policies
            </h1>
            <p className="text-lg opacity-90">
              We respect and protect the privacy of those who visit or use our website
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg prose-gray">
            <p className="text-lg leading-relaxed mb-6">
              heloc360.com is a mortgage research and education website provided by{" "}
              <a
                href="https://myperfectleads.com/"
                target="_blank"
                rel="noreferrer noopener"
                className="text-[#1b75bc] hover:text-[#02c39a] transition-colors"
              >
                My Perfect Leads, LLC
              </a>
              . At My Perfect Leads, we have dedicated ourselves to making the home loan process as convenient as
              possible while helping individuals use their home financing options as a tool to manage their financial
              lives. In that effort, we respect and protect the privacy of those who visit or use our website. When we
              collect information from you, we want you to know how it is used. To demonstrate our commitment to fair
              information practices, we have adopted leading industry privacy guidelines.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              By using our website, you are consenting to the use of information and agreeing to these guidelines and
              the other My Perfect Leads policies described on our website.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              My Perfect Leads does not share your personal information with outside companies for their promotional use
              without your consent.
            </p>

            <p className="text-lg leading-relaxed mb-8">
              Because of the financial nature of our business, our websites are not designed to appeal to children under
              the age of 13. Therefore, we don't knowingly attempt to solicit or receive any information from children.
            </p>

            <h2 className="text-2xl font-bold text-[#1b75bc] mb-6">Media Advertising Guidelines</h2>

            <p className="text-lg leading-relaxed mb-6">
              At My Perfect Leads, we want you to be comfortable and confident when using our website. Therefore, we
              would like to share with you the following principles that govern our information practices and other
              privacy aspects of our website:
            </p>

            <p className="text-lg leading-relaxed mb-8">
              We do not make our advertising decisions based on political affiliations or in support of, or against, any
              political or religious group. We firmly believe in the right of free speech, however, we also believe we
              have an obligation to ensure our advertising does not appear in content that is detrimental to our brand
              values. We will not advertise within programs that consistently exploit excessive or gratuitous violence
              or sexuality, which demean or denigrate any religion, race, sex or which are otherwise lacking in good
              taste.
            </p>

            <p className="text-lg leading-relaxed mb-8">
              Should our advertising appear within programming content that violates these guidelines we will review the
              content in question and make decisions about the appropriateness of that program for future consideration.
            </p>

            <h2 className="text-2xl font-bold text-[#1b75bc] mb-6">Our Philosophy and Practices</h2>

            <p className="text-lg leading-relaxed mb-6">
              At My Perfect Leads, we want you to be comfortable and confident when using our website. Therefore, we
              would like to share with you the following principles that govern our information practices and other
              privacy aspects of our website:
            </p>

            <ul className="list-disc pl-6 mb-8 space-y-2">
              <li>We provide you notice of our website information practices.</li>
              <li>We tell you how and why we use Web technologies.</li>
              <li>
                We give you choices about how the personally identifiable information that you provide to us may be
                used.
              </li>
              <li>We provide you the opportunity to update or correct your personally identifiable information.</li>
              <li>
                We work to protect personally identifiable information from loss, misuse, or unauthorized alteration.
              </li>
              <li>
                We provide various ways for you to contact us about our information practices and other aspects of
                privacy.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-[#1b75bc] mb-4">
              We provide you notice of our website information practices
            </h3>

            <p className="text-lg leading-relaxed mb-6">
              To maximize the value of our services, we may request information from you when you visit our websites. My
              Perfect Leads does not share your personal information with outside companies for their promotional use.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              Here is a description of the information we collect and how it is used:
            </p>

            <h3 className="text-xl font-semibold text-[#1b75bc] mb-4">Protecting Your Identity and Credit</h3>

            <p className="text-lg leading-relaxed mb-4">
              Credit reporting agencies may share your information with other companies when you apply for a home loan.
              This may cause you to receive emails or phone calls that you didn't ask for, offering credit cards,
              refinancing or other loan products.
            </p>

            <p className="text-lg leading-relaxed mb-8">
              You can stop these calls and emails by opting out of these prescreened credit offers. Simply call{" "}
              <a href="tel:3132640470" className="text-[#1b75bc] hover:text-[#02c39a] transition-colors">
                (313) 264-0470
              </a>{" "}
              or email{" "}
              <a
                href="mailto:compliance@heloc360.com"
                className="text-[#1b75bc] hover:text-[#02c39a] transition-colors"
              >
                compliance@heloc360.com
              </a>
              .
            </p>

            <ul className="list-disc pl-6 mb-8 space-y-4">
              <li>
                <strong>Tools, Applications and Registration:</strong> We provide a number of ways for you to explore
                your options for mortgages and loans, so you can determine which options may be the most desirable for
                you. You can engage a number of tools, planners, calculators and other interactive advisors, such as the
                online interviews, without providing us your identity. We will not ask you for personally identifiable
                information to use these features, and do not attribute the information that you provide to you as an
                individual.
              </li>
              <li>
                However, if you want to exercise one or more of the loan options presented, we will ask you to register
                at the site and supply other identifying and supporting information needed to process your application.
              </li>
              <li>
                By registering, you can save information such as loan interviews and applications for later review and
                update. When you register, you select a member ID name by which we will know you, choose a password and
                provide us an Email address. You use the member ID name and password to gain access to your loan
                application information, financial profile and/or customized rates. We use your contact information to
                provide you with alerts and updates regarding your loan status, which is part of the My Perfect Leads
                service. My Perfect Leads does not share your information with outside companies for their promotional
                use. We may, however, use it to send you communications and special offers on other products or services
                offered by My Perfect Leads.
              </li>
              <li>
                We may also supply the information you provide, on a strictly confidential basis, to service providers,
                such as title companies, appraisers, credit reporting services, etc., who assist us in qualifying,
                processing, closing and servicing your loan.
              </li>
              <li>
                <strong>Credit Report:</strong> By submitting a loan application or a request to be pre-qualified to us,
                you authorize us to share your credit report with our affiliates only to process your loan application.
              </li>
              <li>
                <strong>Newsletters:</strong> We provide you the opportunity to subscribe to Email newsletters and other
                Email communications. You may unsubscribe by following the instructions provided in each Email
                newsletter.
              </li>
              <li>
                <strong>Interactive Help (Chat / PC to Phone):</strong> You may initiate an online interactive
                discussion or PC to Phone communication with a My Perfect Leads support professional to facilitate the
                completion of your loan application. We do not ask for any personally identifiable information to use
                this service; if you volunteer personally identifiable information, it will only be used to respond to
                your request. We maintain transcripts of chat sessions.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-[#1b75bc] mb-4">More on our General Information Practices</h3>

            <ul className="list-disc pl-6 mb-8 space-y-4">
              <li>
                <strong>Contests, Sweepstakes, and Surveys:</strong> From time to time, we may offer you the option to
                participate in contests, sweepstakes, or surveys. If you would like to participate, we may ask you for
                contact information, preferences or other information. This information may be used to conduct research,
                improve our offerings, or contact you regarding home financing or award prizes. Our contests or
                sweepstakes may have separate rules and we will identify how the information that you supply will be
                used in each case.
              </li>
              <li>
                <strong>Mandatory and Optional Information:</strong> We identify what information is required to fulfill
                your request. If you chose not to provide mandatory information, we will not be able to provide you the
                service you are requesting. As part of your use of our website, we may collect information that may
                include your name, address, social security number, the location and value of the property related to
                the requested loan products or services, financial information about your assets and income, financial
                accounts, insurance and other information. As part of this process, you consent to My Perfect Leads
                obtaining a credit report and for us to use that information as described in this policy. We will also
                collect information about your activity on the My Perfect Leads websites and use that information as
                described in this policy.
              </li>
              <li>
                <strong>E-mail Message Formatting:</strong> When sending you Email we may use an image called a
                single-pixel GIF, that allows us to (1) format messages that best align with your computer's
                capabilities, and (2) determine whether you've opened an HTML Email. When you click on a link within an
                Email message, you will first pass through our server, and then are redirected onto the Internet. We use
                this data on an aggregate level to evaluate response rates to our Email messages and to determine which
                links are most useful to our client base.
              </li>
              <li>
                <strong>Within the My Perfect Leads Family:</strong> Within the My Perfect Leads family we may exchange
                customer information to fulfill your requests or to provide you with information about other products or
                services, if you have chosen to receive such communications.
              </li>
              <li>
                <strong>Service Providers:</strong> In some cases, we will employ or use service providers such as title
                companies, appraisers, consultants, and temporary workers, third party software developers, to complete
                a business process or provide a service on our behalf. For example, we may use service providers to
                enhance our website technology, deliver products, or to send Emails. When we employ service providers,
                we may need to share your personally identifiable information. Service providers are strictly prohibited
                from using your personally identifiable information for purposes other than to act on our behalf.
              </li>
              <li>
                <strong>Service Alerts and Critical Notices:</strong> Although we respect and honor the privacy
                preferences you have expressed, we may need to contact you to inform you of specific changes that may
                impact your ability to use this service or for other critical non-marketing purposes, such as bug
                alerts. We may also contact you to respond to your specific requests, to clarify the order information
                you provided to us, or to notify you of upcoming subscription expiration dates.
              </li>
              <li>
                <strong>Change of Control:</strong> Your personally identifiable information may be transferred in
                connection with a sale, merger, transfer, exchange or other disposition (whether of assets, stock or
                otherwise) of all or a portion of a business of My Perfect Leads. You will have the opportunity to opt
                out of further secondary use of your information following any change of control.
              </li>
              <li>
                <strong>Changes to Our Privacy Policy:</strong> If we plan to make significant changes to any of our
                privacy policies or practices with respect to how we use personally identifiable information, we'll post
                those changes to the My Perfect Leads website 30 days before they take effect.
              </li>
              <li>
                <strong>Legal Disclosures:</strong> In some cases we may disclose certain information to comply with a
                legal process, such as a court order, subpoena, search warrant, or law enforcement request.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-[#1b75bc] mb-4">
              We work to protect personally identifiable information from loss, misuse, or unauthorized alteration.
            </h3>

            <p className="text-lg leading-relaxed mb-6">
              We employ industry recognized security safeguards to help protect the personally identifiable information
              that you have provided to us from loss, misuse, or unauthorized alteration. All data sent to My Perfect
              Leads is protected with technology that enables encryption of your data. We use:
            </p>

            <ul className="list-disc pl-6 mb-8 space-y-4">
              <li>
                <strong>Secure Socket Layer (SSL):</strong> The My Perfect Leads Web server supports the Secure Socket
                Layer (SSL) transaction protocol originally developed by Netscape and now largely accepted as an
                industry standard. The purpose of this encryption protocol is to keep confidential the information
                passed back and forth between a Web server and its users.
              </li>
              <li>
                <strong>128-Bit Domestic Grade Strong Encryption:</strong> My Perfect Leads uses 128-Bit Domestic Grade
                Strong Encryption, a powerful encryption commercially available for Internet products. (However, be
                aware that if you are using a 40-bit browser, your encryption level, while secure, is not the highest
                level available. United States and Canadian citizens can download free 128-bit browsers from{" "}
                <a
                  href="https://www.mozilla.org/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-[#1b75bc] hover:text-[#02c39a] transition-colors"
                >
                  Mozilla
                </a>
                ,{" "}
                <a
                  href="https://www.apple.com/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-[#1b75bc] hover:text-[#02c39a] transition-colors"
                >
                  Apple
                </a>
                , or{" "}
                <a
                  href="https://www.microsoft.com/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-[#1b75bc] hover:text-[#02c39a] transition-colors"
                >
                  Microsoft
                </a>
                .
              </li>
              <li>
                We work to protect personally identifiable information stored on the site's servers from unauthorized
                access using industry standard computer security products, such as firewalls, as well as carefully
                developed security procedures and practices. All employees must review and sign a written statement of
                these practices which include limiting access to sensitive information to only those employees who
                require the information and enforcing strict password protocols for all employees. In addition, a
                username, member ID name and password are required for you to use, view or change application or
                interview information. We use both internal and external resources to review the adequacy of our
                security measures on a regular basis.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-[#1b75bc] mb-4">
              We tell you how and why we use web technologies.
            </h3>

            <p className="text-lg leading-relaxed mb-6">
              Here is how and why we use some common Web technologies to help manage our websites:
            </p>

            <ul className="list-disc pl-6 mb-8 space-y-4">
              <li>
                <strong>Cookies:</strong> A "cookie" is a small piece of information that our website may provide to
                your browser while you are at our sites. The My Perfect Leads website supplies your browser with cookies
                that contain a unique identifier used to better understand website usage in the aggregate and on an
                individual level so we know what areas of our site users prefer (e.g., based on the number of visits to
                those areas). This is done through a tracking utility that allows us, for example, to reconstruct
                activity from a session or by a user, for troubleshooting and issue resolution purposes. My Perfect
                Leads may also employ service providers to help us collect and understand our website usage data.
              </li>
              <li>
                When periodic surveys are presented to website visitors, cookies are used to prevent issuing multiple
                invitations to the same individual.
              </li>
              <li>
                If you are a registered member on the My Perfect Leads website, you will receive a cookie when you
                login. This cookie is maintained by your browser and contains your identifier. This cookie is also used
                to authenticate your identity and provide you with access to areas of our website that are limited to
                registered members, such as those that allow you to view and manage your personal profile.
              </li>
              <li>
                Additionally, My Perfect Leads service providers that serve ads on affiliate and/or advertiser websites
                may assign different cookies and small graphical images called single-pixel GIFs or web beacons, to your
                browser to track the effectiveness of My Perfect Leads advertising on other websites and your
                involvement with My Perfect Leads. For example, as part of the My Perfect Leads affiliate programs, our
                service providers use cookies and web beacons to determine when affiliate program members have referred
                a customer to My Perfect Leads via a link on their website. The My Perfect Leads website also sets a
                temporary cookie that contains a unique, anonymous identifier that is provided to the service provider
                to ensure that each referral is only counted once. This cookie is not linked to a customer's personal
                information. The cookies and web beacons are necessary to ensure that affiliate program members are
                appropriately credited for their referrals. Service providers report data in the aggregate and do not
                link it to individual customer information. My Perfect Leads may also employ service providers who may
                assign cookies or web beacons to your browser to assist us in collecting website usage data such as your
                IP address, session ID, URL and demographic information such as your zip code. The collection of data
                may include personally identifiable information. We do not track URLs that you type into your browser,
                nor do we track you across the Internet once you leave our site.
              </li>
              <li>
                If you simply want to browse, you do not have to accept cookies from our site. Should you decide,
                however, that you would like to register and sign in to special areas of the website and you have
                modified your browser settings not to accept cookies, you will need to re-set your browser to accept the
                cookies that we send. Otherwise, you won't be able to participate in certain areas of the website. Most
                browsers are defaulted to accept and maintain cookies.
              </li>
              <li>
                If you wish to remove cookies provided by My Perfect Leads from your browser you must adjust your
                preferences through the advanced settings feature on your internet browser. Since most browsers are
                defaulted to accept and maintain cookies, you will most likely have to set your browser to reject new
                cookies or to disable them altogether, in order to avoid receiving future cookies from the My Perfect
                Leads website. Please note that if you choose to reject or disable cookies, your access to certain areas
                within the My Perfect Leads website may be limited.
              </li>
              <li>
                <strong>Behavioral Advertising:</strong> Please be aware that we use third party advertising companies
                to collect non-personally identifiable information for online behavioral advertising to provide targeted
                display advertisements, likely to be of greater interest to you, through participating publishers and
                advertisers. Such information may include non-personally identifiable information (e.g., click stream
                information, browser type, time and date, subject of advertisements clicked or scrolled over) through
                the use of Cookies and other technology.
              </li>
              <li>
                <strong>Website Usage Data:</strong> Our website tracks usage data, including, for example, your IP
                address, your browser type and version, which pages you view, which page, if any, linked you to our
                site, and which link, if any, you follow off of our site. We use this data in the aggregate and on an
                individual level to better understand website activity to improve our site offerings, to reconstruct
                activity from a session or by a user, for troubleshooting and issue resolution purposes. We may also use
                this data to provide you a more personalized website experience, assistance with technical support
                questions, and to send you special offers, product and service updates, or other promotional materials
                that are relevant and tailored to your interests. If you do not want to receive these offers or
                promotions, simply indicate your contact preferences during the registration process, within any future
                communications or by sending an email to{" "}
                <a
                  href="mailto:compliance@heloc360.com"
                  className="text-[#1b75bc] hover:text-[#02c39a] transition-colors"
                >
                  compliance@heloc360.com
                </a>
                . We do not share your information with outside companies for their promotional use. We do not track
                URLs that you type into your browser, nor do we track you across the Internet once you leave our site.
              </li>
              <li>
                <strong>Social Media and Third-Party Website Security and Privacy Policies:</strong> My Perfect Leads
                currently has presence on social media to connect with and market to the public, My Perfect Leads
                customers, and potential customers of the My Perfect Leads' family. Your activity on third-party
                websites is governed by the security and privacy policies of each third-party website. Users of
                third-party websites often share information with the general public, user community, and/or the
                third-party operating the third-party website, which may use this information in a variety of ways.
                Consequently, you should review the privacy policies of the third-party website before using it and
                ensure that you understand how this information may be used. You may be able to adjust privacy settings
                on your accounts on any third-party website or application to match your preferences. The information
                posted on or directed at My Perfect Leads through social media is generally available to the public. To
                protect your privacy, do not include information you want to keep private or any other sensitive
                personal information in your social media activity, comments or responses. This information may be
                archived independently on, and retention of such information is governed by, the third-party website.
              </li>
              <li>
                <strong>Browser "Do Not Track" and Other Settings:</strong> You may be using an Internet browser that
                has the ability to communicate your privacy preferences to the website, including requests not to track
                your usage and browsing history. Currently, the My Perfect Leads websites do not respond to any of these
                signals. My Perfect Leads may track your activity on these websites and use that information as provided
                in this policy.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-[#1b75bc] mb-4">
              We give you choices about how the personally identifiable information that you provide to us may be used.
            </h3>

            <p className="text-lg leading-relaxed mb-8">
              We give you the opportunity to control the use of your personal information for purposes other than to
              fulfill your request or as is required to process, close and subsequently service your loan. For example,
              on occasion we may use your contact information to send you promotional communications about My Perfect
              Leads products.
            </p>

            <h3 className="text-xl font-semibold text-[#1b75bc] mb-4">
              We provide you the opportunity to update or correct your personally identifiable information
            </h3>

            <p className="text-lg leading-relaxed mb-6">
              We provide you the opportunity to update or correct the contact and loan application information that you
              have provided to us. You may review and update information stored in your application online until you
              submit your application. Once you have submitted your application, you may only change the information by
              directly contacting our mortgage department at{" "}
              <a href="tel:3132640470" className="text-[#1b75bc] hover:text-[#02c39a] transition-colors">
                (313) 264-0470
              </a>{" "}
              or emailing us at{" "}
              <a href="mailto:help@heloc360.com" className="text-[#1b75bc] hover:text-[#02c39a] transition-colors">
                help@heloc360.com
              </a>
              .
            </p>

            <p className="text-lg leading-relaxed mb-8">
              My Perfect Leads recommends that you do not use email communications to send us sensitive personal
              information. If you need to change that personal information, we recommend that you call us directly.
            </p>

            <h3 className="text-xl font-semibold text-[#1b75bc] mb-4">
              We provide various ways for you to contact us about our information practices and other aspects of
              privacy.
            </h3>

            <p className="text-lg leading-relaxed mb-8">
              Questions regarding the My Perfect Leads website's privacy statement, our online privacy policy, our
              information practices or other aspects of privacy on our websites, should be directed to us by writing at
              My Perfect Leads, Inc., Attn: Compliance Department, 1121 Annapolis RD #218, Odenton, MD 21113.
            </p>

            {/* Contact Section */}
            <div className="bg-gradient-to-r from-[#1b75bc]/10 to-[#02c39a]/10 p-8 rounded-lg mt-12">
              <h3 className="text-xl font-semibold text-[#1b75bc] mb-4">Questions About This Policy?</h3>
              <p className="text-lg leading-relaxed mb-4">
                If you have any questions about our privacy policy or how we handle your personal information, please
                don't hesitate to contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="mailto:compliance@heloc360.com"
                  className="inline-flex items-center justify-center px-6 py-3 bg-[#1b75bc] hover:bg-[#1b75bc]/90 text-white font-medium rounded-lg transition-colors"
                >
                  Email Compliance Team
                </a>
                <a
                  href="tel:3132640470"
                  className="inline-flex items-center justify-center px-6 py-3 border border-[#1b75bc] text-[#1b75bc] hover:bg-[#1b75bc] hover:text-white font-medium rounded-lg transition-colors"
                >
                  Call (313) 264-0470
                </a>
              </div>
            </div>

            {/* Last Updated */}
            <div className="text-center mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                This privacy policy is effective as of the date of your use of our website. We may update this policy
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
