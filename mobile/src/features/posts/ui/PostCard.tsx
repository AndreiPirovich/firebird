import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type {PostListItem} from '../model/posts.types';

type Props = {
  post: PostListItem;
  isFavourite: boolean;
  onPress: () => void;
};

export function PostCard({post, isFavourite, onPress}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, isFavourite && styles.cardFavourite]}>
      <View style={styles.textBlock}>
        <Text style={styles.title} numberOfLines={2}>
          {post.title}
        </Text>
        <Text style={styles.body} numberOfLines={4}>
          {post.body}
        </Text>
      </View>
      <Image source={{uri: post.previewImageUrl}} style={styles.thumbnail} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    gap: 12,
  },
  cardFavourite: {
    backgroundColor: '#ecfdf5',
    borderColor: '#10b981',
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    color: '#111',
  },
  body: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  thumbnail: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
  },
});
