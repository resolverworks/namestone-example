import { useQuery } from '@tanstack/react-query'
import { NameData } from 'namestone-sdk'
import { Address } from 'viem'

export function useNamestone(address?: Address) {
  return useQuery({
    queryKey: ['namestone', address],
    queryFn: async () => {
      const queryParams = new URLSearchParams()
      if (address) {
        queryParams.append('address', address)
      }

      const res = await fetch(`/api/names?${queryParams.toString()}`)
      const json = (await res.json()) as NameData[]
      if (address) {
        return { first: json[0], all: json }
      }

      return { all: json }
    },
  })
}
