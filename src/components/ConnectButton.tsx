'use client'

import { useIsMounted, useModal } from 'connectkit'
import { useAccount, useEnsAvatar, useEnsName } from 'wagmi'

import { Button } from '@/components/Button'
import { useNamestone } from '@/hooks/useNamestone'
import { cn, truncateAddress } from '@/lib/utils'

export function ConnectButton({
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { address } = useAccount()
  const { data: ensName } = useEnsName({ address })
  const { data: namestone } = useNamestone(address)
  const { data: ensAvatar } = useEnsAvatar({ name: ensName || undefined })
  const truncatedAddress = address ? truncateAddress(address) : undefined

  const { setOpen } = useModal()
  const show = () => setOpen(true)
  const isMounted = useIsMounted()

  const namestoneName = namestone?.first?.name

  if (!isMounted) return null

  if (truncatedAddress) {
    return (
      <Button
        className={cn(
          'normal-case',
          !namestoneName && ensAvatar && 'py-1 pl-1',
          props.className
        )}
        onClick={show}
        {...props}
      >
        {namestoneName ? (
          <span>{namestoneName}</span>
        ) : (
          <>
            {ensAvatar && <img src={ensAvatar} className="w-8 rounded-full" />}
            <span>{ensName || truncatedAddress}</span>
          </>
        )}
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
