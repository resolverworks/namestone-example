import { getDefaultConfig } from 'connectkit'
import { configureClientSIWE } from 'connectkit-next-siwe'
import { createConfig, http } from 'wagmi'
import { mainnet } from 'wagmi/chains'

const WALLETCONNECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_ID

if (!WALLETCONNECT_ID) {
  throw new Error('Missing NEXT_PUBLIC_WALLETCONNECT_ID')
}

export const ckConfig = getDefaultConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
  walletConnectProjectId: WALLETCONNECT_ID,
  appName: 'SheFi Names',
  ssr: true,
})

export const wagmiConfig = createConfig(ckConfig)

export const siweClient = configureClientSIWE({
  apiRoutePrefix: '/api/siwe',
  statement: 'Sign In With Ethereum to prove you control this wallet.',
})
