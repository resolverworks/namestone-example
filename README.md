# Offchain Subname Registration Site

This is a single page application that lets users register and manage their offchain ENS subnames via the NameStone API.

## Tools

### NameStone

Namestone is an API for easy subdomain management and issuance. Follow [their docs](https://namestone.xyz/docs) to set up a free account.

### Pinata

Pinata is a cloud storage provider that supports pinning content to IPFS. We use it to store ENS avatar images. Follow [this guide](https://docs.pinata.cloud/frameworks/next-js#setup-pinata-2) to create the relevant API key (it needs Admin permissions).

### Upstash

Upstash is a Redis provider that we use for storing allowlisted addresses. Customize the allowlist functionality in [src/lib/allowlist.ts](./src/lib/allowlist.ts).

## Configuration

- Change the `parentDomain` in [src/lib/namestone.ts](./src/lib/namestone.ts#L5) to your desired domain.
- Customize the allowlist functionality in [src/lib/allowlist.ts](./src/lib/allowlist.ts).

## Notes

- Adding `gateway.pinata.cloud` as an approved host in [next.config.mjs](./next.config.mjs) is good for optimizing image loading, but also allows proxying of any IPFS content through your domain. If this is an issue, remove the host and change `<Image />` to `<img />` in [src/components/ProfileCard.tsx](./src/components/ProfileCard.tsx#L33).

## Development

Install dependencies

```bash
yarn install
```

Create a `.env.local` file based on the template and set your environment variables.

```bash
cp .env.example .env.local
```

Start the development server

```bash
yarn dev
```
