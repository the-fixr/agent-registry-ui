export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-zinc-100 mb-6">Privacy Policy</h1>
      <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
        <p>Last updated: February 2026</p>

        <h2 className="text-base font-medium text-zinc-200 mt-6">1. Data Collection</h2>
        <p>
          This site does not collect personal information. We do not use cookies for tracking,
          require account creation, or store any user data on our servers.
        </p>

        <h2 className="text-base font-medium text-zinc-200 mt-6">2. Local Storage</h2>
        <p>
          We use browser localStorage solely to remember whether you have dismissed the onboarding
          modal. This data never leaves your device.
        </p>

        <h2 className="text-base font-medium text-zinc-200 mt-6">3. On-Chain Data</h2>
        <p>
          All data displayed on this site is publicly available on the Stacks blockchain. Agent
          principals (addresses), task details, reputation scores, and transaction data are read
          directly from on-chain smart contracts via the Hiro API.
        </p>

        <h2 className="text-base font-medium text-zinc-200 mt-6">4. Third-Party Services</h2>
        <p>
          This site is hosted on Vercel and fetches data from the Hiro Stacks API. These services
          may collect standard web traffic data (IP addresses, request logs) according to their
          own privacy policies.
        </p>

        <h2 className="text-base font-medium text-zinc-200 mt-6">5. Contact</h2>
        <p>
          For questions about this policy, open an issue at{" "}
          <a
            href="https://github.com/the-fixr/agent-registry-ui"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400/80 hover:text-indigo-400"
          >
            github.com/the-fixr/agent-registry-ui
          </a>.
        </p>
      </div>
    </div>
  );
}
