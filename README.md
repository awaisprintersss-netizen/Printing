This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Production and staging configuration

- **MongoDB.** Set `DATABASE_URL` and use `DATABASE_NAME` to select the database for `galleryItems`, `quotations`, and `quotationRateLimits`. Production keeps the `printingdata` default when `DATABASE_NAME` is unset. Vercel Preview and custom non-production environments require a different name. Enable Vercel's system environment variables so the app can identify the deployment. For staging on another host, explicitly set a dedicated `DATABASE_NAME`. Use a separate cluster or a separate MongoDB user scoped only to the staging database. The name in the connection URI does not select the application's database. Database names are 1–63 ASCII characters, start with a letter or digit, and may include letters, digits, underscores, and hyphens. MongoDB system databases are reserved. Existing production records need no migration.
- **Clerk.** Use a separate Clerk instance in staging and matching `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` for each environment. Use **Invite-only** access, invite staff through Clerk, and verify the hosted invitation flow and MFA in staging. Assign `{"role":"admin"}` in Clerk **Public metadata** only to approved administrators. Invitation or sign-in alone does not grant admin access.
- **Cloudinary.** Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`. Use a separate Cloudinary product environment in staging so its uploads, access, and retention are isolated. Scope secrets to their deployment environments and keep them out of source control and support logs.

### Gallery operations

- `/api/store-gallery-data` returns 410. It has no database access or sample records. Use disposable fixture data in staging through the authorized gallery editor.
- Both upload routes accept images up to 3 MiB. Gallery editor uploads use base64 JSON with a 4 MiB image payload plus at most 64 KiB for request overhead. This stays below Vercel's default 4.5 MB request limit. Oversized files are rejected in the editor and server-side.
- Gallery writes never delete Cloudinary assets. Existing gallery links can share the same image by URL even without a stored Cloudinary ID. New uploads carry the `awais-gallery-upload` tag and a unique public ID. Server warnings identify uploads to review after failed writes, conflicts, or uncertain upload results. The standalone upload route creates a tagged asset without adding a gallery record.
- Review retention in the correct Cloudinary environment. Reconcile the tagged asset inventory and warning IDs against both `imagePublicId` and stored image URLs, including transformed versions and references outside the gallery. Assume a failed acknowledgement can have committed the record. Coordinate any cleanup with gallery editors, recheck references, verify ownership and a backup, and get approval before deletion. Retain files if any of these checks are uncertain.
- Gallery titles, descriptions, tags, client display names, and images are public. The public API omits image URLs with embedded usernames or passwords. Publish only approved project details, business names, and public image URLs. Review existing records for personal contact details, signed or private links, and unapproved client names before releasing. If the gallery returns HTTP 503, use private server logs to check MongoDB connectivity and permissions.

Run the route regression tests with `npm test` on Node.js 22.19 or later in the Node.js 22 line. The tests mock Clerk, MongoDB and Cloudinary and use no external credentials.

### Quotation inbox

- The contact form writes to `quotations` in the configured database. Staff with the Clerk `admin` role can read inquiries and update their status at `/admin/quotations`. Staff should check the inbox for new requests.
- The first submission creates indexes on `quotations` and on the separate `quotationRateLimits` collection. The database user needs read, insert, update and index creation permissions on these two collections. Verify those permissions and the end-to-end workflow in staging before release.
- The server uses the existing Clerk secret to hash duplicate and rate limit keys. It does not store raw client IP addresses. It accepts up to 8 attempts per trusted Vercel IP and 120 site-wide per 15-minute window. Without a valid Vercel-provided `x-vercel-forwarded-for` value the shared limit still applies. Check per-IP behavior on the actual Preview host, especially if a CDN or reverse proxy sits in front of Vercel. Clerk secret rotation also changes deduplication and rate-limit keys. Expired rate buckets are removed by a MongoDB TTL index.
- Retrying the ID of a stored submission does not create a second inquiry. Matching normalized content submitted with a different ID is also deduplicated within the same UTC day.
- No email provider is configured. Future notifications can be queued after a new inquiry is persisted, using the inquiry ID as the notification job key.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
