import {useCallback, useEffect, useMemo} from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useShallow} from 'zustand/react/shallow';
import type {RootStackParamList} from '../../../app/navigation/types';
import {colors} from '../../../shared/theme/colors';
import {spacing} from '../../../shared/theme/spacing';
import {errorStyles} from '../../../shared/ui/errorStyles';
import {screenStyles} from '../../../shared/ui/screenStyles';
import {typography} from '../../../shared/ui/typography';
import {selectIsFavourite} from '../model/posts.selectors';
import {usePostsStore} from '../model/posts.store';
import {FavouriteButton} from '../ui/FavouriteButton';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

export function DetailsScreen({route}: Props) {
  const postId = route.params.postId;
  const insets = useSafeAreaInsets();

  const {
    posts,
    detailsById,
    favouriteIds,
    isHydrated,
    detailsLoadingById,
    detailsErrorById,
    loadDetailsOnce,
    toggleFavourite,
  } = usePostsStore(
    useShallow(state => ({
      posts: state.posts,
      detailsById: state.detailsById,
      favouriteIds: state.favouriteIds,
      isHydrated: state.isHydrated,
      detailsLoadingById: state.detailsLoadingById,
      detailsErrorById: state.detailsErrorById,
      loadDetailsOnce: state.loadDetailsOnce,
      toggleFavourite: state.toggleFavourite,
    })),
  );

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

  const handleToggleFavourite = useCallback(() => {
    toggleFavourite(postId);
  }, [toggleFavourite, postId]);

  const handleRetry = useCallback(() => {
    loadDetailsOnce(postId);
  }, [loadDetailsOnce, postId]);

  const containerStyle = useMemo(
    () => [
      styles.container,
      screenStyles.screenBackground,
      {
        paddingTop: insets.top + spacing.lg,
        paddingBottom: insets.bottom + spacing.lg,
      },
    ],
    [insets.top, insets.bottom],
  );

  return (
    <ScrollView contentContainerStyle={containerStyle}>
      <Text style={typography.titleLg}>{title}</Text>
      <Text style={[typography.body, styles.bodySpacing]}>{body}</Text>

      {imageUrl ? (
        <Image source={{uri: imageUrl}} style={styles.image} />
      ) : isLoading ? (
        <View style={styles.imagePlaceholder}>
          <ActivityIndicator />
        </View>
      ) : null}

      {error && !details ? (
        <View style={errorStyles.block}>
          <Text style={errorStyles.text}>{error}</Text>
          <Pressable style={errorStyles.retry} onPress={handleRetry}>
            <Text style={errorStyles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : null}

      <FavouriteButton
        isFavourite={isFavourite}
        onPress={handleToggleFavourite}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    flexGrow: 1,
  },
  bodySpacing: {
    marginBottom: spacing.lg,
  },
  image: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    borderRadius: spacing.sm,
    backgroundColor: colors.imagePlaceholder,
  },
  imagePlaceholder: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.imagePlaceholder,
    borderRadius: spacing.sm,
  },
});
