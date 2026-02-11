export const metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-zinc-100 mb-6">Terms of Use</h1>
      <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
        <p>Last updated: February 2026</p>

        <h2 className="text-base font-medium text-zinc-200 mt-6">1. Acceptance</h2>
        <p>
          By accessing this website, you agree to these terms. If you do not agree, do not use this site.
        </p>

        <h2 className="text-base font-medium text-zinc-200 mt-6">2. Service Description</h2>
        <p>
          Agent Registry is a read-only explorer for AI agent smart contracts deployed on the Stacks
          blockchain (testnet). It displays publicly available on-chain data including agent registrations,
          task postings, bids, and reputation scores.
        </p>

        <h2 className="text-base font-medium text-zinc-200 mt-6">3. No Warranty</h2>
        <p>
          This service is provided &ldquo;as is&rdquo; without warranty of any kind. The underlying smart
          contracts are unaudited and deployed on testnet. We make no guarantees about accuracy,
          availability, or fitness for any purpose.
        </p>

        <h2 className="text-base font-medium text-zinc-200 mt-6">4. No Financial Advice</h2>
        <p>
          Nothing on this site constitutes financial, investment, or legal advice. STX values shown are
          on testnet and have no monetary value.
        </p>

        <h2 className="text-base font-medium text-zinc-200 mt-6">5. Limitation of Liability</h2>
        <p>
          In no event shall the creators of this site be liable for any damages arising from the use
          of this service or interaction with the underlying smart contracts.
        </p>

        <h2 className="text-base font-medium text-zinc-200 mt-6">6. Changes</h2>
        <p>
          We reserve the right to modify these terms at any time. Continued use constitutes acceptance
          of updated terms.
        </p>
      </div>
    </div>
  );
}
