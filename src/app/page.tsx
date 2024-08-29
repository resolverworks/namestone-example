import { ConnectButton } from '@/components/ConnectButton'
import { FarcasterIcon, XIcon } from '@/components/Icons'
import { NameManager } from '@/components/NameManager'
import { ProfileCard } from '@/components/ProfileCard'
import { namestoneFetch, parentDomain } from '@/lib/namestone'
import { NamestoneProfile } from '@/types/namestone'

export default async function Home() {
  const profiles = await namestoneFetch<NamestoneProfile[]>({
    path: `get-names?domain=${parentDomain}`,
  })

  return (
    <main>
      <section className="bg-gradient-radial">
        {/* Nav */}
        <nav className="flex items-center justify-between px-4 py-6 sm:p-8">
          <img src="/logo.webp" alt="logo" className="w-20 sm:w-28" />

          <ConnectButton />
        </nav>

        {/* Hero */}
        <section className="mx-auto flex min-h-[60svh] max-w-xl flex-col items-center justify-center px-4 py-24 text-center">
          <h1 className="text-3xl sm:text-5xl">
            Web3 Profiles for SheFi Summit Attendees
          </h1>

          <span className="mb-8 mt-2 sm:text-lg">
            Free ENS names for the SheFi community
          </span>

          {/* Main interactive form */}
          <NameManager />
        </section>
      </section>

      {/* Connect */}
      <section className="flex min-h-[20svh] flex-col items-center justify-center gap-6 bg-brand-yellowBg px-4 py-10 text-center sm:gap-8 sm:px-8 sm:py-14">
        <h2 className="text-2xl sm:text-4xl">Connect with each other</h2>

        <div className="grid w-full max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {profiles.map((profile) => (
            <ProfileCard key={profile.name} profile={profile} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="flex items-center justify-between gap-4 bg-brand-dark p-4 text-brand-light sm:px-8 sm:py-6">
        <div className="flex flex-col">
          <span>Powered by Namestone</span>
          <span>
            <a
              href="https://github.com/namestone"
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

          <a href="https://warpcast.com/shefi" target="_blank">
            <FarcasterIcon className="h-6 w-6" />
          </a>
        </div>
      </footer>
    </main>
  )
}
