import { Toaster } from 'react-hot-toast'

import { ConnectButton } from '@/components/ConnectButton'
import { XIcon } from '@/components/Icons'
import { NameManager } from '@/components/NameManager'
import { ProfileCard } from '@/components/ProfileCard'
import { Squiggle } from '@/components/Squiggle'
import { namestone, parentDomain } from '@/lib/namestone'

export default async function Home() {
  const profiles = await namestone.getNames({ domain: parentDomain })

  return (
    <main>
      <section className="bg-gradient-radial">
        {/* Nav */}
        <nav className="flex items-center justify-between p-6 sm:p-8">
          <img src="/logo.webp" alt="logo" className="w-20 sm:w-28" />

          <ConnectButton />
        </nav>

        {/* Hero */}
        <section className="mx-auto flex min-h-[75svh] max-w-3xl flex-col items-center justify-center px-6 py-24 text-center">
          <h1 className="text-4xl sm:text-6xl">
            Web3 Profiles for <br />
            SheFi Summit Attendees
          </h1>

          <span className="mb-8 mt-3 text-lg sm:text-xl">
            Free ENS names for the SheFi community
          </span>

          {/* Main interactive form */}
          <NameManager />
        </section>
      </section>

      <Squiggle className="bg-gradient-to-b from-[#EDEDEB] to-transparent" />

      {/* Connect */}
      <section className="flex min-h-[25svh] flex-col items-center justify-center gap-6 px-6 py-10 text-center sm:gap-8 sm:px-8 sm:py-14">
        <h2 className="text-2xl sm:text-4xl">Connect with each other</h2>

        <div className="grid w-full max-w-4xl grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
          {profiles?.map((profile) => (
            <ProfileCard key={profile.name} profile={profile} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="flex items-center justify-between gap-6 bg-brand-dark px-6 py-4 text-brand-light sm:px-8 sm:py-6">
        <div className="flex flex-col text-sm sm:text-base">
          <span>
            Powered by{' '}
            <a
              href="https://namestone.xyz/"
              target="_blank"
              className="text-brand-pink underline"
            >
              Namestone
            </a>
          </span>
          <span>
            <a
              href="https://github.com/resolverworks/namestone-example"
              target="_blank"
              className="text-brand-pink underline"
            >
              View the code on GitHub
            </a>
          </span>
        </div>

        <div className="flex gap-3 text-brand-pink">
          <a href="https://x.com/shefiorg" target="_blank">
            <XIcon className="h-6 w-6" />
          </a>
        </div>
      </footer>

      <Toaster position="bottom-center" />
    </main>
  )
}
