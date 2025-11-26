import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavourite, selectIsFavourite } from '../redux/slices/favouritesSlice';
import { useTheme, themes, sharedTheme } from '../context/ThemeContext';

// Static theme for StyleSheet (uses dark theme as base)
const staticTheme = { ...themes.dark, ...sharedTheme };

export default function DetailsScreen({ route }) {
  const { theme } = useTheme();
  const { fight } = route.params || {};
  const dispatch = useDispatch();
  const isFavourite = useSelector(selectIsFavourite(fight?.id));

  if (!fight) {
    return (
      <View style={styles.errorContainer}>
        <Feather name="alert-circle" size={64} color={theme.colors.error} />
        <Text style={styles.errorText}>Fight not found</Text>
      </View>
    );
  }

  const handleToggleFavourite = () => {
    dispatch(toggleFavourite(fight));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Fight Poster */}
      <View style={styles.posterContainer}>
        <Image
          source={{ uri: fight.poster || fight.thumbnail }}
          style={styles.poster}
          resizeMode="cover"
        />
        
        {/* Favourite Button Overlay */}
        <TouchableOpacity
          style={styles.favouriteButton}
          onPress={handleToggleFavourite}
          activeOpacity={0.8}
        >
          <Feather
            name={isFavourite ? 'heart' : 'heart'}
            size={28}
            color={isFavourite ? theme.colors.primary : theme.colors.text}
            style={{ fontWeight: isFavourite ? 'bold' : 'normal' }}
          />
        </TouchableOpacity>

        {/* Sport Badge */}
        <View style={styles.sportBadgeOverlay}>
          <Text style={styles.sportBadgeText}>{fight.sport}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>{fight.title}</Text>
        
        {/* Headline */}
        {fight.headline && fight.headline !== fight.title && (
          <Text style={styles.headline}>{fight.headline}</Text>
        )}

        {/* Fighters Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Main Event</Text>
          <View style={styles.fightersContainer}>
            <View style={styles.fighterBox}>
              <Text style={styles.fighterName}>{fight.fighter1}</Text>
              {fight.homeScore !== null && (
                <Text style={styles.score}>{fight.homeScore}</Text>
              )}
            </View>
            
            <View style={styles.vsContainer}>
              <Text style={styles.vsText}>VS</Text>
            </View>
            
            <View style={styles.fighterBox}>
              <Text style={styles.fighterName}>{fight.fighter2}</Text>
              {fight.awayScore !== null && (
                <Text style={styles.score}>{fight.awayScore}</Text>
              )}
            </View>
          </View>

          {/* Fight Results - Parse and format the fight card */}
          {fight.winner && fight.winner.length > 50 && (
            <View style={styles.fightResultsSection}>
              <Text style={styles.fightResultsTitle}>Fight Results</Text>
              <ScrollView style={styles.fightResultsScroll} nestedScrollEnabled>
                <Text style={styles.fightResultsText}>{fight.winner}</Text>
              </ScrollView>
            </View>
          )}

          {/* Simple Winner Display */}
          {fight.winner && fight.winner.length < 50 && !fight.winner.includes('def.') && (
            <View style={styles.winnerBadge}>
              <Feather name="award" size={16} color={theme.colors.accent} />
              <Text style={styles.winnerText}>Winner: {fight.winner}</Text>
            </View>
          )}
        </View>

        {/* Event Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Event Details</Text>
          
          <View style={styles.detailRow}>
            <Feather name="calendar" size={20} color={theme.colors.primary} />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{fight.date}</Text>
            </View>
          </View>

          {fight.time && (
            <View style={styles.detailRow}>
              <Feather name="clock" size={20} color={theme.colors.primary} />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Time</Text>
                <Text style={styles.detailValue}>{fight.time}</Text>
              </View>
            </View>
          )}

          <View style={styles.detailRow}>
            <Feather name="map-pin" size={20} color={theme.colors.primary} />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Venue</Text>
              <Text style={styles.detailValue}>{fight.venue}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Feather name="globe" size={20} color={theme.colors.primary} />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{fight.city}, {fight.country}</Text>
            </View>
          </View>

          {fight.league && (
            <View style={styles.detailRow}>
              <Feather name="award" size={20} color={theme.colors.primary} />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>League</Text>
                <Text style={styles.detailValue}>{fight.league}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Description */}
        {fight.description && fight.description.length < 200 && !fight.description.includes('def.') && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{fight.description}</Text>
          </View>
        )}

        {/* Status Badge */}
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: fight.status === 'Upcoming' ? theme.colors.success : theme.colors.textSecondary }
          ]}>
            <Text style={styles.statusText}>{fight.status}</Text>
          </View>
        </View>
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
  posterContainer: {
    width: '100%',
    height: 400,
    position: 'relative',
  },
  poster: {
    width: '100%',
    height: '100%',
    backgroundColor: staticTheme.colors.border,
  },
  favouriteButton: {
    position: 'absolute',
    top: staticTheme.spacing.md,
    right: staticTheme.spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: staticTheme.colors.text,
  },
  sportBadgeOverlay: {
    position: 'absolute',
    top: staticTheme.spacing.md,
    left: staticTheme.spacing.md,
    backgroundColor: staticTheme.colors.primary,
    paddingHorizontal: staticTheme.spacing.md,
    paddingVertical: staticTheme.spacing.sm,
    borderRadius: staticTheme.borderRadius.md,
  },
  sportBadgeText: {
    color: staticTheme.colors.text,
    fontSize: staticTheme.fontSize.md,
    fontWeight: staticTheme.fontWeight.bold,
  },
  content: {
    padding: staticTheme.spacing.lg,
  },
  title: {
    fontSize: staticTheme.fontSize.xxl,
    fontWeight: staticTheme.fontWeight.bold,
    color: staticTheme.colors.text,
    marginBottom: staticTheme.spacing.sm,
  },
  headline: {
    fontSize: staticTheme.fontSize.lg,
    color: staticTheme.colors.accent,
    marginBottom: staticTheme.spacing.lg,
    fontWeight: staticTheme.fontWeight.semibold,
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
  fightersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: staticTheme.colors.card,
    borderRadius: staticTheme.borderRadius.lg,
    padding: staticTheme.spacing.md,
    borderWidth: 1,
    borderColor: staticTheme.colors.border,
  },
  fighterBox: {
    flex: 1,
    alignItems: 'center',
  },
  fighterName: {
    fontSize: staticTheme.fontSize.lg,
    fontWeight: staticTheme.fontWeight.bold,
    color: staticTheme.colors.text,
    textAlign: 'center',
  },
  score: {
    fontSize: staticTheme.fontSize.xl,
    fontWeight: staticTheme.fontWeight.bold,
    color: staticTheme.colors.accent,
    marginTop: staticTheme.spacing.xs,
  },
  vsContainer: {
    backgroundColor: staticTheme.colors.primary,
    paddingHorizontal: staticTheme.spacing.md,
    paddingVertical: staticTheme.spacing.sm,
    borderRadius: staticTheme.borderRadius.md,
    marginHorizontal: staticTheme.spacing.sm,
  },
  vsText: {
    fontSize: staticTheme.fontSize.md,
    fontWeight: staticTheme.fontWeight.bold,
    color: staticTheme.colors.text,
  },
  winnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: staticTheme.colors.card,
    borderRadius: staticTheme.borderRadius.md,
    padding: staticTheme.spacing.sm,
    marginTop: staticTheme.spacing.sm,
    borderWidth: 1,
    borderColor: staticTheme.colors.accent,
  },
  winnerText: {
    fontSize: staticTheme.fontSize.md,
    color: staticTheme.colors.accent,
    marginLeft: staticTheme.spacing.xs,
    fontWeight: staticTheme.fontWeight.semibold,
  },
  fightResultsSection: {
    marginTop: staticTheme.spacing.md,
    backgroundColor: staticTheme.colors.card,
    borderRadius: staticTheme.borderRadius.md,
    padding: staticTheme.spacing.md,
    borderWidth: 1,
    borderColor: staticTheme.colors.accent,
  },
  fightResultsTitle: {
    fontSize: staticTheme.fontSize.lg,
    fontWeight: staticTheme.fontWeight.bold,
    color: staticTheme.colors.accent,
    marginBottom: staticTheme.spacing.sm,
  },
  fightResultsScroll: {
    maxHeight: 300,
  },
  fightResultsText: {
    fontSize: staticTheme.fontSize.sm,
    color: staticTheme.colors.accent,
    lineHeight: 22,
    fontFamily: 'monospace',
  },
  resultBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: staticTheme.colors.card,
    borderRadius: staticTheme.borderRadius.md,
    padding: staticTheme.spacing.md,
    marginTop: staticTheme.spacing.sm,
    borderWidth: 1,
    borderColor: staticTheme.colors.primary,
  },
  resultText: {
    fontSize: staticTheme.fontSize.md,
    fontWeight: staticTheme.fontWeight.semibold,
    color: staticTheme.colors.primary,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: staticTheme.spacing.md,
  },
  detailTextContainer: {
    marginLeft: staticTheme.spacing.md,
    flex: 1,
  },
  detailLabel: {
    fontSize: staticTheme.fontSize.sm,
    color: staticTheme.colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: staticTheme.fontSize.md,
    color: staticTheme.colors.text,
    fontWeight: staticTheme.fontWeight.medium,
  },
  description: {
    fontSize: staticTheme.fontSize.md,
    color: staticTheme.colors.textSecondary,
    lineHeight: 22,
  },
  statusContainer: {
    alignItems: 'center',
    marginTop: staticTheme.spacing.md,
  },
  statusBadge: {
    paddingHorizontal: staticTheme.spacing.lg,
    paddingVertical: staticTheme.spacing.sm,
    borderRadius: staticTheme.borderRadius.md,
  },
  statusText: {
    color: staticTheme.colors.text,
    fontSize: staticTheme.fontSize.md,
    fontWeight: staticTheme.fontWeight.bold,
  },
});
