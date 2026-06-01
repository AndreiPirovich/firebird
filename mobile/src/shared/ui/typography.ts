import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export const typography = StyleSheet.create({
  titleLg: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.md,
    color: colors.textPrimary,
  },
  titleMd: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.xs,
    color: colors.textPrimary,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
  },
  bodySm: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
