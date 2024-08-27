'use server'

import { configureServerSideSIWE } from 'connectkit-next-siwe'

import { ckConfig } from '@/lib/web3'

const SESSION_SECRET = process.env.SESSION_SECRET

if (!SESSION_SECRET) {
  throw new Error('SESSION_SECRET is not set')
}

export const siweServer = configureServerSideSIWE({
  config: {
    chains: ckConfig.chains,
    transports: ckConfig.transports,
  },
  session: {
    cookieName: 'connectkit-next-siwe',
    password: SESSION_SECRET,
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
})
