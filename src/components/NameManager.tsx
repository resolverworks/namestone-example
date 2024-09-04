'use client'

import { useSIWE } from 'connectkit'
import React, { useEffect } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { useAccount } from 'wagmi'

import { createName } from '@/actions/create'
import { updateName } from '@/actions/update'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { useIsMounted } from '@/hooks/useIsMounted'
import { useNamestone } from '@/hooks/useNamestone'
import { parentDomain } from '@/lib/namestone'
import { cn } from '@/lib/utils'

import { ConnectButton } from './ConnectButton'
import { Spinner } from './Spinner'

export function NameManager({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { address } = useAccount()
  const { isSignedIn, signIn } = useSIWE()
  const names = useNamestone(address)
  const isMounted = useIsMounted()

  const [createState, createAction] = useFormState(createName, {})
  const [updateState, updateAction] = useFormState(updateName, {})

  useEffect(() => {
    if (createState.data?.success) {
      names.refetch()
    }
  }, [createState.data])

  if ((address && names.isLoading) || !isMounted) {
    return <Spinner />
  }

  if (address && isSignedIn && names.data?.first) {
    // Update name form
    return (
      <form
        className={cn('flex w-full max-w-md flex-col gap-2', className)}
        action={updateAction}
      >
        <input type="hidden" name="name" value={names.data.first.name} />
        <input type="hidden" name="address" value={address} />
        <input type="hidden" name="domain" value={parentDomain} />

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

        {/* <Input
          name="description"
          label="Description"
          placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer lacinia."
          defaultValue={names.data.first.text_records?.description}
        /> */}

        <SubmitButton text="Update" className="mt-1 sm:mt-0" />

        {updateState.data?.error && (
          <p className="text-sm text-red-500">{updateState.data?.error}</p>
        )}
      </form>
    )
  }

  // Register form
  return (
    <form
      className={cn('flex w-full max-w-80 flex-col gap-2', className)}
      action={(formData) => {
        if (address && isSignedIn) {
          createAction(formData)
        } else {
          signIn()
        }
      }}
    >
      <Input
        name="name"
        placeholder="Enter your name"
        suffix={`.${parentDomain}`}
      />

      <input type="hidden" name="address" value={address} />
      <input type="hidden" name="domain" value={parentDomain} />

      {(() => {
        if (address && isSignedIn) {
          return <SubmitButton text="Register" />
        }

        if (address) {
          return (
            <Button className="rounded-lg" onClick={signIn}>
              Sign In
            </Button>
          )
        }

        return <ConnectButton className="rounded-lg" />
      })()}

      {createState.data?.error && (
        <p className="text-sm text-red-500">{createState.data?.error}</p>
      )}
    </form>
  )
}

function SubmitButton({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      loading={pending}
      className={cn('rounded-lg', className)}
    >
      {text}
    </Button>
  )
}
