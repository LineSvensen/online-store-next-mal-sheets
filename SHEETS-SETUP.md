# Kodera – Google Sheets CMS

A reusable Next.js template using Google Sheets as a CMS, with optional Stripe Checkout.

## 1. Install dependencies

```bash
npm install
```

## 2. Create a Google Spreadsheet

Create a spreadsheet with a tab named `Produkter`.

Required columns:

`id | name | slug | description | price | image | tilgjengelig`

Optional column:

`lager`

### Column descriptions

- `id`: Unique positive integer
- `name`: Product name
- `slug`: Unique URL-friendly identifier
- `description`: Product description
- `price`: Price in NOK
- `image`: Path to an image in `/public/images`
- `tilgjengelig`: TRUE or FALSE
- `lager`: Optional stock quantity (non-negative integer)

### Stock management

Stock quantities are managed manually in Google Sheets.

- Empty `lager`: No stock quantity limit enforced
- `lager > 0`: Product available if `tilgjengelig` is TRUE
- `lager = 0`: Product automatically unavailable
- `tilgjengelig = FALSE`: Product unavailable regardless of stock

When Stripe Checkout is enabled, stock availability and quantities are checked against fresh Google Sheets data before creating a checkout session.

**Important:** Stock is not automatically deducted after a purchase. Store owners must update quantities manually.

Simultaneous purchases may result in overselling. This template does not provide stock reservations.

## 3. Google Cloud setup

1. Enable Google Sheets API.
2. Create a service account.
3. Share the spreadsheet with the service account.
4. Configure read-only access.
5. Configure server-side authentication.

Use a separate service account and spreadsheet for each client.

The application does not require write access to Google Sheets.

## 4. Environment variables

Copy `.env.example` to `.env.local`.

Fill in the Google Sheets credentials and spreadsheet ID.

For optional Stripe integration, configure:

- `STRIPE_CHECKOUT_ENABLED`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SITE_URL`

Set `STRIPE_CHECKOUT_ENABLED=false` until Stripe is ready.

Never commit private keys or `.env.local`.

Configure production environment variables separately in Vercel.

## 5. Start the project

```bash
npm run dev
```

## 6. Test Google Sheets

Open:

http://localhost:3000/api/sheets?type=produkter

Then visit:

http://localhost:3000/products

Update a product in Google Sheets and verify that the website reflects the change after cache revalidation.

Product display and the public API use a 60-second data cache.

Stripe Checkout uses fresh product data.

### Test stock management

Verify the following scenarios:

- `lager = 5`, quantity 2: Checkout allowed
- `lager = 1`, quantity 2: Checkout blocked
- `lager = 0`: Product unavailable
- Empty `lager`: Quantity unrestricted by stock
- `tilgjengelig = FALSE`: Checkout blocked

## 7. Stripe (optional)

Stripe is disabled until explicitly enabled and configured.

Set:

`STRIPE_CHECKOUT_ENABLED=true`

Configure `SITE_URL`, `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`.

Use Stripe test keys during development.

### Order management

Stripe Dashboard is used for payment and order information.

Store owners manually handle:

- Order review
- Product fulfilment and shipping
- Stock updates in Google Sheets

The included webhook is a foundation for future integrations. It does not currently save orders to a database, update stock or send custom order confirmations.

Verify that payment is completed before fulfilling orders.

For production use, review the webhook's handling of payment status and remove unnecessary logging of customer information.

## 8. Security and rate limiting

### Google Sheets API

The public `/api/sheets` endpoint returns only explicitly allowed product fields.

Product data is cached for 60 seconds to reduce Google Sheets API requests.

The service account uses read-only permissions.

### Stripe Checkout

Checkout validates product IDs, quantities, prices and availability using server-side data.

Prices from the browser are never trusted.

### Vercel Firewall

Rate limiting is recommended for production deployments.

Configure it separately for each client project in:

**Vercel Dashboard → Project → Firewall**

Suggested starting configuration:

- Rule name: `checkout-rate-limit`
- Request path: `/api/checkout`
- HTTP method: POST, if supported
- Action: Rate Limit
- Limit: 10 requests
- Window: 60 seconds
- Counting key: IP address
- Over-limit response: 429

Adjust these settings based on expected traffic and shared-IP usage.

Vercel Firewall settings are not automatically copied with the GitHub template.

Review current Vercel plan limits and pricing before activation.

Rate limiting reduces abuse but does not eliminate all automated attacks.

## 9. Production checklist

### Google Sheets

- [ ] Create a separate spreadsheet for the client
- [ ] Configure a read-only service account
- [ ] Validate spreadsheet data
- [ ] Verify stock quantities and availability

### Stripe (if enabled)

- [ ] Configure production Stripe credentials
- [ ] Configure the production webhook endpoint
- [ ] Test successful and unsuccessful payments
- [ ] Verify products, quantities and customer information in Stripe Dashboard
- [ ] Verify webhook signature and payment-status handling
- [ ] Remove unnecessary customer-data logging
- [ ] Test stock validation before Checkout
- [ ] Confirm manual order and stock management procedures

### Security and deployment

- [ ] Configure environment variables in Vercel
- [ ] Verify no secrets are committed to Git
- [ ] Review Google Sheets API usage and quotas
- [ ] Configure Vercel Firewall rate limiting where appropriate
- [ ] Test product and cart functionality
- [ ] Run `npm audit`
- [ ] Run `npm run build`
- [ ] Test live site functionality and performance
- [ ] Confirm Stripe is disabled when not required

---

## Future extensions

This template intentionally prioritizes simplicity.

Possible future integrations include:

- Supabase for order storage
- Automated stock management
- Transaction-safe stock reservations
- Customer order history
- Automated fulfilment workflows

These features are not required for the basic Google Sheets CMS template.
