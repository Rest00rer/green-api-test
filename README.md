# Green API test task — chat client

A small TypeScript/Vite chat client built as a test task for the Green API service.

## What is demonstrated

- a focused chat workflow in the browser;
- integration with an external messaging API;
- typed client-side state and API boundaries;
- component-based UI structure and a lightweight Vite setup;
- a separate architecture note in [ARCHITECTURE.md](./ARCHITECTURE.md).

## Run locally

Requirements: Node.js 18+.

1. Install dependencies: npm install
2. Copy .env.example to .env.
3. Fill in the Green API instance values locally. Do not commit credentials.
4. Start the dev server: npm run dev

The example environment file contains placeholders only. The repository does not include API keys, tokens or personal data.

## Scope

This repository is a compact demonstration project rather than a production service. The implementation focuses on the requested chat flow and readable structure; production hardening, authentication policy and deployment configuration would be the next steps for a real release.

## Stack

TypeScript · Vite · React · CSS
