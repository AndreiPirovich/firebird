# Edge Cases And Race Conditions

## Checked Edge Cases

- App starts with empty storage: `PostsScreen` waits for Zustand hydration, then runs `loadPostsOnce()` and persists posts, generated preview image URLs, and `hasLoadedPosts`.
- App starts with persisted posts: `hasLoadedPosts` prevents another `/posts` request, so generated Faker preview URLs stay stable.
- App starts with old persisted data that has `posts` but no `hasLoadedPosts`: store merge derives `hasLoadedPosts` once during hydration to avoid an accidental refetch after the flag was introduced.
- App starts with inconsistent persisted data where `hasLoadedPosts` is true but `posts` is empty: hydration normalizes the flag back to false so the list can recover with a new fetch.
- Opening the same details screen again: `loadDetailsOnce(id)` returns early when `detailsById[id]` exists, so `/posts/{id}` and the 300x300 image URL are not regenerated.
- Opening details with partially persisted data missing the generated image URL: the details fetch is allowed to run again so the persisted record can be repaired.
- Opening details while the request is already in flight: `detailsLoadingById[id]` prevents a duplicate request for the same post id.
- Toggling favourites repeatedly: `toggleFavourite(id)` adds without duplicates and removes by filtering; list ordering remains LIFO for favourite posts.
- Details screen loaded from list data first: title/body can render from the list item while the details image is still loading.
- Failed posts request: `hasLoadedPosts` remains false and the retry button can request posts again.
- Failed details request: `detailsById[id]` remains absent and retry can request details again.

## Race Conditions Covered

- **Hydration vs first fetch:** screens call load actions only after `isHydrated`. The store sets this through `onRehydrateStorage`, which runs as part of Zustand persist hydration.
- **Duplicate posts fetch:** `loadPostsOnce()` checks `hasLoadedPosts` and `isPostsLoading` before starting the network request.
- **Duplicate details fetch:** `loadDetailsOnce(id)` checks both cached details and per-id loading state before starting the request.
- **Persist migration:** the custom `merge` keeps old persisted posts from being refetched just because older storage did not include `hasLoadedPosts`.
- **Corrupt persisted flags:** `hasLoadedPosts` is trusted only when persisted posts are present, which avoids an unrecoverable empty list.
- **Stale closures in list navigation:** `PostsScreen` uses stable `onPressPost`, `keyExtractor`, and `renderItem` callbacks; `PostCard` is memoized.

## Persist / Hydration Flow

1. Zustand creates the store with transient loading/error state set to defaults.
2. `persist` reads `firebird-posts` from AsyncStorage through wrapped `getItem`.
3. Persisted `posts`, `hasLoadedPosts`, `detailsById`, and `favouriteIds` are merged into the current store.
4. `onRehydrateStorage` marks `isHydrated` as true.
5. `PostsScreen` can safely call `loadPostsOnce()`.
6. Runtime loading/error flags are not persisted.

## Known Limitations

- No manual refresh by design: the task requires persisted posts/details not to be refetched once present.
- If AsyncStorage write fails, the app logs the error and continues in memory for the current session.
- If Faker returns an image URL that later becomes unavailable remotely, the stored URL is preserved and not regenerated automatically.
- Details are fetched lazily per opened post, not preloaded for all 100 posts.
