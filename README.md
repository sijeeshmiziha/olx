# OLX Clone — React & Firebase Classifieds Marketplace

> Open-source classifieds marketplace for **buying and selling online**. Built with **React** and **Firebase** only — no backend server, no Redux, no custom build. List cars, bikes, electronics, property, and more. Includes **real-time chat**, **OTP authentication**, **admin panel**, advanced search, offers, reviews, and SEO-friendly product pages.

**[Visit live demo](https://olx-sijeesh.web.app)**

[![React 17](https://img.shields.io/badge/React-17.0.2-61dafb?logo=react)](https://reactjs.org/)
[![Firebase 9](https://img.shields.io/badge/Firebase-9.1.x-ffca28?logo=firebase)](https://firebase.google.com/)
[![Node 16](https://img.shields.io/badge/Node-16.x-339933?logo=node.js)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#contributing)


---

## Table of Contents

- [Features](#features)
  - [Marketplace and Ads](#marketplace-and-ads)
  - [Search and Discovery](#search-and-discovery)
  - [Authentication](#authentication)
  - [Real-Time Chat](#real-time-chat)
  - [Offers and Negotiations](#offers-and-negotiations)
  - [Reviews and Ratings](#reviews-and-ratings)
  - [User Profiles and Dashboard](#user-profiles-and-dashboard)
  - [Notifications](#notifications)
  - [Admin Panel](#admin-panel)
  - [SEO Built-In](#seo-built-in)
  - [Security](#security)
  - [Firebase Services](#firebase-services)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Firebase Data Model](#firebase-data-model)
- [Getting Started](#getting-started)
- [Demo & Screenshots](#demo--screenshots)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Features

### Marketplace and Ads

- **Create, edit, delete ads** — Multi-step form with category selection, location, pricing, and delivery options.
- **Rich media** — Up to 12 images per ad; optional video upload (Remote Config–controlled).
- **Ad promotion** — Featured (7 days), Urgent badge (7 days), Top ad (14 days) via promote flow.
- **Price history** — Track and display price changes over time.
- **Ad expiry** — Configurable expiry (e.g. 30 days) via Remote Config.
- **Compare ads** — Side-by-side comparison of up to 3 listings.
- **Marketing score** — Used for home-page recommendations and sorting.
- **Ad analytics** — Views, favorites, shares tracked in Firestore.

### Search and Discovery

- **Advanced filters** — Price range, location, condition, date posted, ad type, delivery, warranty, verified seller.
- **Voice search** — Speech-to-text for search queries.
- **Map view** — Browse ads on a map.
- **Recent searches** — Stored and shown for quick repeat searches.
- **Saved searches** — Persist search queries in Firestore for logged-in users.
- **Trending searches** — Admin-managed trending terms.
- **Sort options** — Newest, price low/high, relevance.
- **Nearby ads** — Geolocation-based listings.
- **Category browsing** — Category pages and category-specific fields.

### Authentication

- **Email/password** — Sign up, sign in, password reset, email verification.
- **Phone OTP** — Sign-in and link phone via reCAPTCHA.
- **Google sign-in** — Popup sign-in and account linking.
- **Email link** — Passwordless sign-in via magic link.
- **Anonymous/guest** — Browse as guest; upgrade to permanent account later.
- **Account management** — Reauthentication for sensitive actions, account deletion, unlink providers.

### Real-Time Chat

- **Firestore-backed conversations** — One conversation per buyer–seller–product.
- **Image attachments** — Send images in chat (Storage rules, 5MB max).
- **Typing indicators** — Real-time typing status.
- **Unread count** — Global unread message count in header.
- **Filters** — Messages list filtered by buying vs selling.

### Offers and Negotiations

- **Make offer** — Send a price offer on an ad.
- **Counter offer** — Seller can counter; buyer can accept or reject.
- **Offer history** — All sent and received offers with status (pending, accepted, rejected).
- **Status tracking** — Real-time offer state via Firestore listeners.

### Reviews and Ratings

- **Seller reviews** — 1–5 star ratings and text (up to 2000 characters).
- **Seller rating display** — Aggregate rating on profile and seller store.
- **Review list** — Public list of reviews per seller.

### User Profiles and Dashboard

- **Dashboard** — My ads, saved ads, settings, account management.
- **Profile** — Avatar upload, edit profile, verification documents, linked accounts (e.g. Google).
- **Followers / following** — Follow users; view followers and following lists.
- **Seller store page** — Public store view for a user’s listings.
- **Watchlist** — Save ads and optional price alerts (Firestore-backed).
- **Favorites / saved ads** — Quick access from dashboard.
- **Transaction history** — Buying and selling tabs with transaction records.
- **Address management** — Add and manage delivery addresses.

### Notifications

- **Real-time in-app notifications** — Firestore listener; notification bell and list.
- **Unread count** — Badge on bell icon.
- **Mark as read / mark all read** — Update read state in Firestore.

### Admin Panel

- **Protected admin routes** — Role-based access; only users with admin role can access.
- **User management** — View and manage users.
- **Ad moderation** — Moderate product status (e.g. approve, reject).
- **Report management** — Handle user reports on ads.
- **Category management** — CRUD for categories.
- **Analytics dashboard** — Overview metrics (user count, ad count, reports).
- **Verification approval** — Review and approve verification requests.
- **Banner management** — Promotional banners (via Firestore/Remote Config).

### SEO Built-In

- **React Helmet** — Dynamic `<title>` and `<meta name="description">` per product page.
- **Open Graph** — `og:title`, `og:description`, `og:image`, `og:url`, `og:type` for sharing.
- **JSON-LD structured data** — Schema.org Product schema (name, description, image, category, price, currency).
- **Breadcrumbs** — Home → Category → Product name on ad view page.
- **Sitemap page** — `/sitemap` for discovery.
- **Sanitization** — Safe meta and JSON-LD content (XSS prevention).

### Security

- **Firestore security rules** — Role-based read/write; admin-only fields; owner/admin checks per collection.
- **Storage rules** — Path-based access; file size (e.g. 5MB) and content-type checks; uid-prefixed paths.
- **CSP headers** — Content-Security-Policy in `public/index.html`.
- **Rate limiting** — Utility for limiting sensitive actions.
- **Input sanitization** — Sanitize user content for meta and structured data.
- **XSS prevention** — SVG and script restrictions in storage and display.

### Firebase Services

- **Firebase Authentication** — All methods above; email verification; account linking.
- **Cloud Firestore** — All app data; offline persistence; real-time listeners for notifications, offers, watchlist, chat.
- **Cloud Storage** — Ad images, chat attachments, profile pictures, verification documents.
- **Firebase Analytics** — Custom events (ad view/create/edit/delete/share, search, offers, chat, auth, favorites, profile).
- **Performance Monitoring** — Custom traces and load time measurement.
- **Remote Config** — Feature flags (e.g. maintenance mode, video upload), dynamic config (max images, ad expiry days), promo banner, min app version.
- **App Check** — reCAPTCHA v3 (optional; requires `REACT_APP_FIREBASE_APP_CHECK_RECAPTCHA_SITE_KEY`).

---

## Tech Stack

The app runs entirely on **React** and **Firebase**. No Express server, no Redux, no custom Webpack.

| Layer | Stack |
|:------|:------|
| **Frontend** | React 17, React Router 5, Context API (Auth, Post, AllPost, Location, Notification, Offer, Watchlist, Chat, Toast). |
| **Backend** | Firebase 9 (compat) — Authentication, Firestore, Storage, Analytics, Performance, Remote Config, App Check. |
| **UI** | Bootstrap 4, custom CSS. Responsive layout; mobile bottom navigation. |
| **SEO** | React Helmet for dynamic meta tags and JSON-LD. |
| **Tooling** | Create React App 4, Prettier, ESLint. Node 16.x. |

### Built With

React · Firebase · Firestore · Firebase Auth · Firebase Storage · Bootstrap · React Router · React Helmet

---

## Firebase Data Model

Key Firestore collections:

| Collection | Purpose |
|:-----------|:--------|
| `users` | User profiles, verification status, role, followers/following counts. |
| `products` | Ads: name, price, description, images, category, location, status, moderation, stats (views, favorites, shares), marketing score. |
| `conversations` | Chat threads; subcollection `messages` for messages. |
| `reports` | User reports on ads (admin read). |
| `categories` | Product categories (admin write). |
| `notifications` | User notifications (real-time). |
| `offers` | Price offers (buyer/seller/admin). |
| `reviews` | Seller reviews and ratings. |
| `savedSearches` | Saved search queries per user. |
| `blockedUsers` | Blocked user references. |
| `priceHistory` | Price change history per product. |
| `adPromotions` | Promotion records (featured, urgent, top). |
| `verifications` | User verification requests (admin update). |
| `userPreferences` | User preferences. |
| `trendingSearches` | Trending search terms (admin write). |
| `activityLog` | Activity logs (admin read). |
| `transactions` | Purchase transactions (buyer/seller/admin). |
| `followers` | Follower/following relationships. |
| `addresses` | User addresses. |
| `banners` | Promotional banners (admin write). |
| `feedback` | User feedback. |

Composite indexes are defined in `firebase/firestore.indexes.json` (25 indexes) for products, conversations, notifications, offers, reviews, transactions, followers, and related queries.

---

## Getting Started

**Prerequisites:** Node.js 16.x (use [.nvmrc](.nvmrc) with `nvm use`), npm, and a [Firebase project](https://console.firebase.google.com/) with **Authentication**, **Firestore**, and **Storage** enabled.

### 1. Clone and install

```bash
git clone https://github.com/sijeeshmiziha/olx.git
cd olx
npm install
```

### 2. Configure Firebase

Copy [.env.example](.env.example) to `.env`. In **Firebase Console → Project settings → General**, add your web app config:

| Variable | Required | Description |
|:---------|:--------:|:------------|
| `REACT_APP_FIREBASE_API_KEY` | Yes | Web API key |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | Yes | Auth domain (e.g. `project.firebaseapp.com`) |
| `REACT_APP_FIREBASE_PROJECT_ID` | Yes | Project ID |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | Yes | Storage bucket |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Yes | Messaging sender ID |
| `REACT_APP_FIREBASE_APP_ID` | Yes | Web app ID |
| `REACT_APP_FIREBASE_MEASUREMENT_ID` | No | Analytics measurement ID |
| `REACT_APP_FIREBASE_APP_CHECK_RECAPTCHA_SITE_KEY` | No | reCAPTCHA v3 site key for App Check |

Do not commit `.env`.

### 3. Run

```bash
npm start
```

Open **http://localhost:3000**

### 4. Deploy Firebase rules and indexes (optional)

If you use your own Firebase project, deploy Firestore rules and indexes:

```bash
npm run deploy:rules    # Firestore rules + Storage rules
npm run deploy:indexes  # Firestore indexes
```

### Available scripts

| Script | Description |
|:------|:------------|
| `npm start` | Start dev server |
| `npm run build` | Production build |
| `npm test` | Run tests |
| `npm run deploy` | Build and full Firebase deploy |
| `npm run deploy:hosting` | Build and deploy only Firebase Hosting |
| `npm run deploy:rules` | Deploy Firestore and Storage rules |
| `npm run deploy:indexes` | Deploy Firestore indexes |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting |

---

## Demo & Screenshots

*See it in action — How to sell using OLX Clone*

https://user-images.githubusercontent.com/91063960/137454308-1ec2e004-7f3b-4bdb-aac1-3a57d114f154.mp4

**Sneak peek**

| Home / Listings | Post detail / View |
|:---------------|:------------------|
| ![OLX Clone home and listings screenshot showing category grid and featured ads](https://user-images.githubusercontent.com/91063960/139376405-043d6cfd-93b3-4486-a07a-2ff3382846d8.png) | ![OLX Clone view post screenshot showing ad details and seller card](https://user-images.githubusercontent.com/91063960/139376440-1dcd424a-6979-4ec7-bfa0-9e9038ddcbd0.png) |

---

## Deployment

1. **Build:** `npm run build` — output is in the `build/` folder.

2. **Firebase Hosting (recommended):**
   - Install Firebase CLI: `npm install -g firebase-tools`
   - Login: `firebase login`
   - Init (if needed): `firebase init hosting` and set `build` as public directory.
   - Deploy: `npm run deploy:hosting` or `firebase deploy --only hosting`
   - Set the same environment variables in Firebase Hosting (e.g. via build config or CI secrets).

3. **Other hosts** — Deploy the `build/` folder to **Vercel**, **Netlify**, or any static host. Configure env vars in the hosting dashboard for production.

---

## Contributing

Contributions are welcome. Open an issue or submit a pull request. Keep code style consistent and run `npm test` before submitting.

---

## License

**MIT.** See [LICENSE](LICENSE) for details.

---

## Contact

Feel free to reach out through the links below.


<a href="https://www.google.com/search?q=sijeesh+miziha" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/-WEB-FF4088?style=for-the-badge&logo=Google&logoColor=white" alt="Web"></a>
<a href="https://www.linkedin.com/in/sijeeshmiziha" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/-LinkedIn-0077B5?style=for-the-badge&logo=LinkedIn&logoColor=white" alt="LinkedIn"></a>
<a href="https://www.instagram.com/sijeeshmiziha" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/-Instagram-E4405F?style=for-the-badge&logo=Instagram&logoColor=white" alt="Instagram"></a>
<a href="https://twitter.com/sijeeshmiziha" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/-Twitter-1DA1F2?style=for-the-badge&logo=Twitter&logoColor=white" alt="Twitter"></a>
<a href="mailto:sijeeshmiziha1@gmail.com" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/-Gmail-D14836?style=for-the-badge&logo=Gmail&logoColor=white" alt="Gmail"></a>
<a href="https://www.youtube.com/c/sijeeshmiziha" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/-YouTube-FF0000?style=for-the-badge&logo=YouTube&logoColor=white" alt="YouTube"></a>
