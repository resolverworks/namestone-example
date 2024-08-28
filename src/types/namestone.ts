import * as v from 'valibot'
import { Address, isAddress } from 'viem'

export const NamestoneProfileSchema = v.object({
  name: v.string(),
  address: v.string(),
  domain: v.string(),
  textRecords: v.optional(v.record(v.string(), v.string())),
  coin_types: v.optional(
    v.object({
      '60': v.custom<Address>(
        (input) => isAddress(input as Address),
        'Invalid Ethereum address'
      ),
    })
  ),
})

export type NamestoneProfile = v.InferOutput<typeof NamestoneProfileSchema>
