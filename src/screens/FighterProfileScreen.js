import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme, themes, sharedTheme } from '../context/ThemeContext';

// Static theme for StyleSheet (uses dark theme as base)
const staticTheme = { ...themes.dark, ...sharedTheme };

export default function FighterProfileScreen({ route }) {
  const { theme } = useTheme();
  const { fighter } = route.params || {};

  if (!fighter) {
    return (
      <View style={styles.errorContainer}>
        <Feather name="alert-circle" size={64} color={theme.colors.error} />
        <Text style={styles.errorText}>Fighter not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Fighter Photo */}
      {fighter.photo && (
        <View style={styles.photoContainer}>
          <Image
            source={{ uri: fighter.photo }}
            style={styles.photo}
            resizeMode="cover"
          />
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        {/* Name */}
        <Text style={styles.name}>{fighter.name}</Text>

        {/* Sport Badge */}
        {fighter.sport && (
          <View style={styles.sportBadge}>
            <Text style={styles.sportText}>{fighter.sport}</Text>
          </View>
        )}

        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Information</Text>

          {fighter.nationality && (
            <View style={styles.statRow}>
              <View style={styles.statIcon}>
                <Feather name="flag" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>Nationality</Text>
                <Text style={styles.statValue}>{fighter.nationality}</Text>
              </View>
            </View>
          )}

          {fighter.birthDate && (
            <View style={styles.statRow}>
              <View style={styles.statIcon}>
                <Feather name="calendar" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>Birth Date</Text>
                <Text style={styles.statValue}>{fighter.birthDate}</Text>
              </View>
            </View>
          )}

          {fighter.height && (
            <View style={styles.statRow}>
              <View style={styles.statIcon}>
                <Feather name="arrow-up" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>Height</Text>
                <Text style={styles.statValue}>{fighter.height}</Text>
              </View>
            </View>
          )}

          {fighter.weight && (
            <View style={styles.statRow}>
              <View style={styles.statIcon}>
                <Feather name="activity" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>Weight</Text>
                <Text style={styles.statValue}>{fighter.weight}</Text>
              </View>
            </View>
          )}

          {fighter.team && (
            <View style={styles.statRow}>
              <View style={styles.statIcon}>
                <Feather name="shield" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>Team / Organization</Text>
                <Text style={styles.statValue}>{fighter.team}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Description */}
        {fighter.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{fighter.description}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: staticTheme.colors.background,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: staticTheme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: staticTheme.fontSize.lg,
    color: staticTheme.colors.error,
    marginTop: staticTheme.spacing.md,
  },
  photoContainer: {
    width: '100%',
    height: 400,
    backgroundColor: staticTheme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: staticTheme.spacing.lg,
  },
  name: {
    fontSize: staticTheme.fontSize.xxl * 1.2,
    fontWeight: staticTheme.fontWeight.bold,
    color: staticTheme.colors.text,
    marginBottom: staticTheme.spacing.md,
    textAlign: 'center',
  },
  sportBadge: {
    backgroundColor: staticTheme.colors.primary,
    paddingHorizontal: staticTheme.spacing.lg,
    paddingVertical: staticTheme.spacing.sm,
    borderRadius: staticTheme.borderRadius.md,
    alignSelf: 'center',
    marginBottom: staticTheme.spacing.xl,
  },
  sportText: {
    color: staticTheme.colors.text,
    fontSize: staticTheme.fontSize.md,
    fontWeight: staticTheme.fontWeight.bold,
  },
  section: {
    marginBottom: staticTheme.spacing.xl,
  },
  sectionTitle: {
    fontSize: staticTheme.fontSize.lg,
    fontWeight: staticTheme.fontWeight.bold,
    color: staticTheme.colors.primary,
    marginBottom: staticTheme.spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: staticTheme.colors.card,
    borderRadius: staticTheme.borderRadius.lg,
    padding: staticTheme.spacing.md,
    marginBottom: staticTheme.spacing.sm,
    borderWidth: 1,
    borderColor: staticTheme.colors.border,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: staticTheme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: staticTheme.spacing.md,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: staticTheme.fontSize.sm,
    color: staticTheme.colors.textSecondary,
    marginBottom: 2,
  },
  statValue: {
    fontSize: staticTheme.fontSize.md,
    color: staticTheme.colors.text,
    fontWeight: staticTheme.fontWeight.semibold,
  },
  description: {
    fontSize: staticTheme.fontSize.md,
    color: staticTheme.colors.textSecondary,
    lineHeight: 24,
    textAlign: 'justify',
  },
});
