import NameStone from 'namestone-sdk'

const NAMESTONE_API_KEY = process.env.NAMESTONE_API_KEY as string

export const parentDomain = 'shefi.eth'

export const namestone = new NameStone(NAMESTONE_API_KEY)
