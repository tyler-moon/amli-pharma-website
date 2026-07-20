# AMLI Group — Deployment (GitHub → Cloudflare Pages)

Static Next.js export. Hosted on Cloudflare Pages, domain managed in Cloudflare DNS.

## Cloudflare Pages settings
- Framework preset: **Next.js (Static HTML Export)** (or "None")
- Build command: `npm run build`
- Build output directory: `out`
- Node version: `20` (set via `.nvmrc` or env var `NODE_VERSION=20`)

## Custom domain
- Add `amli.group` (and `www.amli.group` if desired) in Pages → Custom domains.
- DNS is already on Cloudflare, so the CNAME/record is created automatically.

## Local preview
```
npm install
npm run dev        # http://localhost:3000
npm run build      # static export to ./out
```
