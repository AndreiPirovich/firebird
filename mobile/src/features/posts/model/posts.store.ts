import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  enrichPostsForList,
  fetchPostDetails,
  fetchPosts,
} from '../api/postsApi';
import type { PostDetails, PostListItem } from './posts.types';
import { storage } from '../../../shared/storage/asyncStorage';

type PostsState = {
  posts: PostListItem[];
  hasLoadedPosts: boolean;
  detailsById: Record<number, PostDetails>;
  favouriteIds: number[];
  isHydrated: boolean;
  isPostsLoading: boolean;
  postsError: string | null;
  detailsLoadingById: Record<number, boolean>;
  detailsErrorById: Record<number, string | null>;

  setHydrated: () => void;
  loadPostsOnce: () => Promise<void>;
  loadDetailsOnce: (id: number) => Promise<void>;
  toggleFavourite: (id: number) => void;
};

type PersistedPostsState = Partial<
  Pick<PostsState, 'posts' | 'hasLoadedPosts' | 'detailsById' | 'favouriteIds'>
>;

export const usePostsStore = create<PostsState>()(
  persist(
    (set, get) => ({
      posts: [],
      hasLoadedPosts: false,
      detailsById: {},
      favouriteIds: [],
      isHydrated: false,
      isPostsLoading: false,
      postsError: null,
      detailsLoadingById: {},
      detailsErrorById: {},

      setHydrated: () => set({ isHydrated: true }),

      loadPostsOnce: async () => {
        const { hasLoadedPosts, isPostsLoading } = get();
        if (hasLoadedPosts || isPostsLoading) {
          return;
        }

        set({ isPostsLoading: true, postsError: null });

        try {
          const apiPosts = await fetchPosts();
          set({
            posts: enrichPostsForList(apiPosts),
            hasLoadedPosts: true,
            isPostsLoading: false,
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Failed to load posts';
          set({ postsError: message, isPostsLoading: false });
        }
      },

      loadDetailsOnce: async (id: number) => {
        const { detailsById, detailsLoadingById } = get();
        const existingDetails = detailsById[id];
        if (
          (existingDetails?.imageUrl && existingDetails.body) ||
          detailsLoadingById[id]
        ) {
          return;
        }

        set(state => ({
          detailsLoadingById: { ...state.detailsLoadingById, [id]: true },
          detailsErrorById: { ...state.detailsErrorById, [id]: null },
        }));

        try {
          const details = await fetchPostDetails(id);
          set(state => ({
            detailsById: { ...state.detailsById, [id]: details },
            detailsLoadingById: { ...state.detailsLoadingById, [id]: false },
          }));
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Failed to load details';
          set(state => ({
            detailsErrorById: { ...state.detailsErrorById, [id]: message },
            detailsLoadingById: { ...state.detailsLoadingById, [id]: false },
          }));
        }
      },

      toggleFavourite: (id: number) => {
        set(state => {
          const exists = state.favouriteIds.includes(id);
          return {
            favouriteIds: exists
              ? state.favouriteIds.filter(favId => favId !== id)
              : [...state.favouriteIds, id],
          };
        });
      },
    }),
    {
      name: 'firebird-posts',
      storage: createJSONStorage(() => storage),
      partialize: state => ({
        posts: state.posts,
        hasLoadedPosts: state.hasLoadedPosts,
        detailsById: state.detailsById,
        favouriteIds: state.favouriteIds,
      }),
      merge: (persistedState, currentState) => {
        const persisted = (persistedState ?? {}) as PersistedPostsState;
        const hasPersistedPosts = Boolean(persisted.posts?.length);

        return {
          ...currentState,
          ...persisted,
          hasLoadedPosts:
            (persisted.hasLoadedPosts ?? hasPersistedPosts) &&
            hasPersistedPosts,
        };
      },
      onRehydrateStorage: () => state => {
        state?.setHydrated();
      },
    },
  ),
);
