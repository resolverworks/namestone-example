import { NamestoneProfile } from '@/types/namestone'

const NAMESTONE_API_KEY = process.env.NAMESTONE_API_KEY

export const parentDomain = 'testfi.eth'

export type Props = {
  path: string
  options?: RequestInit
  method?: 'GET' | 'POST'
  body?: NamestoneProfile
}

export async function namestoneFetch<T>({
  path,
  options = {},
  method = 'GET',
  body,
}: Props) {
  if (!NAMESTONE_API_KEY) {
    throw new Error('NAMESTONE_API_KEY is not set')
  }

  const res = await fetch('https://namestone.xyz/api/public_v1/' + path, {
    ...options,
    method,
    headers: {
      ...options.headers,
      Authorization: NAMESTONE_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    next: {
      revalidate: 60,
    },
  })

  const data = await res.json()
  return data as T
}
