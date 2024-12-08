"use client"

import * as React from "react"
import { Connector, useConnect } from "wagmi"

export function WalletOptions() {
  const { connectors, connect } = useConnect()
    console.log(connectors);

  return (
    <div className="bg-pink-400">
      {connectors.map((connector) => (
        <WalletOption
          key={connector.uid}
          connector={connector}
          onClick={() => connect({ connector })}
        />
      ))}
    </div>
  )
}

function WalletOption({
  connector,
  onClick,
}: {
  connector: Connector
  onClick: () => void
}) {
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    let isMounted = true
    ;(async () => {
      try {
        const provider = await connector.getProvider()
        if (isMounted) setReady(!!provider)
      } catch (error) {
        console.error("Error fetching provider:", error)
      }
    })()
    return () => {
      isMounted = false
    }
  }, [connector])

  return (
    <button
      disabled={!ready}
      onClick={onClick}
      aria-label={`Connect with ${connector.name}`}
    >
      {connector.name}
    </button>
  )
}
