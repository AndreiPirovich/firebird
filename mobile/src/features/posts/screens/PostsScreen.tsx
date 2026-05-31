import {useEffect, useMemo} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../../app/navigation/types';
import {selectIsFavourite, selectSortedPosts} from '../model/posts.selectors';
import {usePostsStore} from '../model/posts.store';
import {PostCard} from '../ui/PostCard';

type Props = NativeStackScreenProps<RootStackParamList, 'Posts'>;

export function PostsScreen({navigation}: Props) {
  const posts = usePostsStore(state => state.posts);
  const favouriteIds = usePostsStore(state => state.favouriteIds);
  const isHydrated = usePostsStore(state => state.isHydrated);
  const isPostsLoading = usePostsStore(state => state.isPostsLoading);
  const postsError = usePostsStore(state => state.postsError);
  const loadPostsOnce = usePostsStore(state => state.loadPostsOnce);

  useEffect(() => {
    if (isHydrated) {
      loadPostsOnce();
    }
  }, [isHydrated, loadPostsOnce]);

  const sortedPosts = useMemo(
    () => selectSortedPosts(posts, favouriteIds),
    [posts, favouriteIds],
  );

  if (!isHydrated || (isPostsLoading && posts.length === 0)) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (postsError && posts.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{postsError}</Text>
        <Pressable style={styles.retry} onPress={loadPostsOnce}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={sortedPosts}
      keyExtractor={item => String(item.id)}
      renderItem={({item}) => (
        <PostCard
          post={item}
          isFavourite={selectIsFavourite(favouriteIds, item.id)}
          onPress={() => navigation.navigate('Details', {postId: item.id})}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    backgroundColor: '#f3f4f6',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  error: {
    color: '#b91c1c',
    marginBottom: 12,
    textAlign: 'center',
  },
  retry: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
});
