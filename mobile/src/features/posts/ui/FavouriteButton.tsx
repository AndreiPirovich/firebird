import {Pressable, StyleSheet, Text} from 'react-native';

type Props = {
  isFavourite: boolean;
  onPress: () => void;
};

export function FavouriteButton({isFavourite, onPress}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, isFavourite && styles.buttonRemove]}>
      <Text style={styles.label}>
        {isFavourite ? 'Remove from favourite' : 'Add to favourite'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonRemove: {
    backgroundColor: '#f59e0b',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
});
