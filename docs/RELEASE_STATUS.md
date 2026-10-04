# Release evidence — 2026-10-04

Public launch is NOT approved by this report. Compilation is not device or integration QA.

## Verified in this development session
- Structured offer acceptance remains mandatory in the deployed hiring v7 backend before hiring.
- Mobile typecheck and Android/iOS/web export pass after brand/config changes.
- Expo Doctor passes 21/21 checks after runtime/media fixes.
- Browser preview rendered all four screens; impossible interview/offer dates were rejected and a valid interview slot displayed.
- Runtime dependencies aligned to Expo SDK 57, including React Native 0.86.3 (Hermes regression fix).
- Replaced unmaintained expo-av with expo-video across feed, hiring, profile and marketplace views. Videos pause when screen loses focus or app enters background; playback errors show a readable fallback. Player behavior checked with a mock; physical-device playback remains open.
- Password recovery request/reset screens and cold/warm callback handling are implemented. Source tests cover callback validation, stale restore responses, duplicate requests, password validation and local recovery sign-out. Supabase redirect/SMTP setup and real-device delivery remain unverified.
- Production preflight rejects missing IDs, placeholders, secret mobile keys and unsafe URLs; explicit EAS environments keep build profiles consistent.
- Android QA build #159 succeeded for ba26da079f7313fef52545924d87fb85a0c1387c; published APK digest was sha256:53fa6abde1ca026ecf34e5a0673dd440425e082825c90beb5e5151aa255b8e87. Later source changes require a new build.
- App icon, adaptive foreground, monochrome notification icon and splash are configured.
- EAS project ID is resolved from the build environment and invalid UUIDs fail config generation. Missing ID suppresses push permission prompts; delivery is still unverified.
- Android QA workflow uses Ubuntu 24.04 and Node 24-compatible checkout/setup-node actions. Assets/config changes trigger fresh builds.
- Discovery skill tokenization handles multiword queries.
- `npm run preview:build -- /path/to/current-app-preview.html` produces a visual preview from the actual Login, Explore, ScheduleInterview and SendOffer components with isolated sample services. It never sends applications, messages, offers or credentials.

## Open launch gates
- Current-head native APK build and real Android/iPhone smoke tests, including media, session, deep links, interview response, offer response and verified work.
- EAS project linking and Android/iOS push credentials; delivery and tap routing on physical devices.
- Production backend audit: project reports ACTIVE_HEALTHY and hiring v7 is retrievable, but security-advisor requests returned a hibernation error and database inspection timed out. No clean security audit is claimed.
- Account recovery, production payments/refunds, moderation and account deletion integration evidence.
- Production crash monitoring, final legal/support/deletion URLs and store privacy disclosures.
- Final store screenshots, developer account signing, production build and store review.

The browser preview is for visual review with sample data. It is not a live app or evidence that these gates passed.
