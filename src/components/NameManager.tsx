'use client'

import { useSIWE } from 'connectkit'
import React, { useEffect, useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { useAccount } from 'wagmi'

import { createName } from '@/actions/create'
import { updateName } from '@/actions/update'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { useIsMounted } from '@/hooks/useIsMounted'
import { useNamestone } from '@/hooks/useNamestone'
import { parentDomain } from '@/lib/namestone'
import { pinata } from '@/lib/pinata'
import { cn } from '@/lib/utils'

import { ConnectButton } from './ConnectButton'
import { CameraIcon } from './Icons'
import { Spinner } from './Spinner'

export function NameManager({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { address } = useAccount()
  const { isSignedIn, signIn } = useSIWE()
  const names = useNamestone(address)
  const isMounted = useIsMounted()

  const [imgUploading, setImgUploading] = useState(false)
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
        <FileUploader
          imgUploading={imgUploading}
          setImgUploading={setImgUploading}
          defaultValue={names.data.first.text_records?.avatar}
        />
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

        <SubmitButton
          text="Save"
          className="mt-1 sm:mt-0"
          imgUploading={imgUploading}
        />

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
          return <Button onClick={signIn}>Sign In</Button>
        }

        return <ConnectButton />
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
  imgUploading,
}: {
  text: string
  className?: string
  imgUploading?: boolean
}) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" loading={pending || imgUploading}>
      {imgUploading ? 'Uploading...' : text}
    </Button>
  )
}

function FileUploader({
  imgUploading,
  setImgUploading,
  defaultValue,
}: {
  imgUploading: boolean
  setImgUploading: (uploading: boolean) => void
  defaultValue: string | undefined
}) {
  const [ipfsUri, setIpfsUri] = useState('')
  const [localFileUrl, setLocalFileUrl] = useState<string | undefined>(
    defaultValue
      ? defaultValue.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')
      : undefined
  )

  const uploadFile = async (file: File) => {
    try {
      const keyRequest = await fetch('/api/pinata/key')
      const keyData = await keyRequest.json()
      const upload = await pinata.upload.file(file).key(keyData.JWT)
      console.log(upload)
      setIpfsUri(upload.IpfsHash)
    } catch (e) {
      console.error(e)
      alert('Trouble uploading file')
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) {
      alert('No file selected')
      return
    }

    setLocalFileUrl(URL.createObjectURL(file))
    setImgUploading(true)
    await uploadFile(file)
    setImgUploading(false)
  }

  return (
    <div
      className="relative mx-auto aspect-square w-fit rounded-full border border-brand-orange bg-gradient-card"
      style={
        localFileUrl
          ? {
              backgroundImage: `url('${localFileUrl}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }
          : {}
      }
    >
      <label
        htmlFor="file"
        className="flex h-20 w-20 cursor-pointer items-center justify-center transition-opacity hover:opacity-75"
      >
        {!localFileUrl && <CameraIcon />}
      </label>
      <input
        type="file"
        id="file"
        accept="image/*"
        multiple={false}
        onChange={handleFileChange}
        className="invisible absolute left-0 top-0 h-full w-full"
      />
      {ipfsUri && (
        <input type="hidden" name="avatar" value={`ipfs://${ipfsUri}`} />
      )}
    </div>
  )
}
