# SaaS Team Project Hub (Amplify Hosting build-fix)

## Why your Amplify build failed
Next.js was type-checking `amplify/**` backend files and couldn't resolve `@aws-amplify/backend`.
This repo fixes it by adding a root `tsconfig.json` that EXCLUDES `amplify/**` from the Next build.

## Deploy
Push to GitHub and connect in Amplify Hosting.

## Local dev
npm install
npm run dev
