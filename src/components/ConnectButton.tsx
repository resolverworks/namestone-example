'use client'

import { useIsMounted, useModal } from 'connectkit'
import { useAccount, useEnsAvatar, useEnsName } from 'wagmi'

import { Button } from '@/components/Button'
import { cn, truncateAddress } from '@/lib/utils'

export function ConnectButton({
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { address } = useAccount()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName || undefined })
  const truncatedAddress = address ? truncateAddress(address) : undefined

  const { setOpen } = useModal()
  const show = () => setOpen(true)
  const isMounted = useIsMounted()

  if (!isMounted) return null

  if (truncatedAddress) {
    return (
      <Button
        className={cn('normal-case', ensAvatar && 'py-1 pl-1', props.className)}
        onClick={show}
        {...props}
      >
        {ensAvatar && <img src={ensAvatar} className="w-8 rounded-full" />}
        <span>{ensName || truncatedAddress}</span>
      </Button>
    )
  }

  return (
    <Button onClick={show} {...props}>
      <span className="sm:hidden">Connect</span>
      <span className="hidden sm:inline">Connect Wallet</span>
    </Button>
  )
}
