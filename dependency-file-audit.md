# Dependency and File Audit

Date: 2026-07-28
Project path: `D:\arcgis\CTM-Thika-Land-Surveyors`

## Executive Summary

The Supabase admin credentials in `.env.local` were present and the service-role key was accepted by Supabase Auth in the previous verification pass.

The main project risks are local dependency setup and an auth-route mismatch:

- `package-lock.json` does not match the app `package.json`, so `npm ci` fails.
- `node_modules` is not installed.
- `scripts/verify-system.js` imports `dotenv`, but `dotenv` is not declared in `package.json`.
- The lint script uses `eslint`, but `eslint` is not declared in `package.json`.
- Supabase Auth is the selected auth path. The conflicting Better Auth catch-all route has been removed.
- The local checkout is not linked to Vercel: `.vercel/project.json` is missing, and `vercel env ls` cannot run without login/token credentials.

## Missing Dependencies

### Definitely Missing

1. `dotenv`
   - Evidence: `scripts/verify-system.js:5` calls `require("dotenv").config(...)`.
   - Current state: `dotenv` is not listed under `dependencies` or `devDependencies` in `package.json`.
   - Impact: `node scripts/verify-system.js` will fail once dependency resolution reaches `dotenv`.
   - Suggested modification: add `dotenv` to `devDependencies`, or remove the dependency and load `.env.local` with a small local parser.

2. `eslint`
   - Evidence: `package.json:9` defines `"lint": "eslint ."`.
   - Current state: `eslint` is not declared in `package.json`.
   - Impact: `npm run lint` will fail unless `eslint` is available globally, which should not be relied on for Vercel/CI.
   - Suggested modification: add `eslint` and the appropriate Next/TypeScript ESLint config packages, or remove/replace the lint script.

### No Longer Needed

3. `better-auth`
   - Decision: Supabase Auth only.
   - Current state: `better-auth` should not be added.
   - Remediation: the conflicting catch-all route `app/api/auth/[...auth]/route.ts` has been removed.

## Dependency Lockfile Problems

1. `package-lock.json` is the wrong lockfile for this app.
   - Evidence: `package-lock.json:2` has `"name": "arcgis"`, while `package.json` has `"name": "my-project"`.
   - Evidence: `package-lock.json` only contains the root package metadata and no app dependencies.
   - Observed result: `npm ci` fails because the lockfile is missing the app dependency tree.
   - Suggested modification: regenerate the lockfile from the app directory with `npm install` after deciding whether to add `dotenv` and `eslint`.

2. `node_modules` is absent.
   - Evidence: `Test-Path node_modules` returned `False`.
   - Impact: build, lint, dev server, and script execution cannot be fully verified locally.
   - Suggested modification: run install after fixing or regenerating the lockfile.

## Missing Files / Directories

1. `.vercel/project.json`
   - Current state: missing.
   - Impact: the repo is not linked to a Vercel project locally, so Vercel env verification cannot identify the target project from this checkout.
   - Suggested modification: run `vercel link`, or provide a Vercel token and project/org context for CLI-based verification.

2. `hooks/`
   - Evidence: `components.json:18` defines the alias `"hooks": "@/hooks"`.
   - Current state: no `hooks` directory is present.
   - Impact: not currently a runtime/build issue unless generated shadcn components or future code import `@/hooks`.
   - Suggested modification: create `hooks/` only if the project will use that alias.

3. Vercel credentials/token
   - Current state: `vercel.cmd env ls` returned "No existing credentials found."
   - Impact: remote Vercel env variables cannot be verified from this machine.
   - Suggested modification: run `vercel login` or provide `VERCEL_TOKEN` for non-interactive verification.

## Files That Need Modification

1. `package.json`
   - Add missing declared dependencies/devDependencies:
     - `dotenv` if keeping `scripts/verify-system.js` as-is.
     - `eslint` and related config if keeping `"lint": "eslint ."`.
   - Optionally add a script for the existing verifier, for example `verify:system`.

2. `package-lock.json`
   - Regenerate after `package.json` is corrected.
   - Current lockfile cannot support `npm ci`.

3. Vercel project config
   - Not a normal hand-edited source file.
   - Needs creation through `vercel link` so `.vercel/project.json` exists locally.

## Completed Remediation

1. Removed `app/api/auth/[...auth]/route.ts`
   - Reason: the project is keeping Supabase Auth only.
   - Remaining auth routes:
     - `app/api/auth/sign-in/route.ts`
     - `app/api/auth/sign-out/route.ts`
     - `app/api/auth/session/route.ts`

## Files / Artifacts To Review Before Commit

These are present locally but ignored by `.gitignore`:

- `.next/`
- `.vscode/`
- `next-env.d.ts`
- `tsconfig.tsbuildinfo`

These are expected local/generated artifacts and should generally not be committed.

`drizzle/meta/_journal.json` is tracked even though `.gitignore` excludes `drizzle/meta/`. Decide whether Drizzle migration metadata should remain tracked. If yes, update `.gitignore`; if no, remove it from Git tracking in a deliberate cleanup commit.

## Verification Status

- Local Supabase env presence: passed.
- Supabase admin auth with service-role key: passed, HTTP 200 from `/auth/v1/admin/users`.
- Vercel env listing: blocked by missing Vercel credentials and missing local project link.
- `npm ci`: failed because `package.json` and `package-lock.json` are out of sync.
- Full TypeScript/build verification: not run because dependencies are not installed and the lockfile is invalid.
