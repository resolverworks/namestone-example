'use client'

import { cn } from '@/lib/utils'

type Props = {
  children: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ children, className, ...props }: Props) {
  return (
    <button
      className={cn([
        'border-brand-orange bg-brand-yellowBtn hover:bg-brand-yellowBg flex items-center gap-1.5 rounded-full border px-4 py-2 uppercase',
        className,
      ])}
      {...props}
    >
      {children}
    </button>
  )
}
