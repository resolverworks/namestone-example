import { Button } from '@/components/Button'
import { FarcasterIcon, XIcon } from '@/components/Icons'

// Placeholder for Namestone data
// https://namestone.xyz/docs/get-names
const profiles = [
  {
    name: 'alice',
    domain: 'shefi.eth',
    textRecords: {
      avatar:
        'https://pbs.twimg.com/profile_images/1537166821413068801/tzy22ZqV_400x400.jpg',
      'com.twitter': 'shefiorg',
    },
  },
  {
    name: 'bob',
    domain: 'shefi.eth',
    textRecords: {
      avatar:
        'https://pbs.twimg.com/profile_images/1537166821413068801/tzy22ZqV_400x400.jpg',
      'com.twitter': 'shefiorg',
    },
  },
  {
    name: 'charlie',
    domain: 'shefi.eth',
    textRecords: {
      avatar:
        'https://pbs.twimg.com/profile_images/1537166821413068801/tzy22ZqV_400x400.jpg',
      'com.twitter': 'shefiorg',
    },
  },
  {
    name: 'divia',
    domain: 'shefi.eth',
    textRecords: {
      avatar:
        'https://pbs.twimg.com/profile_images/1537166821413068801/tzy22ZqV_400x400.jpg',
      'com.twitter': 'shefiorg',
    },
  },
]

export default function Home() {
  return (
    <main>
      <section className="bg-gradient-radial">
        {/* Nav */}
        <nav className="flex items-center justify-between px-4 py-6 sm:p-8">
          <img src="/logo.webp" alt="logo" className="w-20 sm:w-28" />

          <Button>
            <span className="sm:hidden">Connect</span>
            <span className="hidden sm:inline">Connect Wallet</span>
          </Button>
        </nav>

        {/* Hero */}
        <section className="mx-auto flex max-w-xl flex-col items-center justify-center px-4 py-24 text-center">
          <h1 className="text-3xl sm:text-5xl">
            Web3 Profiles for SheFi Summit Attendees
          </h1>

          <span className="mb-8 mt-2 sm:text-lg">
            Free ENS names for the SheFi community
          </span>

          {/* Main interactive form */}
          <div></div>
        </section>
      </section>

      {/* Connect */}
      <section className="bg-brand-yellowBg flex flex-col items-center gap-6 px-4 py-10 text-center sm:gap-8 sm:px-8 sm:py-14">
        <h2 className="text-2xl sm:text-4xl">Connect with each other</h2>

        <div className="grid w-full max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {profiles.map((profile) => (
            <div
              key={profile.name}
              className="bg-brand-blueBg border-brand-blueBtn flex flex-col items-center gap-2 rounded-lg border p-4"
            >
              <img
                src={profile.textRecords.avatar}
                alt={profile.name}
                width={48}
                className="rounded-full"
              />
              <span>
                {profile.name}.{profile.domain}
              </span>

              {/* <div></div> */}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-dark text-brand-light flex items-center justify-between gap-4 p-4 sm:px-8 sm:py-6">
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

        <div className="text-brand-pink flex gap-3">
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
