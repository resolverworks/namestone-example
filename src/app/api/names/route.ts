import { NextRequest, NextResponse } from 'next/server'

import { namestoneFetch, parentDomain } from '@/lib/namestone'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const offset = searchParams.get('offset') || '0'

  const names = await namestoneFetch({
    path: `get-names?domain=${parentDomain}&offset=${offset}`,
  })

  return NextResponse.json(names)
}
