'use client'

import { useSIWE } from 'connectkit'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { useNamestone } from '@/hooks/useNamestone'
import { parentDomain } from '@/lib/namestone'

import { ConnectButton } from './ConnectButton'
import { Spinner } from './Spinner'

export function NameManager() {
  const { address } = useAccount()
  const names = useNamestone(address)
  const { data, isSignedIn, signOut, signIn } = useSIWE()

  const [state, setState] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error'
    message?: string
  }>({ status: 'idle' })

  useEffect(() => {
    if (state.status === 'success') {
      names.refetch()
    }
  }, [state.status])

  if (names.isLoading) {
    return <Spinner />
  }

  if (address && names.data?.length === 1) {
    return <p>You already have a name registered</p>
  }

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={async (e) => {
        e.preventDefault()
        setState({ status: 'loading' })
        const formData = new FormData(e.target as HTMLFormElement)
        const name = formData.get('name') as string
        const address = formData.get('address') as string

        const res = await fetch('/api/names/create', {
          method: 'POST',
          body: JSON.stringify({
            name,
            address,
            domain: parentDomain,
          }),
        })

        const json = await res.json()

        if (json.error) {
          setState({ status: 'error', message: json.error })
        } else {
          setState({ status: 'success' })
        }
      }}
    >
      <Input
        name="name"
        placeholder="Enter your name"
        suffix={`.${parentDomain}`}
      />

      <input type="hidden" name="address" value={address} />

      {address && (
        <Button
          type="submit"
          className="rounded-lg"
          loading={state.status === 'loading'}
        >
          Register
        </Button>
      )}

      {!address && <ConnectButton className="rounded-lg" />}

      {state.status === 'error' && (
        <p className="text-sm text-red-500">{state.message}</p>
      )}
    </form>
  )
}
