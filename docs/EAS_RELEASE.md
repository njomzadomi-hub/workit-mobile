# WORKIT Mobile EAS Release Runbook

## Required production environment

```text
EXPO_PUBLIC_SUPABASE_URL=https://<workit-project-ref>.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<WORKIT publishable key>
EXPO_PUBLIC_API_URL=https://<production-api-domain>/v1
EXPO_PUBLIC_EAS_PROJECT_ID=<EAS project ID>
```

Only publishable/mobile-safe values may use the `EXPO_PUBLIC_` prefix.

## Before creating device builds
1. Production API `/v1/health` is green.
2. Production API secrets are configured server-side.
3. Supabase leaked-password protection is enabled.
4. EAS project is linked to the WORKIT app.
5. Android and iOS push credentials are configured in EAS.
6. App Store/Play identifiers remain `app.workit.mobile` unless the final company bundle decision changes before first submission.
7. Privacy/Terms/Support/Delete Account HTTPS URLs are finalized.

## Development QA build
Create Android and iOS development builds using the `development` EAS profile. Remote push must be tested in a development/production build, not Expo Go.

Run every P0 case in `docs/REAL_DEVICE_QA.md` on a current Android phone and iPhone.

## Preview build
Use the `preview` profile for internal stakeholder review after P0 functional QA is green.

## Production build
Use the `production` profile only after:
- all P0 real-device cases pass;
- production API and Supabase are stable;
- legal/store URLs are public;
- account deletion is end-to-end verified;
- push notifications are verified on both platforms;
- no mobile secrets are bundled;
- app icon/splash/screenshots are final.

## Store submission
The production submit profile exists but submission should remain manual/explicit until store metadata, privacy disclosures, screenshots and legal URLs are reviewed.

Do not merge the launch feature branch or submit to stores solely because CI passes. CI validates compilation/bundling; device and service integration QA remain required.
