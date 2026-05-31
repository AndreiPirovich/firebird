import {httpGet} from '../../../shared/api/http';
import type {ApiPost} from '../model/posts.types';
import {
  createDetailsImageUrl,
  createPreviewImageUrl,
} from './posts.images';
import type {PostDetails, PostListItem} from '../model/posts.types';

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

export async function fetchPosts(): Promise<ApiPost[]> {
  return httpGet<ApiPost[]>(POSTS_URL);
}

export async function fetchPostById(id: number): Promise<ApiPost> {
  return httpGet<ApiPost>(`${POSTS_URL}/${id}`);
}

export function enrichPostsForList(posts: ApiPost[]): PostListItem[] {
  return posts.map(post => ({
    ...post,
    previewImageUrl: createPreviewImageUrl(),
  }));
}

export async function fetchPostDetails(id: number): Promise<PostDetails> {
  const post = await fetchPostById(id);
  return {
    ...post,
    imageUrl: createDetailsImageUrl(),
  };
}
