'use server'

import { IronSession, getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { Address } from 'viem'
import { zfd } from 'zod-form-data'

import { actionClient } from '@/actions/client'
import { isAllowlisted } from '@/lib/allowlist'
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
      return {
        error: 'Your session is invalid. Please disconnect and connect again.',
      }
    }

    // if (!(await isAllowlisted(profile.address))) {
    //   return { error: "You're not permitted to register a name at this time." }
    // }

    // Limit names to 3-12 characters, alphanumeric, and no special characters (besides hyphen)
    if (
      profile.name.length < 3 ||
      profile.name.length > 12 ||
      !/^[a-z0-9-]+$/.test(profile.name)
    ) {
      return { error: 'Name must be 3 - 12 alphanumeric characters' }
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
