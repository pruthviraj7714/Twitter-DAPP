import { http, createConfig } from 'wagmi'
import { base, mainnet } from 'wagmi/chains'
import { injected, metaMask, safe } from 'wagmi/connectors'


export const config = createConfig({
  chains: [mainnet, base],
  connectors: [
    injected(),
    metaMask(),
    safe(),
  ],
  ssr : true,
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
})