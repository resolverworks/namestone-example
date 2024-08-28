import { NextRequest, NextResponse } from 'next/server'

import { namestoneFetch, parentDomain } from '@/lib/namestone'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const offset = searchParams.get('offset') || '0'
  const address = searchParams.get('address')

  const queryParams = new URLSearchParams({
    domain: parentDomain,
    offset: offset,
  })

  if (address) {
    queryParams.append('address', address)
  }

  const names = await namestoneFetch({
    path: `get-names?${queryParams.toString()}`,
  })

  return NextResponse.json(names)
}
