# WORKIT Interaction Architecture

WORKIT is a real product, not a static mockup. Every visible interactive element must resolve to a route, action, modal, mutation, or authenticated workflow.

## Bottom navigation

- Feed → immersive proof-of-work feed
- Explore → Discover Work / Find Jobs / Find Workers
- Post → create work action (video, hire me, service, product, job, pitch, teach, donate)
- Market → services / products / courses / orders
- Profile → professional identity / portfolio / reputation / employer tools / earnings / settings

## Global header actions

- WORKIT logo → Feed root
- Search icon → global search across people, professions, jobs, projects, services
- Notifications bell → notifications center
- Avatar → own profile
- Overflow menu → context-specific actions such as report, share, save, mute, edit

## Feed

- For You / Following → distinct feed query modes
- Avatar/name → Professional route
- Verified badge → trust/verification explanation
- Like → POST/DELETE like
- Comments → comments sheet/detail
- Share → native share/deep link
- More like this → related work query
- Book/Buy/Learn → MarketDetail route
- Apply → JobDetail route
- Hire/View profile → Professional route
- Project thumbnails → project/work detail

## Explore

- Discover Work → discovery grid/feed
- Find Jobs → jobs search + filters
- Find Workers → talent search + filters
- Search → server-backed query
- Profession/category chips → taxonomy filters
- Location / Skills / Experience / Availability → filter sheets
- Candidate card → Professional route
- Invite → employer invite-to-apply workflow
- Job card → JobDetail route

## Professional profile

- Hire me → hire/request workflow
- Message → open/create conversation then Chat
- Book call → availability/booking workflow
- About → qualifications, certifications, tools, skills, languages, availability
- Portfolio → project/work evidence collection
- Reviews → verified review collection
- Services → seller listings
- Activity → public work activity
- Qualification item → credential detail
- Certification item → credential detail / verification metadata
- Tool item → tool proficiency detail
- Skills → searchable skill tags
- Followers/following → people lists
- Employer Tools → Hiring pipeline
- Earnings → Earnings dashboard
- WORKIT Pro → Pricing/subscription
- Settings → account/privacy/trust/legal

## Market

- Services / Products / Courses → category views
- Listing card → MarketDetail
- Save → wishlist/saved items
- Seller → Professional route
- Book service / Buy now / Learn now → checkout/order flow
- Trending professional → Professional route
- Orders → My Orders workspace

## Messages

- All / Hiring / Orders / Unread → conversation filters
- Search → conversation/person/project search
- Conversation row → Chat
- User avatar → Professional route where applicable
- Hiring context → related job/application
- Order context → related order

## Employer architecture

- My Jobs → employer jobs
- Candidates → application list
- Candidate → Professional route
- New → Reviewed → Shortlisted → Interview → Offer → Hired
- Invite → candidate invitation
- Message → Chat
- Post Job → Job creator

## Required supporting routes

- GlobalSearch
- Notifications
- Professional
- JobDetail
- MarketDetail
- Chat
- Hiring
- Earnings
- Pricing
- Settings
- Legal
- MyApplications
- MyOrders
- Saved
- Comments
- ProjectDetail
- CredentialDetail
- Booking

## Product rule

No primary icon, tab, CTA, card, badge, or action may remain visually clickable without a defined navigation or mutation contract. Any intentionally unavailable launch feature must be disabled and labelled, never presented as a working control.
