# Firebird

React Native test task: posts list, post details, favourites with persistence.

## Stack

- React Native CLI 0.85+ (not Expo)
- TypeScript
- React Navigation 7
- Zustand + AsyncStorage persist
- FakerJS (image URLs generated once and stored)

## Project layout

- `mobile/` — React Native app
- `prompts/` — AI implementation prompt
- `docs/` — task description and UI references (screenshots in repo root)

## Setup & run

```bash
cd mobile && pnpm install
pnpm run ios
```

Android:

```bash
cd mobile && pnpm install
pnpm run android
```

## Behaviour

- Posts are fetched from JSONPlaceholder once; preview images (32×32) are generated via Faker once.
- Details are fetched per post id on first open; detail images (300×300) are generated once.
- Favourites are persisted; favourite posts appear at the top (last favourited first).
- After app restart, persisted data is used without refetching.
