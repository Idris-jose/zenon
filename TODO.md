# TODO: Make Payment History Page Functional

## Current Status
- Page uses mock data instead of real DB transactions
- Displays hardcoded balance and account info
- No real filtering or pagination

## Tasks
- [x] Replace mock transactions with real data from DB
- [x] Map DB transaction fields to display format
- [x] Calculate real balance from user accounts
- [x] Display real account information
- [ ] Implement account selection filtering (click on bank to filter transactions)
- [ ] Add real pagination for transactions
- [ ] Implement transaction filters (status, category, date)
- [ ] Add proper error handling for empty states
- [ ] Test with seeded data

## Dependencies
- lib/actions/bank.actions.ts (getUserBankData)
- lib/utils.ts (formatDateTime, getTransactionStatus)
- types/index.d.ts (Transaction type)
