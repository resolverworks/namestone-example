# Offchain Subname Registration Site

This is a single page application that lets users register and manage their offchain ENS subnames via the NameStone API.

## Configuration

- Change the `parentDomain` in [`src/lib/namestone.ts`](./src/lib/namestone.ts#L5) to your desired domain.
- Customize the allowlist functionality in [`src/lib/allowlist.ts`](./src/lib/allowlist.ts).

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
