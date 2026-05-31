# Prompt for AI Agent Implementation

You are a senior React Native engineer. Implement the test task from `[React-Native] Test task.md` as a production-quality React Native CLI app.

## Goal

Create a small mobile app for iOS and Android using:

- React Native `>=0.77`, without Expo
- TypeScript
- React Navigation `>=7`
- FakerJS
- Any mandatory state manager
- Persistent storage

The app must show a list of posts, allow opening a post details screen, and support adding/removing posts from favourites. Favourite posts must be visually highlighted and moved to the top of the list.

## Core Requirements

1. Create a React Native CLI TypeScript project in this repository.
2. Do not use Expo.
3. Use React Navigation 7 with a native stack navigator.
4. Use a real state manager. Prefer `zustand` with `persist` middleware and `@react-native-async-storage/async-storage`.
5. Fetch posts from:
   - `https://jsonplaceholder.typicode.com/posts`
6. Enrich each post in `PostsScreen` with a FakerJS-generated 32x32 image URL.
7. Fetch details from:
   - `https://jsonplaceholder.typicode.com/posts/{id}`
8. Enrich each details response with a FakerJS-generated 300x300 image URL.
9. Generated data must be created only once:
   - the posts list is fetched only if there is no persisted posts list;
   - 32x32 images are generated only when the posts list is first created;
   - each details post is fetched only if details for this `id` are not already persisted;
   - 300x300 details image is generated only once per post.
10. On app restart:
   - do not refetch already persisted posts/details;
   - restore all favourite statuses immediately;
   - keep previously generated image URLs.
11. On `DetailsScreen`, add a dynamic full-width toggle button:
   - if the post is not favourite: `Add to favourite`;
   - if the post is favourite: `Remove from favourite`;
   - tapping toggles the favourite state.
12. On `PostsScreen`:
   - show all posts;
   - favourite posts are shown first;
   - favourite posts are visually highlighted;
   - non-favourite posts remain below;
   - sorting should be stable inside each group.

## UI Requirements

Use the provided screenshots as visual references, but exact design can be custom.

Implement:

- `PostsScreen`
  - navigation title: `PostScreen` or `PostsScreen`
  - vertical scroll/list of cards
  - each card shows title, body preview, 32x32 image
  - each card opens `DetailsScreen`
  - favourite cards have clear visual distinction
- `DetailsScreen`
  - navigation title: `DetailsScreen`
  - back navigation
  - title
  - body
  - 300x300 image
  - bottom/full-width favourite toggle button

Keep UI simple, deterministic, and readable. Avoid overengineering animation or theme systems unless already useful.

## Suggested Architecture

Use a clean feature-based structure:

```text
src/
  app/
    App.tsx
    navigation/
      RootNavigator.tsx
      types.ts
  features/
    posts/
      api/
        postsApi.ts
      model/
        posts.types.ts
        posts.store.ts
        posts.selectors.ts
      screens/
        PostsScreen.tsx
        DetailsScreen.tsx
      ui/
        PostCard.tsx
        FavouriteButton.tsx
  shared/
    api/
      http.ts
    storage/
      asyncStorage.ts
```

It is fine to adjust the structure if React Native CLI generates a slightly different app layout, but keep UI, API, state, and navigation separated.

## Data Model

Use explicit TypeScript types:

```ts
export type ApiPost = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

export type PostListItem = ApiPost & {
  previewImageUrl: string;
};

export type PostDetails = ApiPost & {
  imageUrl: string;
};
```

Recommended store shape:

```ts
type PostsState = {
  posts: PostListItem[];
  detailsById: Record<number, PostDetails>;
  favouriteIds: number[];
  isHydrated: boolean;
  isPostsLoading: boolean;
  postsError: string | null;
  detailsLoadingById: Record<number, boolean>;
  detailsErrorById: Record<number, string | null>;

  loadPostsOnce: () => Promise<void>;
  loadDetailsOnce: (id: number) => Promise<void>;
  toggleFavourite: (id: number) => void;
};
```

Important: if persisted `posts.length > 0`, `loadPostsOnce` must not call the network.

## FakerJS Image Generation

Use `@faker-js/faker`.

Generate and persist URLs, not new images on every render. Create helper functions similar to:

```ts
const createPreviewImageUrl = () =>
  faker.image.urlLoremFlickr({ width: 32, height: 32, category: 'cats' });

const createDetailsImageUrl = () =>
  faker.image.urlLoremFlickr({ width: 300, height: 300, category: 'cats' });
```

If the exact FakerJS API differs in the installed version, inspect the installed types and use the current supported equivalent. Do not hardcode random URLs manually.

## Behaviour Details

- `PostsScreen` should call `loadPostsOnce()` on mount after store hydration.
- `DetailsScreen` should call `loadDetailsOnce(id)` on mount.
- The details screen should be able to render basic post data from the list immediately if details are still loading.
- If details load fails, show a compact error state and retry action.
- If posts load fails, show a compact error state and retry action.
- Do not introduce pull-to-refresh because the requirement says the generated list never updates.
- Use `FlatList` for the posts list.
- Use `Pressable` or `TouchableOpacity` for tappable rows.
- Ensure navigation params are typed.
- Avoid duplicated favourite state in components; derive it from the store.

## Persistence Rules

Persist these values:

- `posts`
- `detailsById`
- `favouriteIds`

Do not persist transient loading/error flags.

Use Zustand `partialize` for this.

## README

Create a `README.md` with:

- project description;
- stack;
- setup command;
- iOS run command;
- Android run command;
- note that the project uses React Native CLI, not Expo;
- note that data is fetched once and persisted.

The reviewer must be able to install with one command and run with a second command.

Example:

```bash
npm install
npm run ios
```

or:

```bash
npm install
npm run android
```

## AI-Only Deliverables

Because the test task requires AI-agent evidence, add:

- `prompts/implementation-prompt.md` with the final prompt used for implementation;
- `.cursorrules` with concise project rules;
- screenshots or exported chat logs if available.

Suggested `.cursorrules` content:

```text
Use React Native CLI, TypeScript, React Navigation 7, Zustand, AsyncStorage, and FakerJS.
Do not use Expo.
Keep UI, API, navigation, and state separated.
Persist generated posts, details, Faker image URLs, and favourite IDs.
Never refetch persisted posts/details unless the persisted data is absent.
Use English comments only when they clarify non-obvious logic.
Do not add comments for self-explanatory code.
```

## Quality Bar

- App builds on iOS and Android.
- TypeScript has no errors.
- No obvious lint errors.
- No unused files, dead code, or fake placeholders.
- Network and persistence logic are deterministic and easy to review.
- State updates are centralized in the store.
- Components are small and focused.
- Avoid unnecessary abstractions.

## Verification Checklist

Before finishing, verify:

- fresh install works;
- app launches;
- `PostsScreen` loads posts from JSONPlaceholder;
- every post has a persisted 32x32 Faker image URL;
- tapping a post opens `DetailsScreen`;
- details are fetched from `/posts/{id}`;
- details have a persisted 300x300 Faker image URL;
- favourite toggle works;
- favourite posts move to the top of `PostsScreen`;
- favourite posts are highlighted;
- restarting the app keeps posts, details images, and favourites;
- app does not refetch posts after persisted data exists;
- README instructions are accurate.

## Final Response Expected From Agent

When implementation is complete, respond with:

- short summary of implemented functionality;
- commands that were run;
- verification result;
- any known limitations.
