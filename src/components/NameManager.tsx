'use client'

import { useSIWE } from 'connectkit'
import { useAccount } from 'wagmi'

import { parentDomain } from '@/lib/namestone'

import { Button } from './Button'

export function NameManager() {
  const { address } = useAccount()
  const { data, isSignedIn, signOut, signIn } = useSIWE()

  console.log(data)

  return (
    <>
      <Button
        onClick={async () => {
          await fetch('/api/names/create', {
            method: 'POST',
            body: JSON.stringify({
              name: 'greg',
              address,
              domain: parentDomain,
            }),
          })
        }}
      >
        Post
      </Button>
    </>
  )
}
