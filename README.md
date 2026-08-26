# Realistic Dog Cost Calculator

Production-oriented Next.js + TypeScript + Tailwind CSS dog ownership cost calculator.

## Current architecture

- Next.js App Router
- React + TypeScript
- Tailwind CSS v4
- Recharts for result charts
- Local-first calculator; **no backend, API, authentication or database is required**
- LocalStorage for optional saved calculator state
- Share links encode a small safe subset of calculator state in the URL
- Static/dynamic SEO pages for supported breeds

## Requirements

- Node.js 20.9+ (Node 22 LTS is suitable)
- npm

## Install

```bash
npm install
```

## Development

```bash
npm run dev
```

Open `http://localhost:3000`.

## Quality checks

Run these before deployment:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

For a production smoke test after building:

```bash
npm start
```

Then open `http://localhost:3000` and test the main routes and calculator flows.

## Security notes

The application has no server-side user accounts, database queries or application API endpoints. Calculator data is processed in the browser. Production response headers include basic hardening headers and a restrictive content-security policy suitable for the current first-party-only build.

Do not add API keys, private credentials or service-account secrets to `NEXT_PUBLIC_*` variables. If a future integration requires a secret, keep it server-side and outside source control.

## Calculator methodology

The calculator distinguishes monthly and annual inputs. Food, grooming, insurance, walking/daycare, travel, supplies and housing inputs are modeled monthly; healthcare, training and unexpected-vet inputs are entered annually and converted to monthly values. One-time purchase/setup costs are added to the first year only.

Breed data in `data/breeds.ts` is planning-assumption data. It is not an official veterinary or retail pricing database. Validate the assumptions against the countries you target before making strong editorial claims about typical costs.

Currency switching uses an approximate static FX conversion so the site remains backend-free. It is not a live exchange-rate service.

## SEO

The project includes:

- Per-route titles/descriptions
- Canonical URLs
- Open Graph and Twitter metadata
- `robots.txt`
- `sitemap.xml`
- Dynamic breed landing pages
- FAQ structured data on the FAQ page and breed pages
- Semantic headings and accessible form labels
- Favicon and web manifest

## Ads

The current build contains visual ad-slot containers only. No live advertising network is loaded.

Before enabling AdSense or another provider:

1. Obtain approval for the site.
2. Add the provider's official script/component.
3. Use the exact publisher/slot IDs supplied by the provider.
4. Update `public/ads.txt` with the exact authorized line.
5. Add the required cookie/consent and privacy disclosures for the markets you serve.
6. Test ad placement on mobile so ads do not cause accidental clicks or layout shifts.

## Affiliates

No affiliate links are active in the audited build. The recommendation block is intentionally non-clickable until real approved destinations are supplied.

When adding affiliate links, disclose the relationship clearly and use the final program's required disclosures.

## Analytics

Analytics is intentionally not enabled in this build. If you add analytics, document the provider, purpose, data collected, retention and consent requirements before activation.

## Add or edit breeds

Edit `data/breeds.ts`. Each breed is centralized and becomes available in the calculator, breed index and dynamic breed route.

## Legal pages

Privacy, terms and disclaimer pages contain general informational language. They are **not a substitute for jurisdiction-specific legal advice**. Before commercial launch, add the real operator/business identity, contact details and any disclosures required by the jurisdictions and advertising/affiliate vendors you use.

## Deployment: Vercel

Recommended for this Next.js project because it removes most server configuration work.

1. Create a Git repository and push the project.
2. Import the repository into Vercel.
3. Keep the framework preset as Next.js.
4. Use `npm run build` as the build command if Vercel does not detect it automatically.
5. Deploy.
6. Add your production domain in the Vercel project settings.
7. Point your DNS records to the values Vercel provides.
8. Wait for DNS validation and certificate issuance.
9. Test HTTPS, `/robots.txt`, `/sitemap.xml`, every primary route and the calculator.

Set `NEXT_PUBLIC_SITE_URL` to the real production origin (for example `https://your-real-domain.com`) before deployment. Do not leave the localhost fallback in production.

## Known launch prerequisites

The codebase is substantially hardened and the calculator engine has been audited, but a true commercial launch still requires:

- real business/operator contact details
- final jurisdiction-specific privacy/terms language
- final advertising/affiliate consent and disclosures if those services are enabled
- a real domain controlled by the owner
- deployment smoke tests on the chosen hosting platform
- browser testing on current desktop and mobile browsers

## Important

Do not describe preset values as guaranteed prices. The calculator is an estimate and should remain clearly labeled as such.
