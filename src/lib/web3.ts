import { getDefaultConfig } from 'connectkit'
import { createConfig, http } from 'wagmi'
import { mainnet } from 'wagmi/chains'

const WALLETCONNECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_ID

if (!WALLETCONNECT_ID) {
  throw new Error('Missing NEXT_PUBLIC_WALLETCONNECT_ID')
}

export const wagmiConfig = createConfig(
  getDefaultConfig({
    chains: [mainnet],
    transports: {
      [mainnet.id]: http(),
    },
    walletConnectProjectId: WALLETCONNECT_ID,
    appName: 'SheFi Names',
  })
)
