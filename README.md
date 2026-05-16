This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Requirements

- Node **24.x** (npm 11+ is bundled). The repo declares `engines.node: "24.x"`
  and `.npmrc` uses `min-release-age` (npm 11 only). Running on older Node
  will print engine warnings and silently disable the install cooldown.
- Vercel project must be configured to deploy on Node 24.x.

## Getting Started

After cloning, run:

```bash
nvm use 24
npm run setup
```

`npm run setup` runs `npm ci && npm run prepare` to install dependencies and
register husky hooks. **Do not run plain `npm install` for first-time setup:**
`.npmrc` sets `ignore-scripts=true` to block install lifecycle scripts (the
primary RCE vector for supply-chain worms), so husky's `prepare` script
would not fire automatically.

Then start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see
the result.

## Supply-chain notes

- `.npmrc` enforces a **3-day cooldown** (`min-release-age=3`) on newly
  published versions. This affects new resolutions only — `npm ci` reads
  the lockfile and is not gated.
- If you need to install a freshly published patch (e.g. a same-day CVE
  fix), bypass the cooldown explicitly:
  ```bash
  npm install <pkg> --min-release-age=0
  ```
- Lifecycle scripts are disabled. If a dep legitimately needs its
  postinstall (e.g. native binary rebuild), run `npm rebuild <pkg>` after
  install.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
