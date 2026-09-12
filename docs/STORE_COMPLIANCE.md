# WORKIT Store Compliance Gates

## Account deletion
WORKIT supports account creation, so deletion is a P0 release requirement.

Before submission:
- In-app Settings > Account must let the user initiate deletion.
- The flow must not merely deactivate the account; permanent account/data deletion must complete after any legitimate retention checks.
- The UI must clearly state if completion is delayed and what data may be retained for legal/accounting reasons.
- Google Play additionally requires an external public web resource where users can request deletion.
- If Sign in with Apple is added later, associated Apple tokens must be revoked during deletion.

Current WORKIT state:
- In-app deletion request exists.
- Public profile is hidden immediately.
- Database deletion request record exists.
- P0 remaining: permanent purge processor / approved retention rules.
- P0 remaining: public account-deletion web URL.

## Privacy & legal
Before submission:
- Publish Privacy Policy at a stable HTTPS URL.
- Publish Terms of Service at a stable HTTPS URL.
- Publish Community Guidelines and marketplace rules.
- Publish support/contact URL.
- Replace all placeholder legal text with production text reviewed for the target jurisdictions.
- Complete Apple privacy nutrition labels and Google Play Data Safety disclosures from the real production data flows.

## Authentication/security
- Enable Supabase leaked-password protection.
- Production mobile uses publishable key only; never service-role/secret key.
- Production API keeps service-role/database credentials server-side only.
- Confirm account recovery/reset-password flow.

## Notifications
- Remote push must be tested using a development/production build, not Expo Go on Android.
- Configure EAS project ID and platform push credentials.
- Verify notification preferences are honored by backend delivery rules.

## Payments
Payments are not considered live until the dedicated WORKIT payment account is connected, webhooks are idempotent, marketplace seller onboarding/KYC is handled, and refunds/disputes/payouts are tested.

Do not represent a pending WORKIT order as paid until the payment provider confirms success server-side.
