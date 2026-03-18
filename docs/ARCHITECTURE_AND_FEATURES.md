# Garaad — Project Architecture & Features

This document describes the full architecture of the Garaad platform (frontend + backend + services) and the purpose of each feature.

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USERS (Browser)                                  │
└─────────────────────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  GARAAD FRONTEND (Next.js 16)                                                │
│  • React 19, App Router, Turbopack (dev)                                    │
│  • Host: e.g. garaad.org / Vercel                                            │
│  • Calls backend via NEXT_PUBLIC_API_URL (e.g. https://api.garaad.org)       │
└─────────────────────────────────────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
┌───────────────────┐   ┌─────────────────────────────────────────────────────┐
│  TELEGRAM VIDEO    │   │  GARAAD BACKEND (Django)                             │
│  BRIDGE (FastAPI)  │   │  • Daphne (ASGI), Django REST, JWT, Channels, Redis │
│  • Video/file      │◄──│  • Host: e.g. api.garaad.org                         │
│    storage via     │   │  • Uses bridge for course video streaming/upload   │
│    Telegram        │   │  • APIs: /api/auth, /api/lms, /api/blog,           │
│  • Stream/download │   │    /api/community, /api/launchpad, /api/payment     │
└───────────────────┘   └─────────────────────────────────────────────────────┘
```

- **Frontend** talks to **Django** over HTTPS using `NEXT_PUBLIC_API_URL` (e.g. `https://api.garaad.org`). No server-side proxy; the browser calls the API directly.
- **Django** uses the **Telegram Video Bridge** for storing and streaming course videos (upload, download with Range support, optional cache). Bridge is a separate FastAPI service (e.g. same host or internal URL).

---

## 2. Frontend (garaad_front)

### 2.1 Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router), React 19 |
| Styling | Tailwind CSS, Radix UI, Framer Motion, Lucide icons |
| State | Zustand (auth, learning, community, admin auth) |
| Data | Axios, SWR, fetch; `API_BASE_URL` from `NEXT_PUBLIC_API_URL` |
| Forms | React Hook Form, Zod, @hookform/resolvers |
| Rich content | TipTap, React Markdown, KaTeX, Shiki, Excalidraw, diagramatics |
| Payments | Stripe (checkout), Waafi (local); Next API routes as webhook handlers |
| Analytics / errors | Vercel Analytics & Speed Insights, PostHog |

### 2.2 App Structure (Routes)

| Route group | Paths | Purpose |
|-------------|--------|---------|
| **Root / auth** | `/`, `/login`, `/verify-email`, `/reset-password`, `/welcome`, `/subscribe` | Landing, sign-in, email verification, password reset, onboarding, newsletter |
| **Site (public)** | `/about`, `/about/abdishakuur-ali`, `/privacy`, `/terms`, `/startups`, `/challenge` | Static/marketing and legal pages |
| **Blog** | `/blog`, `/blog/[slug]`, `/blog/tag/[tag]` | Public blog list, post, tag filter |
| **Courses (LMS)** | `/courses`, `/courses/[categoryId]/[courseSlug]`, `.../lessons/[lessonId]` | Browse categories/courses, view course, take lessons |
| **Launchpad** | `/launchpad`, `/launchpad/[id]`, `/launchpad/submit`, `/launchpad/edit/[id]` | Startup directory, detail, submit, edit |
| **Community** | `/community` | Authenticated community (posts, replies, campuses) |
| **Preview** | `/community-preview`, `/communitypreview` | Public preview of community content |
| **User** | `/dashboard`, `/profile`, `/orders`, `/orders/[id]`, `/referrals` | Student dashboard, profile, orders, referrals |
| **Admin** | `/admin`, `/admin/login`, `/admin/dashboard`, `/admin/blog`, `/admin/blog/new`, `/admin/blog/[slug]/edit`, `/admin/casharada`, `/admin/casharada/cusub`, `/admin/casharada/[id]/qeybaha`, `/admin/koorsooyinka`, `/admin/qaybaha`, `/admin/muuqaalada`, `/admin/sualaha`, `/admin/marketing` | Admin UI: dashboard, blog CRUD, lessons/sections, courses, categories, media, questions, marketing |

### 2.3 Next.js API Routes (Frontend as BFF)

Used for webhooks, server-only secrets, and proxying where needed:

| Area | Path | Purpose |
|------|------|---------|
| Health | `GET /api/health` | Health check |
| Auth | `POST /api/auth/parental-consent` | Parental consent flow |
| Revalidate | `POST /api/revalidate` | On-demand revalidation |
| Notifications | `GET/POST /api/notifications` | Notifications |
| Activity | `POST /api/activity/update` | Activity heartbeat |
| Progress | `/api/progress` | Learning progress |
| Media | `GET /api/media/[...path]` | Media proxy |
| Payment | `POST /api/payment`, `GET /api/payment/success`, `POST /api/payment/webhook/waafi`, `GET/POST /api/payment/orders`, etc. | Payment and orders |
| Stripe | `POST /api/stripe/create-checkout-session`, `POST /api/stripe/webhook`, `GET /api/stripe/success` | Stripe checkout and webhooks |
| Gamification | `GET /api/gamification/status`, `POST /api/gamification/use_energy`, `GET /api/gamification/leaderboard` | Energy, leaderboard |
| League | `GET /api/league/leagues/leaderboard`, `GET /api/league/leagues/status` | League leaderboard/status |
| Community | Campuses, posts, comments, likes, profiles, notifications, push subscriptions | Community BFF/proxy to Django |

### 2.4 State (Zustand)

| Store | Purpose |
|-------|---------|
| **useAuthStore** | User, access/refresh tokens, login/signUp/logout; persisted; uses AuthService |
| **useLearningStore** | Current category/course/lesson, loading/error, answer state (correct, showAnswer, lastAttempt) |
| **useCommunityStore** | Selected category, posts, user profile, notifications, pinned categories |
| **useAdminAuthStore** | Admin token, refreshToken, user; used by admin layout and admin-api |

### 2.5 Key Libs & Services

| Path / area | Purpose |
|-------------|---------|
| `lib/constants.ts` | `API_BASE_URL` from `NEXT_PUBLIC_API_URL` |
| `lib/api.ts` | Singleton API client with cookie auth and token refresh |
| `lib/axiosConfig.ts` | Axios instance for authenticated requests |
| `lib/admin-api.ts` | Admin API client (Bearer from useAdminAuthStore) |
| `lib/blog.ts` / `lib/admin-blog.ts` | Blog and admin blog API helpers |
| `lib/stripe.ts` | Server-only Stripe instance |
| `lib/contentful.ts` | Contentful CMS client (optional) |
| `lib/cloudinary.ts` | Cloudinary URL helpers for images/videos |
| `services/auth.ts` | Auth service (login, signup, refresh, etc.) |
| `services/progress.ts` | Progress, rewards, leaderboard, gamification status |
| `services/activity.ts` | Activity update calls |
| `services/gamification.ts` | Gamification/league/leaderboard APIs |
| `services/lessons.ts` | Lesson fetching |
| `services/pushNotifications.ts` | Push subscription handling |

---

## 3. Backend (garaad_backend)

### 3.1 Stack

| Layer | Technology |
|-------|------------|
| Framework | Django, Daphne (ASGI), Django REST Framework |
| Auth | JWT (Simple JWT), cookies for web |
| Real-time | Django Channels, Redis (channel layer) |
| DB | SQLite (dev) / PostgreSQL (prod via env) |
| Static | WhiteNoise |
| Env | python-dotenv, dj-database-url |

### 3.2 Django Apps and Purpose

| App | Purpose | Main models | API prefix (typical) |
|-----|---------|-------------|------------------------|
| **core** | Middleware (user/session activity), no URLs | — | — |
| **api** | API root, auth, public, admin dashboard, gamification, notifications | (stub) | Various |
| **accounts** | User, onboarding, profile, email verification, password reset, referrals, marketing users | User, UserOnboarding, UserProfile, EmailVerification, PasswordResetToken | `api/auth/`, `api/accounts/` |
| **courses** | LMS: categories, courses, lessons, content blocks, problems, enrollments, progress, video/photo upload | Category, Course, UploadedVideo, UploadedPhoto, Lesson, LessonContentBlock, Problem, UserProgress, CourseEnrollment, UserProblem | `api/lms/` |
| **community** | Posts, replies, reactions, attachments, push subscriptions; campuses/categories | Post, Reply, Reaction, PostAttachment, PushSubscription | `api/community/` |
| **blog** | Blog posts and tags | Tag, BlogPost | `api/blog/` |
| **launchpad** | Startup directory (Product Hunt–style): startups, votes, comments | StartupCategory, Startup, StartupVote, StartupImage, StartupComment | `api/launchpad/` |
| **payment** | Orders, subscription creation, Waafi webhook | Order, OrderItem, PaymentWebhook | `api/payment/` |

### 3.3 Telegram Video Bridge (FastAPI)

| Aspect | Detail |
|--------|--------|
| **Role** | Store and serve course videos (and files) via Telegram (channel); Django does not store large video blobs. |
| **Stack** | FastAPI, Uvicorn; Telegram client; optional in-memory cache (e.g. first 5MB, LRU/TTL). |
| **Endpoints** | Upload, download (streaming, Range, 206), delete. |
| **Config** | Env: TELEGRAM_API_ID, TELEGRAM_API_HASH, TELEGRAM_CHANNEL_ID, API_KEY, HOST, PORT, BASE_URL. |
| **Django** | Uses TELEGRAM_BRIDGE_URL and TELEGRAM_BRIDGE_API_KEY to call the bridge for video URLs and streaming. |

---

## 4. Features and Their Purpose

### 4.1 Authentication & Users

| Feature | Purpose |
|---------|---------|
| **Sign up / Sign in** | Create account, log in; JWT access/refresh; optional email verification. |
| **Email verification** | Verify email via link; resend verification. |
| **Password reset** | Request reset link, set new password. |
| **Profile** | View/edit profile; upload profile picture. |
| **Onboarding** | Guide new users (e.g. welcome flow). |
| **Referrals** | Referral links and referral list. |
| **Parental consent** | Optional parental consent flow (API route on frontend calling backend). |
| **Marketing / campaigns** | Admin: list marketing users, send campaigns (e.g. email). |

### 4.2 Learning (LMS)

| Feature | Purpose |
|---------|---------|
| **Categories** | Group courses (e.g. Full-Stack, AI, Cybersecurity). |
| **Courses** | Course catalog; course detail with modules/lessons. |
| **Lessons** | Lesson viewer with rich content blocks (text, video, code, problems, etc.). |
| **Content blocks** | Video (via Telegram bridge), text, code, images, problems, etc. |
| **Enrollment** | Enroll in courses; track access. |
| **Progress** | Save completion and position; progress APIs for dashboard. |
| **Problems / quizzes** | In-lesson problems; submit answer, see correct/incorrect. |
| **Leaderboard / rewards** | Gamification: leaderboard, rewards, streaks. |
| **Gamification** | Energy, streak, league, leaderboard (backend + frontend API routes). |
| **Admin: casharada / koorsooyinka / qaybaha** | Create/edit lessons, courses, categories (sections, media, questions). |

### 4.3 Blog

| Feature | Purpose |
|---------|---------|
| **Public blog** | List posts, post detail by slug, tag pages. |
| **Admin blog** | Create/edit/delete posts; cover image (e.g. drag-and-drop); meta (og:image, og:title, og:description) for sharing. |
| **Tags** | Tag posts; filter by tag. |

### 4.4 Community

| Feature | Purpose |
|---------|---------|
| **Campuses** | Join/leave campuses; list campuses. |
| **Posts** | Create, list, edit, delete posts; category-scoped. |
| **Replies & reactions** | Comment on posts; like posts/comments. |
| **Profiles & leaderboard** | Community profile; leaderboard. |
| **Notifications** | In-app and push (push subscriptions stored in community app). |
| **Public preview** | Show community content to non-logged-in users (e.g. /community-preview). |

### 4.5 Launchpad (Startups)

| Feature | Purpose |
|---------|---------|
| **Startup directory** | List startups; filter by category. |
| **Startup detail** | Single startup page; vote, comment. |
| **Submit / edit** | Submit new startup; edit own startup. |
| **Votes & comments** | Product Hunt–style voting and comments. |

### 4.6 Payments & Orders

| Feature | Purpose |
|---------|---------|
| **Stripe** | Create checkout session; handle webhook; success page. |
| **Waafi** | Local payment provider; webhook and order handling. |
| **Orders** | List orders, order detail, receipt, download receipt. |
| **Subscription** | Create subscription (e.g. Stripe subscription). |

### 4.7 Admin

| Feature | Purpose |
|---------|---------|
| **Admin auth** | Separate admin login; JWT stored in store. |
| **Dashboard** | Overview (users, courses, revenue, activity). |
| **Blog** | Full CRUD for blog posts and tags. |
| **Casharada / cusub / qeybaha** | Lessons: create new lesson, manage sections (qeybaha). |
| **Koorsooyinka / qaybaha** | Courses and categories. |
| **Muuqaalada / sualaha** | Media and questions. |
| **Marketing** | Marketing users and campaign sending. |

### 4.8 SEO, PWA, and Cross-Cutting

| Feature | Purpose |
|---------|---------|
| **SEO** | Root layout metadata (title, description, OG, Twitter); WebSite + EducationalOrganization JSON-LD; sitemap.xml; robots.txt; canonical. |
| **PWA** | Service worker registration (e.g. PWARegister component). |
| **Version check** | VersionCheck component to prompt reload on new deploy. |
| **Error boundary** | RootErrorBoundary for graceful error handling. |
| **CSP / security headers** | next.config.js headers (CSP, HSTS, X-Frame-Options, etc.). |

---

## 5. Data Flow (Summary)

- **Browser** → **Next.js** (SSR/SSG where used) and **Next.js API routes** (when needed for webhooks or server-only logic).
- **Browser / Next server** → **Django** at `NEXT_PUBLIC_API_URL` for auth, LMS, blog, community, launchpad, payment, gamification.
- **Django** → **Telegram Video Bridge** for video upload/download/streaming; frontend may load video URLs from Django that point to the bridge.
- **Frontend** uses **Zustand** for auth, learning, community, admin state; **Axios/fetch** and **API_BASE_URL** for all backend calls.

---

## 6. Scripts (Backend)

Located in `garaad_backend/scripts/`:

- **Cleanup duplicate lessons** — `manage.py cleanup_duplicate_lessons` (e.g. for a given course/category).
- **AI Literacy lesson** — Build data + `upload_ai_literacy_lesson.py` to create/update the “AI Waa Maxay?” lesson and blocks.
- **Migration / linking** — e.g. `migrate_to_telegram.py`, `link_videos.py` for moving/linking videos (e.g. to Telegram).

Used for one-off or operational tasks, not part of the running app.

---

*Generated for the Garaad codebase. Update this doc when adding new apps, routes, or features.*
