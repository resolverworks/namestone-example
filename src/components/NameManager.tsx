'use client'

import { useSIWE } from 'connectkit'
import React, { useEffect, useState } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { useNamestone } from '@/hooks/useNamestone'
import { parentDomain } from '@/lib/namestone'
import { cn } from '@/lib/utils'

import { ConnectButton } from './ConnectButton'
import { Spinner } from './Spinner'

export function NameManager({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { data, isSignedIn, signIn } = useSIWE()
  const address = data?.address as Address | undefined
  const names = useNamestone(address)

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

  if (address && names.data?.first) {
    // Update name form
    return (
      <form
        className={cn('flex w-full flex-col gap-2', className)}
        onSubmit={async (e) => {
          e.preventDefault()
          setState({ status: 'loading' })

          const formData = new FormData(e.target as HTMLFormElement)
          const twitter = formData.get('twitter') as string | undefined
          const telegram = formData.get('telegram') as string | undefined
          const description = formData.get('description') as string | undefined

          const res = await fetch('/api/names/update', {
            method: 'POST',
            body: JSON.stringify({
              name: names.data.first?.name,
              address,
              domain: parentDomain,
              text_records: {
                'com.twitter': twitter,
                'org.telegram': telegram,
                description,
              },
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
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            name="twitter"
            label="Twitter / X"
            placeholder="shefiorg"
            defaultValue={names.data.first.text_records?.['com.twitter']}
          />
          <Input
            name="telegram"
            label="Telegram"
            placeholder="shefiorg"
            defaultValue={names.data.first.text_records?.['org.telegram']}
          />
        </div>

        <Input
          name="description"
          label="Description"
          placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer lacinia."
          defaultValue={names.data.first.text_records?.description}
        />

        <Button
          type="submit"
          className="mt-1 rounded-lg"
          loading={state.status === 'loading'}
        >
          Update
        </Button>
      </form>
    )
  }

  // Register form
  return (
    <form
      className={cn('flex flex-col gap-2', className)}
      onSubmit={async (e) => {
        e.preventDefault()

        if (!address) return

        setState({ status: 'loading' })
        const formData = new FormData(e.target as HTMLFormElement)
        const name = formData.get('name') as string

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
