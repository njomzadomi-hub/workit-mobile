# WORKIT Mobile EAS Release Runbook

## Required production environment

```text
EXPO_PUBLIC_SUPABASE_URL=https://<workit-project-ref>.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<WORKIT publishable key>
# Optional override, otherwise the WORKIT Supabase Edge API is used
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

## Production configuration preflight

Run `npm run release:check` with the WORKIT production environment loaded. EAS production also runs this validation from app.config.js, using the production profile flag on the local CLI and the build worker. Development and preview builds select their own EAS environments explicitly.

Missing/placeholder configuration, secret/service-role mobile keys, non-HTTPS production URLs and missing/invalid EAS project IDs fail the build. The configured ID must match the EAS worker project ID when present. These checks validate shape and consistency; account ownership, API health, signing and push delivery still require verification.

## Password recovery setup

1. In WORKIT Supabase Auth URL Configuration, allow the exact additional redirect `workit://reset-password`. This dashboard configuration is still unverified.
2. Confirm a WORKIT SMTP sender can deliver recovery mail to launch users. No live reset emails were sent by the automated source tests.
3. Use the standard reset email confirmation URL so Supabase verifies the recovery request and redirects to the app with recovery session parameters. The current mobile client uses Supabase's implicit session flow. Changing to PKCE requires a code-exchange callback implementation before enabling it.
4. Test a real registered QA account on both phones. Open the reset link with the app closed and already open; verify expired/malformed links cannot show an editable reset form.
5. Save a new password, close the recovery session, and log in with the new password. Verify a failed request is retryable and notifications do not open protected screens during recovery.

No auth allowlist, SMTP settings or password-protection policy was changed by this code update. Universal links can be configured when the final WORKIT domain and platform association files are available.
