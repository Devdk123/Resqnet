import { Link } from 'react-router-dom';

export function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-[30px] border border-emerald-200/15 bg-[#0b1d1a]/80 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8 lg:p-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-emerald-200/80">LEGAL</div>
            <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Privacy Policy & Cookie Notice</h1>
          </div>
          <Link to="/" className="rounded-full border border-emerald-200/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-100 transition hover:bg-emerald-500/20">
            Home
          </Link>
        </div>

        <div className="space-y-8 text-sm leading-7 text-stone-200/85">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-emerald-200">1. Overview</h2>
            <p>
              RESQNET is designed to support emergency coordination, volunteer response routing, and operational safety for hospitals,
              communities, and emergency response teams. This Privacy Policy explains what data we collect, why we collect it, and how we
              protect it.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-emerald-200">2. Information we collect</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>Account information such as username, role, and access session data.</li>
              <li>Emergency reports and related details, including location and urgency information.</li>
              <li>Volunteer and responder status, including availability and response activity.</li>
              <li>Device and browser metadata needed for security, analytics, and troubleshooting.</li>
              <li>Google sign-in profile details when a user opts to continue with Google authentication.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-emerald-200">3. How we use your information</h2>
            <p>
              We use the data to deliver emergency workflows, route response teams, identify risk levels, maintain secure access, improve
              service quality, and support operational compliance. We do not sell personal data.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-emerald-200">4. Cookies and local data</h2>
            <p>
              RESQNET may use local browser storage and cookies to keep sessions active, remember your theme preferences, and store basic
              login state. These cookies support essential product features, not targeted advertising.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-emerald-200">5. Third-party integrations</h2>
            <p>
              Google Sign-In may require access to your Google account profile information to complete authentication. Any third-party access
              is governed by the provider’s privacy policies and is used only for login and account validation in this product.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-emerald-200">6. Security</h2>
            <p>
              We use secure access patterns, session-based authorization, and controlled routing logic so emergency data is only available to
              the right users and roles. Sensitive operational data should still be treated carefully and shared only according to your
              organization’s security policy.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-emerald-200">7. Your rights</h2>
            <p>
              You may request access to, correction of, or deletion of personal information related to your account by contacting the project
              administrator or service owner. Where required by law, we will respond in a timely manner.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-emerald-200">8. Contact</h2>
            <p>
              For privacy or cookie questions, please contact the platform administrator through the support channel or your organization’s
              designated emergency response contact.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
