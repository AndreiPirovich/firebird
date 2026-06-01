import {memo, useCallback} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {colors} from '../../../shared/theme/colors';
import {spacing} from '../../../shared/theme/spacing';
import {typography} from '../../../shared/ui/typography';
import type {PostListItem} from '../model/posts.types';

type Props = {
  post: PostListItem;
  isFavourite: boolean;
  onPressPost: (postId: number) => void;
};

function PostCardComponent({post, isFavourite, onPressPost}: Props) {
  const handlePress = useCallback(() => {
    onPressPost(post.id);
  }, [onPressPost, post.id]);

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.card, isFavourite && styles.cardFavourite]}>
      <View style={styles.textBlock}>
        <Text style={typography.titleMd} numberOfLines={2}>
          {post.title}
        </Text>
        <Text style={typography.bodySm} numberOfLines={4}>
          {post.body}
        </Text>
      </View>
      <Image source={{uri: post.previewImageUrl}} style={styles.thumbnail} />
    </Pressable>
  );
}

export const PostCard = memo(PostCardComponent);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.sm,
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    gap: spacing.md,
  },
  cardFavourite: {
    backgroundColor: colors.favouriteBackground,
    borderColor: colors.favouriteBorder,
  },
  textBlock: {
    flex: 1,
  },
  thumbnail: {
    width: 32,
    height: 32,
    borderRadius: spacing.xs,
    backgroundColor: colors.imagePlaceholder,
  },
});
