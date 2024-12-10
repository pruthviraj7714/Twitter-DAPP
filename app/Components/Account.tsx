"use client";
import { useAccount, useDisconnect } from "wagmi";

export function Account() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  if (!address) return <div>No account connected</div>;

  return (
    <div className="flex items-center gap-1.5">
      <div>
        <span className="font-mono font-bold text-center">
          {address}
        </span>
      </div>
      <button
        className="px-6 py-2 bg-red-500 text-white hover:bg-red-600 rounded-xl"
        onClick={() => disconnect()}
        aria-label="Disconnect your account"
      >
        Disconnect
      </button>
    </div>
  );
}
