'use server'

import { IronSession, getIronSession } from 'iron-session'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { Address } from 'viem'
import { z } from 'zod'
import { zfd } from 'zod-form-data'

import { actionClient } from '@/actions/client'
import { namestone, parentDomain } from '@/lib/namestone'
import { extractErrorMessage } from '@/lib/utils'
import { NamestoneProfileSchema } from '@/types/namestone'

const noSpaceString = z.string().refine((value) => !value.includes(' '))

const formSchema = zfd.formData(
  NamestoneProfileSchema.extend({
    avatar: noSpaceString.optional(),
    twitter: noSpaceString.optional(),
    telegram: noSpaceString.optional(),
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
    const namesByAddress = await namestone.getNames({
      domain: parentDomain,
      address: profile.address,
    })

    const nameExists = namesByAddress.find((name) => name.name === profile.name)

    // If the name does not exist, return an error
    if (!nameExists) {
      return { error: 'Name does not exist, or you do not own this name.' }
    }

    try {
      // If the name exists, update it
      await namestone.setName({
        ...profile,
        text_records: {
          avatar: profile.avatar || '',
          'com.twitter': profile.twitter || '',
          'org.telegram': profile.telegram || '',
        },
      })

      revalidatePath('/')
      return { success: true }
    } catch (err) {
      return {
        error:
          err instanceof Error ? extractErrorMessage(err) : 'Unknown error',
      }
    }
  })
