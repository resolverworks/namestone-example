import { IronSession, getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import * as v from 'valibot'
import { Address } from 'viem'

import { namestoneFetch, parentDomain } from '@/lib/namestone'
import { NamestoneProfile, NamestoneProfileSchema } from '@/types/namestone'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const safeParse = v.safeParse(NamestoneProfileSchema, body)

  if (!safeParse.success) {
    return NextResponse.json({ error: safeParse.issues }, { status: 400 })
  }

  const profile = safeParse.output
  let session: IronSession<{ address: Address }>

  try {
    // Validate the SIWE session
    session = await getIronSession(cookies(), {
      password: process.env.SESSION_SECRET as string,
      cookieName: 'siwe',
    })

    // Only let users register names for themselves
    if (session.address !== profile.address) {
      throw new Error()
    }
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if the name exists
  const namesByAddress = await namestoneFetch<NamestoneProfile[]>({
    path: `get-names?domain=${parentDomain}&address=${profile.address}`,
  })

  const nameExists = namesByAddress.find((name) => name.name === profile.name)

  // If the name does not exist, return an error
  if (!nameExists) {
    return NextResponse.json(
      { error: 'Name does not exist, or you do not own this name.' },
      { status: 400 }
    )
  }

  // If the name exists, update it
  const res = await namestoneFetch<{ success?: boolean; error?: string }>({
    path: 'set-name',
    method: 'POST',
    body: profile,
  })

  return NextResponse.json(res)
}
