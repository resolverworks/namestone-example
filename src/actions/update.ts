'use server'

import { IronSession, getIronSession } from 'iron-session'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { Address } from 'viem'
import { z } from 'zod'
import { zfd } from 'zod-form-data'

import { actionClient } from '@/actions/client'
import { namestoneFetch, parentDomain } from '@/lib/namestone'
import { NamestoneProfile, NamestoneProfileSchema } from '@/types/namestone'

const formSchema = zfd.formData(
  NamestoneProfileSchema.extend({
    avatar: z.string().optional(),
    twitter: z.string().optional(),
    telegram: z.string().optional(),
  })
)

export const updateName = actionClient
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

    // Check if the name exists
    const namesByAddress = await namestoneFetch<NamestoneProfile[]>({
      path: `get-names?domain=${parentDomain}&address=${profile.address}`,
    })

    const nameExists = namesByAddress.find((name) => name.name === profile.name)

    // If the name does not exist, return an error
    if (!nameExists) {
      return { error: 'Name does not exist, or you do not own this name.' }
    }

    // If the name exists, update it
    const res = await namestoneFetch<{ success?: boolean; error?: string }>({
      path: 'set-name',
      method: 'POST',
      body: {
        ...profile,
        text_records: {
          avatar: profile.avatar || '',
          'com.twitter': profile.twitter || '',
          'org.telegram': profile.telegram || '',
        },
      },
    })

    if (res.error) {
      return { error: res.error }
    }

    revalidatePath('/')

    return res
  })
