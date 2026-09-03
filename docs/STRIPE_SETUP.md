# Stripe Setup — Phase 10 (Military AI Workout, monthly subscription)

## 1. Create the product
Stripe Dashboard → Product catalog → Add product.
- Name: "Military AI Workout"
- Create 3 Prices under it — **all as "Recurring", billing period "Monthly"** (this is a subscription, not a one-time purchase):
  - EUR — €4.99/month (used for Portugal AND Spain)
  - USD — $5.99/month (United States)
  - BRL — R$19.90/month (Brazil)

Copy each Price ID (starts with `price_...`) — you'll paste these into Vercel.

## 2. Get your API keys
Developers → API keys.
- Copy the **Secret key** → `STRIPE_SECRET_KEY`

## 3. Set up the webhook
Developers → Webhooks → Add endpoint.
- Endpoint URL: `https://YOUR_DOMAIN/api/webhooks/stripe` (no locale prefix — this route doesn't live under `/pt-br/` etc.)
- Make sure it's listening for **events on your account**, not "Connected accounts" (that's for Stripe Connect platforms, which this isn't).
- Events to send: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- After creating it, click into the endpoint and copy the **Signing secret** → `STRIPE_WEBHOOK_SECRET`

## 4. Environment variables (Vercel)
Add these (Config type, all 3 environments):
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_MILITARY_BR`
- `STRIPE_PRICE_MILITARY_EU`
- `STRIPE_PRICE_MILITARY_US`
- `NEXT_PUBLIC_APP_URL` (your live domain, e.g. `https://fitpulse-indol-rho.vercel.app`)

## How it works
1. User completes the questionnaire (`/militar/questionario`) → answers saved to Firestore.
2. "Ir para Pagamento" calls `/api/checkout/military`, which creates a Stripe Checkout Session in **subscription mode**, priced by the user's country, and redirects to Stripe's hosted checkout page.
3. After payment, Stripe redirects to `/militar/sucesso`, which verifies the session server-side before showing success (never trusts the URL alone).
4. Independently, Stripe calls `/api/webhooks/stripe` with signed events:
   - `checkout.session.completed` → activates `militaryAiSubscriptionStatus: "active"` on the user.
   - `customer.subscription.updated` → keeps status in sync (e.g. `past_due` if a renewal payment fails).
   - `customer.subscription.deleted` → sets status to `"canceled"` when the subscription ends.
   All of these are idempotent via a `stripe_webhook_events/{eventId}` guard doc, so retries or duplicate deliveries never double-process.

## Testing before going live
Use Stripe's test mode + test card `4242 4242 4242 4242` (any future expiry, any CVC) to run through the full flow without real charges. Switch to live keys only once verified.
