import { IronSession, getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import * as v from 'valibot'
import { Address } from 'viem'

import { namestoneFetch } from '@/lib/namestone'
import { NamestoneProfileSchema } from '@/types/namestone'

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

  const res = await namestoneFetch<{ success?: boolean; error?: string }>({
    path: 'claim-name?single_claim=1',
    method: 'POST',
    body: profile,
  })

  if (res.error) {
    return NextResponse.json({ error: res.error }, { status: 400 })
  }

  return NextResponse.json(res)
}
