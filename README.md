# MindWell

MindWell is a student-focused conversational wellness companion. It gives students a supportive place to check in, talk through difficult moments, and reflect on their mood over time.

MindWell is designed for everyday emotional support. It is not a diagnostic tool, a substitute for therapy, or an emergency service.

## Features

- **Conversational support** for working through stress, worries, and difficult experiences.
- **Mood check-ins** that help users record how they are feeling
- **Mood history and visualisation** to help users notice patterns over time
- **Account-based access** so each user has their own conversations and mood records
- **SOS support** with emergency guidance and crisis-support contacts
- A responsive interface designed for use on mobile and desktop devices

## Screenshots

Screenshots can be added here as the interface is finalised.

## Technology

- [Nuxt](https://nuxt.com/) and [Vue](https://vuejs.org/)
- TypeScript
- Tailwind CSS
- Firebase Authentication
- Cloud Firestore
- Firebase Cloud Functions
- Chart.js

## Getting started

### Requirements

- Node.js 22 or later
- npm
- Access to a Firebase project configured for the application

### Install

Install the web application dependencies from the repository root:

```bash
npm install
```

The conversational backend has its own dependencies:

```bash
cd functions
npm install
cd ..
```

### Configure the application

Create a `.env` file in the repository root using the Firebase web configuration for your development project:

```dotenv
NUXT_PUBLIC_FIREBASE_API_KEY=...
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NUXT_PUBLIC_FIREBASE_PROJECT_ID=...
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NUXT_PUBLIC_FIREBASE_APP_ID=...
NUXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY=...
```

Do not commit `.env` files, API keys, service-account files, tokens, or other credentials. Use separate Firebase projects and credentials for development and production.

### Run the web app

```bash
npm run dev
```

Open [http://localhost:8383](http://localhost:8383). The development port is configured in the `dev` script in `package.json`.

To create and preview a production build:

```bash
npm run build
npm run preview
```

### Build the backend

From the repository root:

```bash
cd functions
npm run build
```

The backend requires its own provider configuration before it can handle production conversations. Keep those values in your deployment environment rather than adding them to this repository.

## Project structure

```text
app/                 Nuxt pages, components, layouts, composables, and assets
functions/src/       Firebase backend source
server/api/          Nuxt server endpoints
public/              Static public assets
firestore.rules      Firestore security rules
firebase.json        Firebase project configuration
```

## Safety and privacy

MindWell is an AI-powered conversational wellness companion. It can offer reflection and supportive conversation, but it cannot provide clinical diagnosis, psychotherapy, or guaranteed emergency intervention.

Please do not share passwords, financial information, identity documents, or other sensitive information that is not necessary for a conversation. Information entered into MindWell may be processed by the services required to operate the application.

If you or someone else is in immediate danger, contact local emergency services or a crisis helpline immediately. The SOS page in the application provides the support contacts currently configured for the project.

## Project status

MindWell is an active project under development. Features, support contacts, and service integrations may change as the product is tested and improved.
