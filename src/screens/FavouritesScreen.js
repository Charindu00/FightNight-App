import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { selectFavourites, removeFavourite } from '../redux/slices/favouritesSlice';
import { useTheme, themes, sharedTheme } from '../context/ThemeContext';

// Static theme for StyleSheet (uses dark theme as base)
const staticTheme = { ...themes.dark, ...sharedTheme };

export default function FavouritesScreen({ navigation }) {
  const { theme } = useTheme();
  const favourites = useSelector(selectFavourites);
  const dispatch = useDispatch();

  const handleRemoveFavourite = (fightId) => {
    dispatch(removeFavourite(fightId));
  };

  const renderFightCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Details', { fight: item })}
      activeOpacity={0.8}
    >
      {/* Fight Poster */}
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.cardImage}
        resizeMode="cover"
      />

      {/* Remove Button */}
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFavourite(item.id)}
        activeOpacity={0.8}
      >
        <Feather name="x" size={20} color={theme.colors.text} />
      </TouchableOpacity>

      {/* Fight Info */}
      <View style={styles.cardContent}>
        {/* Sport Badge */}
        <View style={styles.sportBadge}>
          <Text style={styles.sportText}>{item.sport}</Text>
        </View>

        {/* Fight Title */}
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>

        {/* Fighters */}
        <View style={styles.fightersRow}>
          <Text style={styles.fighterName} numberOfLines={1}>
            {item.fighter1}
          </Text>
          <Text style={styles.vs}>VS</Text>
          <Text style={styles.fighterName} numberOfLines={1}>
            {item.fighter2}
          </Text>
        </View>

        {/* Location & Date */}
        <View style={styles.infoRow}>
          <Feather name="map-pin" size={14} color={theme.colors.textSecondary} />
          <Text style={styles.infoText} numberOfLines={1}>
            {item.location}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Feather name="calendar" size={14} color={theme.colors.textSecondary} />
          <Text style={styles.infoText}>{item.date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (favourites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Feather name="heart" size={80} color={theme.colors.textSecondary} />
        <Text style={styles.emptyTitle}>No Favourites Yet</Text>
        <Text style={styles.emptyText}>
          Start adding fights to your favourites by tapping the heart icon
        </Text>
        <TouchableOpacity
          style={styles.exploreButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Feather name="compass" size={20} color={theme.colors.text} />
          <Text style={styles.exploreButtonText}>Explore Fights</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Stats */}
      <View style={styles.header}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{favourites.length}</Text>
          <Text style={styles.statLabel}>Saved Fights</Text>
        </View>
      </View>

      {/* Favourites List */}
      <FlatList
        data={favourites}
        renderItem={renderFightCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: staticTheme.colors.background,
  },
  header: {
    backgroundColor: staticTheme.colors.card,
    padding: staticTheme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: staticTheme.colors.border,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: staticTheme.fontSize.xxl * 1.5,
    fontWeight: staticTheme.fontWeight.bold,
    color: staticTheme.colors.primary,
  },
  statLabel: {
    fontSize: staticTheme.fontSize.md,
    color: staticTheme.colors.textSecondary,
    marginTop: staticTheme.spacing.xs,
  },
  listContent: {
    padding: staticTheme.spacing.md,
  },
  card: {
    backgroundColor: staticTheme.colors.card,
    borderRadius: staticTheme.borderRadius.lg,
    marginBottom: staticTheme.spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: staticTheme.colors.border,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: 180,
    backgroundColor: staticTheme.colors.border,
  },
  removeButton: {
    position: 'absolute',
    top: staticTheme.spacing.sm,
    right: staticTheme.spacing.sm,
    backgroundColor: 'rgba(255, 68, 68, 0.9)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  cardContent: {
    padding: staticTheme.spacing.md,
  },
  sportBadge: {
    backgroundColor: staticTheme.colors.primary,
    paddingHorizontal: staticTheme.spacing.sm,
    paddingVertical: 4,
    borderRadius: staticTheme.borderRadius.sm,
    alignSelf: 'flex-start',
    marginBottom: staticTheme.spacing.sm,
  },
  sportText: {
    color: staticTheme.colors.text,
    fontSize: staticTheme.fontSize.xs,
    fontWeight: staticTheme.fontWeight.bold,
  },
  cardTitle: {
    fontSize: staticTheme.fontSize.lg,
    fontWeight: staticTheme.fontWeight.bold,
    color: staticTheme.colors.text,
    marginBottom: staticTheme.spacing.sm,
  },
  fightersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: staticTheme.spacing.md,
  },
  fighterName: {
    flex: 1,
    fontSize: staticTheme.fontSize.md,
    color: staticTheme.colors.accent,
    fontWeight: staticTheme.fontWeight.semibold,
  },
  vs: {
    fontSize: staticTheme.fontSize.sm,
    color: staticTheme.colors.textSecondary,
    marginHorizontal: staticTheme.spacing.sm,
    fontWeight: staticTheme.fontWeight.bold,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: staticTheme.spacing.xs,
  },
  infoText: {
    fontSize: staticTheme.fontSize.sm,
    color: staticTheme.colors.textSecondary,
    marginLeft: staticTheme.spacing.xs,
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: staticTheme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: staticTheme.spacing.xl,
  },
  emptyTitle: {
    fontSize: staticTheme.fontSize.xl,
    fontWeight: staticTheme.fontWeight.bold,
    color: staticTheme.colors.text,
    marginTop: staticTheme.spacing.lg,
    marginBottom: staticTheme.spacing.sm,
  },
  emptyText: {
    fontSize: staticTheme.fontSize.md,
    color: staticTheme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: staticTheme.spacing.xl,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: staticTheme.colors.primary,
    paddingHorizontal: staticTheme.spacing.lg,
    paddingVertical: staticTheme.spacing.md,
    borderRadius: staticTheme.borderRadius.md,
  },
  exploreButtonText: {
    fontSize: staticTheme.fontSize.md,
    fontWeight: staticTheme.fontWeight.bold,
    color: staticTheme.colors.text,
    marginLeft: staticTheme.spacing.sm,
  },
});
