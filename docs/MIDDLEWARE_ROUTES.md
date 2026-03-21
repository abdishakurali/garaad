# Middleware & route protection

All app routes and how middleware applies to each.

## Summary

- **Public**: No auth; anyone can access.
- **Protected**: Auth required; unauthenticated users are redirected to `/login` (or `/admin/login` for `/admin/*`) with `?redirect=<current path>` so they can return after signing in.

---

## Public routes (no auth)

| Route | Page |
|-------|------|
| `/` | Home |
| `/courses` | Course listing |
| `/courses/[categoryId]/[courseSlug]` | Course detail |
| `/blog` | Blog listing |
| `/blog/[slug]` | Blog post |
| `/blog/tag/[tag]` | Blog by tag |
| `/challenge` | Challenge |
| `/launchpad` | Launchpad listing |
| `/launchpad/[id]` | Startup detail |
| `/launchpad/project/[slug]` | Project page |
| `/about` | About |
| `/about/abdishakuur-ali` | About (person) |
| `/terms` | Terms |
| `/privacy` | Privacy |
| `/startups` | Startups |
| `/community-preview` | Community preview (public) |
| `/communitypreview` | Community preview (alt) |
| `/login` | User login |
| `/signup` | Redirects to `/welcome` (optional `?redirect=` for post-auth return) |
| `/welcome` | Sign up / welcome |
| `/admin/login` | Admin login |
| `/subscribe` | Subscribe |
| `/verify-email` | Email verification |
| `/reset-password` | Password reset |

---

## Protected routes (auth required)

Unauthenticated users are sent to `/login?reason=unauthenticated&redirect=<pathname>` (or `/admin/login?reason=unauthenticated&redirect=<pathname>` for admin). After login, they are sent back to `redirect` when safe.

### Admin

| Route | Page |
|-------|------|
| `/admin` | Admin dashboard |
| `/admin/dashboard` | Admin dashboard |
| `/admin/koorsooyinka` | Courses admin |
| `/admin/casharada` | Lessons admin |
| `/admin/casharada/cusub` | New lesson |
| `/admin/casharada/[id]/qeybaha` | Edit lesson parts |
| `/admin/blog` | Blog admin |
| `/admin/blog/new` | New post |
| `/admin/blog/[slug]/edit` | Edit post |
| `/admin/marketing` | Marketing |
| `/admin/muuqaalada` | Media |
| `/admin/qaybaha` | Sections |
| `/admin/sualaha` | Questions |

### User app

| Route | Page |
|-------|------|
| `/dashboard` | User dashboard |
| `/profile` | Profile |
| `/settings` | Settings |
| `/orders` | Orders |
| `/orders/[id]` | Order detail |
| `/referrals` | Referrals |
| `/community` | Community (full) |
| `/community/*` | Community sub-routes |

### Launchpad (auth required)

| Route | Page |
|-------|------|
| `/launchpad/submit` | Submit startup |
| `/launchpad/submit-project` | Submit project |
| `/launchpad/edit/[id]` | Edit startup |

### Lessons

| Route | Page |
|-------|------|
| `/courses/[categoryId]/[courseSlug]/lessons/[lessonId]` | Lesson view |

Lesson 2+ and premium content are gated in-app and by the backend; middleware only enforces “logged in.”

---

## Implementation (middleware.ts)

- **protectedRoots**: `/admin`, `/dashboard`, `/profile`, `/settings`, `/orders`, `/referrals`, `/launchpad/submit`, `/launchpad/submit-project`, `/launchpad/edit`.
- **Lesson paths**: any path containing `/lessons/`.
- **Community**: `/community` and `/community/*` (excluding `/community-preview`).
- **Auth pages (always public)**: `/login`, `/welcome`, `/admin/login`.

Anything not in the above protected set is public. Premium-only gating is not done in middleware; it is handled in the app and API.
