import {StyleSheet} from 'react-native';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';

export const errorStyles = StyleSheet.create({
  text: {
    color: colors.error,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  retry: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: spacing.sm,
  },
  retryText: {
    color: colors.primaryText,
    fontWeight: '600',
  },
  block: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
});
