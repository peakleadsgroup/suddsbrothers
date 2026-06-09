# Sudds Brothers Pressure Washing

Professional pressure washing and soft washing website for coastal North Carolina.

## Pages

- **Home** (`index.html`) — Hero, trust pillars, section previews
- **About** (`about.html`) — Owner story and eco-friendly approach
- **Services** (`services.html`) — Power washing and soft washing details
- **Who We Serve** (`who-we-serve.html`) — Homeowners, realtors, property managers, and business owners
- **Locations** (`locations.html`) — Service areas and interactive map
- **Contact** (`contact.html`) — Contact form and tap-to-call/text/email

## Local Development

Open any HTML file directly in a browser, or use a local server:

```bash
npx serve .
```

> **Note:** The contact form requires the Cloudflare Pages Function at `/api/contact`. It will not work with a plain file server — deploy to Cloudflare Pages or use `wrangler pages dev` for local testing.

## Deploy to Cloudflare Pages

1. Push this repo to GitHub (`peakleadsgroup/suddsbrothers`)
2. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. Select the repository and configure:
   - **Build command:** (leave empty)
   - **Build output directory:** `/`
4. Deploy

Cloudflare automatically detects the `functions/` directory and deploys the `/api/contact` endpoint.

## Airtable Setup

### 1. Create your Airtable base

Create a table (e.g. "Leads") with these columns:

| Column Name  | Field Type |
|-------------|------------|
| First Name  | Single line text |
| Last Name   | Single line text |
| Phone       | Phone number |
| Email       | Email |
| Message     | Long text |
| Submitted At| Date (include time) |

### 2. Get your credentials

- **Base ID:** Found in the Airtable API docs for your base (starts with `app...`)
- **Table Name:** The exact name of your table (e.g. `Leads`)
- **Token:** Create a [Personal Access Token](https://airtable.com/create/tokens) with `data.records:write` scope for your base

### 3. Add environment variables in Cloudflare

In your Cloudflare Pages project → **Settings** → **Environment variables**, add:

| Variable | Value |
|----------|-------|
| `AIRTABLE_TOKEN` | Your personal access token |
| `AIRTABLE_BASE_ID` | Your base ID (e.g. `appXXXXXXXXXXXXXX`) |
| `AIRTABLE_TABLE_NAME` | Your table name (e.g. `Leads`) |

Redeploy after adding variables.

## Customization

- **Social links:** Facebook and Instagram are configured; update if handles change
- **Logo:** `images/logo.png` (transparent background)

## Contact

- Phone: (919) 441-0934
- Email: contact@suddspressurewashing.com
