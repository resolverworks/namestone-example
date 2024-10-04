import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function extractErrorMessage(error: Error) {
  const message = error.message

  // Try to parse the message from the error string
  const regex = /message:\s*(.+)/ // Match the message part
  const match = regex.exec(message)

  if (match && match[1]) {
    // If a match is found, parse the JSON error object
    try {
      const errorObject = JSON.parse(match[1])
      return errorObject.error // Return just the error message
    } catch (e) {
      return match[1] // Return the original message if parsing fails
    }
  }

  return error // Fallback to the original error if no message is found
}
