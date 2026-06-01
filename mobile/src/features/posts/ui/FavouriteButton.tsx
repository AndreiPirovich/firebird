import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';

type Props = {
  isFavourite: boolean;
  onPress: () => void;
};

export function FavouriteButton({ isFavourite, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, isFavourite && styles.buttonRemove]}
    >
      <Text style={styles.label}>
        {isFavourite ? 'Remove from favourite' : 'Add to favourite'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.favouriteAdd,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  buttonRemove: {
    backgroundColor: colors.favouriteRemove,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
