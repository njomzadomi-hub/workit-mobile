# WORKIT Launch Checklist

WORKIT is ready to launch only when every P0 gate below is complete.

## P0 — must pass before public launch

- [ ] Production Supabase project is ACTIVE and schema is applied/reviewed.
- [ ] Dedicated WORKIT payment account is connected; no other project account is reused.
- [ ] Marketplace checkout creates an order, records WORKIT fee, and records seller payout correctly.
- [ ] Refund/dispute path is tested before real-money launch.
- [ ] Sign up, login, logout, session restore and account recovery work on iOS and Android.
- [ ] Feed scroll is stable for long sessions and video/image failures have fallbacks.
- [ ] Profession search returns useful workers by profession, skill, location and availability.
- [ ] Employer can create a job, find workers, view proof of work, shortlist/invite/apply.
- [ ] Worker can discover jobs and submit an application.
- [ ] Messaging works for hiring and marketplace transactions.
- [ ] Reviews can only be created from eligible completed transactions.
- [ ] Report/block/moderation path exists for profiles, posts, jobs and listings.
- [ ] Prohibited listing rules and basic marketplace safety rules are published.
- [ ] Privacy Policy, Terms of Service, Community Guidelines and Marketplace Terms are approved and linked in-app.
- [ ] Delete-account flow and data-deletion request path exist.
- [ ] Push/email notifications are rate-limited and have user preferences.
- [ ] Production crash/error monitoring is configured.
- [ ] App Store / Play Store metadata, screenshots, privacy disclosures and age rating are complete.
- [ ] Internal production build has passed a real-device smoke test.

## P1 — launch quality

- [ ] Global profession taxonomy and synonyms support the first launch countries/languages.
- [ ] Profile completion score and onboarding guide users toward useful proof-of-work profiles.
- [ ] Empty states have launch-quality demo/help content.
- [ ] Pricing screen reflects final launch pricing and country/currency rules.
- [ ] Seller earnings and employer usage dashboards match backend values.
- [ ] Analytics track activation, search-to-profile, profile-to-action, apply, booking, checkout and repeat usage.
- [ ] Basic anti-spam / rate limiting exists on posts, outreach and messaging.
- [ ] Accessibility checks completed for primary flows.

## First public release scope

1. Video-first work feed
2. Professional identity + proof of work/projects
3. Global profession / talent search
4. Jobs + applications
5. Services/products/teaching marketplace
6. Orders + verified reputation
7. Messaging
8. WORKIT revenue engine
9. Professional Pro + employer plans (only after payments are production-ready)

## Do not launch real-money payments until

- dedicated WORKIT payments are connected,
- seller payout onboarding is verified,
- refunds/disputes are tested,
- fee/tax presentation is legally reviewed for launch markets.
