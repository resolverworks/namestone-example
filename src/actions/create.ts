'use server'

import { IronSession, getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { Address } from 'viem'
import { zfd } from 'zod-form-data'

import { actionClient } from '@/actions/client'
import { namestoneFetch } from '@/lib/namestone'
import { NamestoneProfileSchema } from '@/types/namestone'

const formSchema = zfd.formData(NamestoneProfileSchema)

export const createName = actionClient
  .schema(formSchema)
  .stateAction(async ({ parsedInput: profile }) => {
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
      return { error: 'Unauthorized' }
    }

    // Limit names to 3-12 characters
    if (profile.name.length < 3 || profile.name.length > 12) {
      return { error: 'Name must be between 3 and 12 characters' }
    }

    const res = await namestoneFetch<{ success?: boolean; error?: string }>({
      path: 'claim-name?single_claim=1',
      method: 'POST',
      body: profile,
    })

    if (res.error) {
      return { error: res.error }
    }

    return res
  })
