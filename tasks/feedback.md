# Feedback & Progress Log

## Current Issue
Guest Login and Room Creation are failing.
- **Symptoms:** 404 on `/api/auth/sign-in/anonymous`, 401 on `room.create`.
- **Root Cause:** The `auth-client.ts` configuration was missing the `anonymousClient` plugin, meaning the client-side SDK didn't know how to construct the correct request for anonymous sign-in.

## Fix Plan
1.  Update `src/lib/auth-client.ts` to include `anonymousClient`.
2.  Verify Guest Login (should redirect to Lobby with active session).
3.  Verify Room Creation (should redirect to Waiting Room).

## Status
- [x] Fix Auth Client (Added `anonymousClient`)
- [x] Fix Auth Client (Added `anonymousClient`)
- [x] Fix Auth Client (Added `anonymousClient`)
- [x] Fix Database Schema (Added `isAnonymous` field)
- [x] Verify Guest Login (Confirmed via curl 200 OK)
- [ ] Verify Room Creation (Should work now that Auth is fixed)
