import type {PostListItem} from './posts.types';

export function selectIsFavourite(
  favouriteIds: number[],
  id: number,
): boolean {
  return favouriteIds.includes(id);
}

export function selectSortedPosts(
  posts: PostListItem[],
  favouriteIds: number[],
): PostListItem[] {
  const favRank = new Map(favouriteIds.map((favId, index) => [favId, index]));

  return [...posts].sort((a, b) => {
    const aFav = favRank.has(a.id);
    const bFav = favRank.has(b.id);

    if (aFav && !bFav) {
      return -1;
    }
    if (!aFav && bFav) {
      return 1;
    }
    if (aFav && bFav) {
      return favRank.get(b.id)! - favRank.get(a.id)!;
    }

    return a.id - b.id;
  });
}
