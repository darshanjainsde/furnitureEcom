# FINOKRAFT test suite

End-to-end and integration tests using Node's built-in test runner (`node:test`) plus
**puppeteer-core** driving your installed Google Chrome (no browser download).

## Run

The dev server must be running first (tests hit `http://localhost:3100`):

```bash
export PATH="/opt/homebrew/opt/node@20/bin:$PATH"
PORT=3100 npm run dev          # terminal 1

npm test                        # terminal 2  (or: npm run test:reset to seed fresh first)
```

Override the target with `BASE_URL=http://localhost:3000 npm test`.

## Coverage

| File | What it verifies |
|------|------------------|
| `public.test.mjs` | All 10 public/auth routes return 200; home shows brand + lead form; collections lists categories; product page shows enquiry form; unknown product → 404. |
| `api.test.mjs` | Lead API: valid → stored (id), invalid → 422, honeypot → silent 200. CSV export: 401 without auth, 200 + `text/csv` with business cookie. Upload: 401 without auth. |
| `auth.test.mjs` | `/owner` & `/business` redirect to their login when unauthenticated; owner & business login succeed; wrong password stays on login; owner creds rejected on the business portal (role gating). |
| `e2e.test.mjs` | Homepage hero lead form → thank-you; product enquiry form → thank-you; **owner edits hero headline → appears on live homepage** (then restored); **business adds a product → appears in Our Work**. |

> The e2e tests create a couple of demo leads and one demo product. Run `npm run db:reset`
> (or `npm run test:reset`) to return to clean seed data.
