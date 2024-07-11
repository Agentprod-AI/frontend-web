"use client";
import Link from "next/link";
import React from "react";

function Policy() {
  return (
    <div className="h-screen overflow-y-scroll">
      <div className="flex flex-col items-center  py-20 px-4">
        <div className="text-6xl  font-semibold bg-gradient-to-b from-foreground to-transparent bg-clip-text leading-none text-transparent">
          Privacy Policy
        </div>
        <div className="mt-16 text-white/80 max-w-4xl text-xs">
          <div>
            <div className="font-medium">Effective Date: April 9, 2024</div>
            <div>
              This privacy policy governs the use of AgentProd (the "Service").
              By using the Service, you accept this privacy policy along with
              our Terms of Service in full.
            </div>
          </div>
          <div className="my-8">
            <div className="text-xl font-semibold">1. Data Collection</div>
            <div>
              <div>We collect the following types of personal information:</div>
              <ul className="list-disc ml-5">
                <li>
                  <span className="font-semibold">Account Information</span>:
                  Name, email address, phone number, company name, and domain
                  information.
                </li>
                <li>
                  <span className="font-semibold">Usage Data</span>: Information
                  on how you interact with the Service, such as access times,
                  pages viewed, and the features used.
                </li>
              </ul>
            </div>
          </div>
          <div className="my-8">
            <div className="text-xl font-semibold">2. How We Collect Data</div>
            <div>
              <div>We collect data:</div>
              <ul className="list-disc ml-5">
                <li>
                  <span className="font-semibold">Directly from You</span>: When
                  you provide information during account creation or through the
                  use of our services.
                </li>
                <li>
                  <span className="font-semibold">Automatically</span>: Through
                  your interactions with our service, cookies, and similar
                  tracking technologies.
                </li>
                <li>
                  <span className="font-semibold">
                    From Third-Party Integrations
                  </span>
                  : Such as Gmail, when you connect your account with our
                  service.
                </li>
              </ul>
            </div>
          </div>

          <div className="my-8">
            <div className="text-xl font-semibold">3. Use of Data</div>
            <div>
              <div>We use the data we collect to:</div>
              <ul className="list-disc ml-5">
                <li>Provide and improve our services.</li>
                <li>Personalize your experience.</li>
                <li>
                  Communicate with you about your account and our services.
                </li>
                <li>Analyze usage and performance of the service.</li>
                <li>Ensure legal compliance and security.</li>
              </ul>
            </div>
          </div>

          <div className="my-8">
            <div className="text-xl font-semibold">4. Data Protection</div>
            <div>
              <div>
                We have taken steps to protect any personal information we
                process. However, please keep in mind that the internet is not
                completely secure. Although we are committed to protecting your
                personal information, it is your responsibility to ensure that
                you only access our services in a secure environment.
              </div>
            </div>
          </div>

          <div className="my-8">
            <div className="text-xl font-semibold">5. Data Sharing</div>
            <div>
              <div>
                We do not sell your personal information. We may share your
                information with:
              </div>
              <ul className="list-disc ml-5">
                <li>
                  <span className="font-semibold">Service Providers</span>:
                  Third-party vendors who assist us in providing and improving
                  our services, including Google, Apollo, Calendly, Brevo,
                  Twilio, OpenAI, and Stripe.
                </li>
                <li>
                  <span className="font-semibold">Legal Requirements</span>:
                  Authorities when required by law.
                </li>
                <li>
                  <span className="font-semibold">Business Transfers</span>: As
                  part of a business transaction, such as a merger or
                  acquisition.
                </li>
              </ul>
            </div>
          </div>

          <div className="my-8">
            <div className="text-xl font-semibold">6. Data Retention</div>
            <div>
              <div>
                We retain personal data for as long as necessary to provide our
                services and comply with legal obligations. Data may be archived
                or deleted upon user request or account termination, subject to
                certain legal obligations.
              </div>
            </div>
          </div>

          <div className="my-8">
            <div className="text-xl font-semibold">
              7. International Data Transfers
            </div>
            <div>
              <div>
                Your personal information may be transferred to and processed in
                countries other than your own. We ensure that such data
                transfers comply with applicable data protection laws and are
                subject to appropriate safeguards.
              </div>
            </div>
          </div>

          <div className="my-8">
            <div className="text-xl font-semibold">8. Rights</div>
            <div>
              <div>
                If you live in the European Economic Area (EEA), you have
                certain rights under data protection laws. This includes the
                right to ask for access to your personal information, to request
                that it be changed or deleted, to limit how it is used, and to
                get a copy of it. You can also object to how your personal
                information is processed. To make such a request, please use the
                contact details provided. If we have your consent to process
                your personal information, you can withdraw your consent at any
                time. If you think your personal information is being used
                illegally, you have the right to complain to your local data
                protection authority. You can find their contact details at
                ec.europa.eu.
              </div>
            </div>
          </div>

          <div className="my-8">
            <div className="text-xl font-semibold">9. Minors</div>
            <div>
              <div>
                We do not ask for or market to children under 18. If you are 18
                or the parent/guardian of a minor, you can allow them to use the
                services. If we find out that we have collected data from
                someone under 18, we will delete the information and deactivate
                their account. If you are aware of any children under 18 using
                our services, please contact us.
              </div>
            </div>
          </div>

          <div className="my-8">
            <div className="text-xl font-semibold">10. Data Breaches</div>
            <div>
              <div>
                If someone gets unauthorized access to, collects, uses,
                discloses, or disposes of your personal information, it is
                called a privacy breach. We will let you know if we think you
                may be at risk of harm. This could be serious financial harm or
                harm to your physical or mental health. If we find out about a
                security breach that could let someone access, use, or see your
                personal information, we will investigate and inform you at the
                earliest possible date.
              </div>
            </div>
          </div>

          <div className="my-8">
            <div className="text-xl font-semibold">
              11. Do Not Track Headers
            </div>
            <div>
              <div>
                Many web browsers, mobile devices, and mobile applications have
                a feature called Do-Not-Track (“DNT”). If you activate this
                feature, it sends a signal that you do not want your online
                browsing activities monitored and collected. No technology has
                been finalized yet that recognizes and follows DNT signals.
                Because of this, we do not currently respond to DNT signals. If
                a standard for online tracking is created in the future, we will
                let you know in an updated version of this privacy policy.
              </div>
            </div>
          </div>

          <div className="my-8">
            <div className="text-xl font-semibold">
              12. California Civil Code Section 1798.83
            </div>
            <div>
              <div>
                If you are a resident of California, you have the right to
                request information from us once a year free of charge. This
                information includes what kind of personal information we shared
                with third parties for marketing purposes, and the names and
                addresses of those third parties. If you would like to make this
                request, please contact us using the information provided.
              </div>
              <div>
                If you are under 18 years old, reside in California, and have a
                registered account with us, you have the right to request that
                we remove any data you posted publicly on our Services. To do
                this, please contact us with your email address associated with
                your account and a statement that you live in California. We
                will not display the data publicly, but it may not be completely
                or thoroughly deleted from our systems.
              </div>
            </div>
          </div>

          <div className="my-8">
            <div className="text-xl font-semibold">13. Partners</div>
            <div>
              <div>
                We work with a number of partners to provide the Service. These
                partners may have access to your personal information, and you
                accept their privacy policies by using AgentProd. These partners
                include, but are not limited to{" "}
                <span className="underline cursor-auto font-medium text-white">
                  <Link
                    href={"https://policies.google.com/privacy"}
                    target="_blank"
                  >
                    Google
                  </Link>
                </span>
                ,{" "}
                <span className="underline cursor-auto font-medium text-white">
                  <Link
                    href={"https://www.apollo.io/privacy-policy"}
                    target="_blank"
                  >
                    Apollo
                  </Link>
                </span>
                ,{" "}
                <span className="underline cursor-auto font-medium text-white">
                  <Link
                    href={"https://calendly.com/legal/privacy-notice"}
                    target="_blank"
                  >
                    Calendly
                  </Link>
                </span>
                ,{" "}
                <span className="underline cursor-auto font-medium text-white">
                  <Link
                    href={"https://www.twilio.com/en-us/legal/privacy"}
                    target="_blank"
                  >
                    Twilio
                  </Link>
                </span>
                ,{" "}
                <span className="underline cursor-auto font-medium text-white">
                  <Link
                    href={"https://www.brevo.com/legal/privacypolicy/"}
                    target="_blank"
                  >
                    Brevo
                  </Link>
                </span>
                ,{" "}
                <span className="underline cursor-auto font-medium text-white">
                  <Link
                    href={"https://openai.com/en-GB/policies/privacy-policy/"}
                    target="_blank"
                  >
                    OpenAI
                  </Link>
                </span>
                , and{" "}
                <span className="underline cursor-auto font-medium text-white">
                  <Link
                    href={"https://stripe.com/in/legal/privacy-center"}
                    target="_blank"
                  >
                    Stripe
                  </Link>
                </span>
                .
              </div>
            </div>
          </div>

          <div className="my-8">
            <div className="text-xl font-semibold">14. Updates</div>
            <div>
              <div>
                We may update this privacy policy from time to time. We
                encourage you to review this privacy policy frequently to be
                informed of how we are protecting your information.
              </div>
            </div>
          </div>

          <div className="my-8">
            <div className="text-xl font-semibold">15. Questions</div>
            <div>
              <div>
                If you have questions or comments about this policy, you may
                contact AgentProd's Data Protection Officer (DPO):
              </div>
              <div>
                <span className="font-semibold">Address</span>: 8 The Green, Ste
                A, Dover, DE 19901, United States
              </div>
              <div
                className="cursor-pointer"
                onClick={() => window.open("mailto:info@agentprod.com")}
              >
                <span className="font-semibold">Email</span>: info@agentprod.com
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Policy;
