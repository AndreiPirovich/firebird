import {useEffect, useMemo} from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../../app/navigation/types';
import {selectIsFavourite} from '../model/posts.selectors';
import {usePostsStore} from '../model/posts.store';
import {FavouriteButton} from '../ui/FavouriteButton';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

export function DetailsScreen({route}: Props) {
  const postId = route.params.postId;

  const posts = usePostsStore(state => state.posts);
  const detailsById = usePostsStore(state => state.detailsById);
  const favouriteIds = usePostsStore(state => state.favouriteIds);
  const isHydrated = usePostsStore(state => state.isHydrated);
  const detailsLoadingById = usePostsStore(state => state.detailsLoadingById);
  const detailsErrorById = usePostsStore(state => state.detailsErrorById);
  const loadDetailsOnce = usePostsStore(state => state.loadDetailsOnce);
  const toggleFavourite = usePostsStore(state => state.toggleFavourite);

  const listItem = useMemo(
    () => posts.find(post => post.id === postId),
    [posts, postId],
  );

  const details = detailsById[postId];
  const isLoading = detailsLoadingById[postId];
  const error = detailsErrorById[postId];
  const isFavourite = selectIsFavourite(favouriteIds, postId);

  const title = details?.title ?? listItem?.title ?? '';
  const body = details?.body ?? listItem?.body ?? '';
  const imageUrl = details?.imageUrl;

  useEffect(() => {
    if (isHydrated) {
      loadDetailsOnce(postId);
    }
  }, [isHydrated, loadDetailsOnce, postId]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>

      {imageUrl ? (
        <Image source={{uri: imageUrl}} style={styles.image} />
      ) : isLoading ? (
        <View style={styles.imagePlaceholder}>
          <ActivityIndicator />
        </View>
      ) : null}

      {error && !details ? (
        <View style={styles.errorBlock}>
          <Text style={styles.error}>{error}</Text>
          <Pressable
            style={styles.retry}
            onPress={() => loadDetailsOnce(postId)}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : null}

      <FavouriteButton
        isFavourite={isFavourite}
        onPress={() => toggleFavourite(postId)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f3f4f6',
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 16,
  },
  image: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
  imagePlaceholder: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
  },
  errorBlock: {
    marginTop: 12,
    alignItems: 'center',
  },
  error: {
    color: '#b91c1c',
    marginBottom: 8,
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
