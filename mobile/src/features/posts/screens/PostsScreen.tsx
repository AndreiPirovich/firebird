import { useCallback, useEffect, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  Pressable,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useShallow } from 'zustand/react/shallow';
import type { RootStackParamList } from '../../../app/navigation/types';
import { spacing } from '../../../shared/theme/spacing';
import { errorStyles } from '../../../shared/ui/errorStyles';
import { screenStyles } from '../../../shared/ui/screenStyles';
import { selectSortedPosts } from '../model/posts.selectors';
import { usePostsStore } from '../model/posts.store';
import type { PostListItem } from '../model/posts.types';
import { PostCard } from '../ui/PostCard';

type Props = NativeStackScreenProps<RootStackParamList, 'Posts'>;

export function PostsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  const {
    posts,
    favouriteIds,
    isHydrated,
    hasLoadedPosts,
    isPostsLoading,
    postsError,
    loadPostsOnce,
  } = usePostsStore(
    useShallow(state => ({
      posts: state.posts,
      favouriteIds: state.favouriteIds,
      isHydrated: state.isHydrated,
      hasLoadedPosts: state.hasLoadedPosts,
      isPostsLoading: state.isPostsLoading,
      postsError: state.postsError,
      loadPostsOnce: state.loadPostsOnce,
    })),
  );

  useEffect(() => {
    if (isHydrated && !hasLoadedPosts) {
      loadPostsOnce();
    }
  }, [hasLoadedPosts, isHydrated, loadPostsOnce]);

  const sortedPosts = useMemo(
    () => selectSortedPosts(posts, favouriteIds),
    [posts, favouriteIds],
  );
  const favouriteIdSet = useMemo(() => new Set(favouriteIds), [favouriteIds]);

  const onPressPost = useCallback(
    (postId: number) => {
      navigation.navigate('Details', { postId });
    },
    [navigation],
  );

  const keyExtractor = useCallback((item: PostListItem) => String(item.id), []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<PostListItem>) => (
      <PostCard
        post={item}
        isFavourite={favouriteIdSet.has(item.id)}
        onPressPost={onPressPost}
      />
    ),
    [favouriteIdSet, onPressPost],
  );

  const listContentStyle = useMemo(
    () => [
      screenStyles.listContent,
      {
        paddingTop: insets.top + spacing.lg,
        paddingBottom: insets.bottom + spacing.lg,
      },
    ],
    [insets.top, insets.bottom],
  );

  const centeredStyle = useMemo(
    () => [
      screenStyles.centered,
      { paddingTop: insets.top, paddingBottom: insets.bottom },
    ],
    [insets.top, insets.bottom],
  );

  if (!isHydrated || (isPostsLoading && !hasLoadedPosts)) {
    return (
      <View style={centeredStyle}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (postsError && !hasLoadedPosts) {
    return (
      <View style={centeredStyle}>
        <Text style={errorStyles.text}>{postsError}</Text>
        <Pressable style={errorStyles.retry} onPress={loadPostsOnce}>
          <Text style={errorStyles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={listContentStyle}
      data={sortedPosts}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
    />
  );
}
