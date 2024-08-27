'use client'

import { useModal } from 'connectkit'
import { useAccount, useEnsAvatar, useEnsName } from 'wagmi'

import { Button } from '@/components/Button'
import { cn, truncateAddress } from '@/lib/utils'

export function ConnectButton() {
  const { address, isConnected } = useAccount()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName || undefined })
  const truncatedAddress = address ? truncateAddress(address) : undefined

  const { setOpen } = useModal()
  const show = () => setOpen(true)

  if (isConnected && truncatedAddress) {
    return (
      <Button
        className={cn('normal-case', ensAvatar && 'py-1 pl-1')}
        onClick={show}
      >
        {ensAvatar && <img src={ensAvatar} className="w-8 rounded-full" />}
        <span>{ensName || truncatedAddress}</span>
      </Button>
    )
  }

  return (
    <Button onClick={show}>
      <span className="sm:hidden">Connect</span>
      <span className="hidden sm:inline">Connect Wallet</span>
    </Button>
  )
}
