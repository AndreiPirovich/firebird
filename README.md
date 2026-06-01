# Firebird

React Native test task: posts list, post details, favourites with persistence.

## Requirements

- Node.js `>= 22.11` (see `.nvmrc`)
- [pnpm](https://pnpm.io/) `10.27.0` (see `packageManager` in `mobile/package.json`)
- For iOS: Xcode, CocoaPods, Ruby (Bundler)

## Stack

- React Native CLI 0.85+ (not Expo)
- TypeScript
- React Navigation 7
- Zustand + AsyncStorage persist
- FakerJS (image URLs generated once and stored)

## Project layout

- `mobile/` — React Native app
- `prompts/` — AI implementation prompt
- `docs/` — edge cases and behaviour notes
- `.cursorrules` — Cursor / AI project rules
- Screenshots and task description in repo root

## Setup & run

```bash
cd mobile && pnpm install
```

Verify the project (typecheck, lint, format, tests):

```bash
cd mobile && pnpm run check
```

iOS (first time also install pods):

```bash
cd mobile/ios && bundle install && bundle exec pod install
cd .. && pnpm run ios
```

Android:

```bash
cd mobile && pnpm run android
```

## Behaviour

- Posts are fetched from JSONPlaceholder once; preview images (32×32) are generated via Faker once.
- Details are fetched per post id on first open; detail images (300×300) are generated once.
- Favourites are persisted; favourite posts appear at the top (last favourited first).
- After app restart, persisted data is used without refetching.

See [docs/edge-cases.md](docs/edge-cases.md) for hydration, race conditions, and known limitations.

## CI

GitHub Actions runs `pnpm run check` in `mobile/` on push and pull requests to `main` (no native build).
