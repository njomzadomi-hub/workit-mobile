# WORKIT Real-Device QA

Run every P0 scenario on at least one current Android device and one current iPhone using a development or production build (not Expo Go for remote push).

## P0 — account & identity
- Fresh install opens Login/Register without crash.
- Register a new account and verify the profile row is created.
- First authenticated session opens premium onboarding.
- Complete onboarding; relaunch app; onboarding does not repeat.
- Edit professional identity: title, bio, location, skills, tools, qualifications, certifications, availability, rate.
- Profile strength updates and saved data survives relaunch.
- Log out and log back in.
- Request account deletion; public profile is hidden immediately and request status is visible.
- Cancel a pending deletion request.

## P0 — discovery & work
- Feed scrolls vertically for 20+ posts without gesture lock or blank frames.
- Like, comments, native share and every primary CTA work.
- Professional card/profile opens from Feed and Explore.
- Global Search returns people, jobs and marketplace results.
- Explore modes switch correctly: Discover Work / Find Jobs / Find Workers.
- Qualifications, certifications, tools and skills are legible on a professional profile.

## P0 — jobs & hiring
- Employer creates a job with video.
- Job appears in Feed and Find Jobs.
- Candidate opens Job Detail and applies with WORKIT profile.
- Application appears under My Applications.
- Employer sees candidate in Hiring pipeline.
- Employer moves candidate New → Reviewed → Shortlisted → Interview → Offer → Hired.
- Employer and candidate can open a 1:1 chat.

## P0 — market & orders
- Professional creates Service, Product and Teach listings.
- Listing appears in Feed and Market.
- Market filters/search work.
- Save/unsave persists across relaunch.
- Listing detail opens from Market, Saved and Feed.
- Buyer can start an order without any false 'paid' state while payments are disabled.
- Order appears in My Orders.
- Order status follows allowed transition graph.
- Completed order allows verified review.

## P0 — messaging & notifications
- New message appears in Inbox with unread state.
- Chat sends/receives on two accounts.
- Notification preference toggles persist.
- Permission prompt is shown only through OS flow.
- Expo push token registers on Android and iOS development/production builds.
- Tapping a message push opens Inbox; other push types open Notifications.
- Foreground notification presentation is readable and not duplicated.

## P0 — safety
- Report post/user/listing creates a moderation report.
- Admin moderation queue receives the report.
- Hidden/deactivated users do not appear in public search.
- No service-role or secret credentials are present in the mobile bundle.

## P1 — UX/polish
- Bottom navigation active state is unmistakable.
- WORKIT wordmark always renders with IT in violet.
- Keyboard never covers primary form actions.
- Small-screen Android and large-screen iPhone layouts do not clip.
- Long names, professions, tools and job titles truncate gracefully.
- Empty/loading/error states are designed and actionable.
- Dark-mode contrast remains readable outdoors and at low brightness.

## Release evidence
Record for each P0: platform, device, OS version, app build number, tester, date, PASS/FAIL, screenshot/video, issue link.

Do not merge or submit to stores with any open P0 failure.
