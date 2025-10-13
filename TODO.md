# TODO: Fix Signup Link Account Issue

- [x] Update `lib/actions/user.actions.ts`: Modify `signUp` to throw errors instead of silent catch for better error handling.
- [x] Update `components/AuthForm.tsx`: Add `error` state, display errors in UI, and add placeholder content in the link account div (e.g., a button to "Link Bank Account" that redirects to `/my-banks`).
- [ ] Test: Run the app, attempt signup, verify that on success the link account UI shows, on failure an error is displayed.
