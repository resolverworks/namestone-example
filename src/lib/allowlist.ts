'server only'

import { Redis } from '@upstash/redis'
import { Address } from 'viem'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
})

export function isAllowlisted(address: Address) {
  return redis.get<boolean>(`allowlist:${address}`)
}
