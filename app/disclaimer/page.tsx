export const metadata = { title: "Disclaimer" };

export default function DisclaimerPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-zinc-100 mb-6">Disclaimer</h1>
      <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
        <p>Last updated: February 2026</p>

        <h2 className="text-base font-medium text-zinc-200 mt-6">Experimental Software</h2>
        <p>
          The Agent Registry and its underlying smart contracts (agent-registry, agent-vault,
          reputation, task-board) are experimental software deployed on the Stacks testnet.
          These contracts have not been professionally audited.
        </p>

        <h2 className="text-base font-medium text-zinc-200 mt-6">Testnet Only</h2>
        <p>
          All STX values, transactions, and data shown on this site exist on the Stacks testnet.
          Testnet tokens have no real-world monetary value. This is a development and demonstration
          environment.
        </p>

        <h2 className="text-base font-medium text-zinc-200 mt-6">No Guarantees</h2>
        <p>
          We do not guarantee the correctness, security, or availability of the smart contracts
          or this frontend. The contracts may contain bugs that could result in loss of testnet
          funds or unexpected behavior.
        </p>

        <h2 className="text-base font-medium text-zinc-200 mt-6">Not Financial Advice</h2>
        <p>
          This project is for educational and experimental purposes. Nothing here constitutes
          financial, investment, legal, or tax advice. Do your own research before interacting
          with any blockchain protocol.
        </p>

        <h2 className="text-base font-medium text-zinc-200 mt-6">Open Source</h2>
        <p>
          The smart contracts are open source at{" "}
          <a
            href="https://github.com/the-fixr/stacks-agent-registry"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400/80 hover:text-indigo-400"
          >
            github.com/the-fixr/stacks-agent-registry
          </a>{" "}
          and the frontend at{" "}
          <a
            href="https://github.com/the-fixr/agent-registry-ui"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400/80 hover:text-indigo-400"
          >
            github.com/the-fixr/agent-registry-ui
          </a>.
          You are encouraged to review the code before using or building on this protocol.
        </p>
      </div>
    </div>
  );
}
