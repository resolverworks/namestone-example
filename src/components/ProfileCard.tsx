'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

import { NamestoneProfile } from '@/types/namestone'

import { TelegramIcon, XIcon } from './Icons'

const transparentImage =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"%3E%3C/svg%3E'

export function ProfileCard({ profile }: { profile: NamestoneProfile }) {
  const [avatarUrl, setAvatarUrl] = useState<string>()
  const twitter = profile.text_records?.['com.twitter']
  const telegram = profile.text_records?.['org.telegram']
  const hasSocials = twitter || telegram
  const avatarRecord = profile.text_records?.avatar

  useEffect(() => {
    setAvatarUrl(
      avatarRecord?.startsWith('ipfs://')
        ? `https://gateway.pinata.cloud/ipfs/${avatarRecord.split('ipfs://')[1]}`
        : avatarRecord
    )
  }, [avatarRecord])

  return (
    <div
      key={profile.name}
      className="flex flex-col items-center gap-3 rounded-lg bg-gradient-card p-4"
    >
      <Image
        src={avatarUrl ?? transparentImage}
        alt={profile.name}
        width={48}
        height={48}
        className="h-12 w-12 rounded-full bg-brand-light object-cover"
        onError={() => {
          setAvatarUrl(transparentImage)
        }}
      />
      <span>
        {profile.name}.{profile.domain}
      </span>

      {/* Socials */}
      {hasSocials && (
        <div className="flex items-center gap-2">
          {twitter && (
            <a href={`https://twitter.com/${twitter}`} target="_blank">
              <XIcon className="h-4 w-4" />
            </a>
          )}

          {telegram && (
            <a href={`https://t.me/${telegram}`} target="_blank">
              <TelegramIcon className="h-4 w-4" />
            </a>
          )}
        </div>
      )}
    </div>
  )
}
