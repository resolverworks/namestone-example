import { NextRequest, NextResponse } from 'next/server'

import { namestone, parentDomain } from '@/lib/namestone'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const offset = searchParams.get('offset') || '0'
  const address = searchParams.get('address')

  const names = await namestone.getNames({
    domain: parentDomain,
    offset: Number(offset ?? 0),
    address: address ?? undefined,
  })

  return NextResponse.json(names)
}
