import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { searchFights, searchPastEvents, searchFighters } from '../services/api';
import { useTheme, themes, sharedTheme } from '../context/ThemeContext';

// Static theme for StyleSheet (uses dark theme as base)
const staticTheme = { ...themes.dark, ...sharedTheme };

export default function SearchScreen({ navigation }) {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('events'); // 'events', 'past', 'fighters'
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    // Allow empty search for 'past' and also allow loading all events/fighters
    try {
      setLoading(true);
      setSearched(true);
      let data = [];

      if (searchType === 'events') {
        data = await searchFights(searchQuery);
      } else if (searchType === 'past') {
        data = await searchPastEvents();
      } else if (searchType === 'fighters') {
        data = await searchFighters(searchQuery);
      }

      console.log('📱 Results received in SearchScreen:', data?.length || 0);
      setResults(data || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const renderEventResult = ({ item }) => (
    <TouchableOpacity
      style={styles.resultCard}
      onPress={() => navigation.navigate('Details', { fight: item })}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.resultImage}
        resizeMode="cover"
      />
      <View style={styles.resultContent}>
        <View style={styles.sportBadge}>
          <Text style={styles.sportText}>{item.sport}</Text>
        </View>
        <Text style={styles.resultTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.fightersRow}>
          <Text style={styles.fighterName} numberOfLines={1}>
            {item.fighter1}
          </Text>
          <Text style={styles.vs}>VS</Text>
          <Text style={styles.fighterName} numberOfLines={1}>
            {item.fighter2}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Feather name="calendar" size={14} color={theme.colors.textSecondary} />
          <Text style={styles.infoText}>{item.date}</Text>
          {item.status && (
            <View style={[
              styles.statusBadge,
              { backgroundColor: item.status === 'Upcoming' ? theme.colors.success : theme.colors.textSecondary }
            ]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFighterResult = ({ item }) => (
    <TouchableOpacity
      style={styles.fighterCard}
      onPress={() => navigation.navigate('FighterProfile', { fighter: item })}
      activeOpacity={0.8}
    >
      {item.photo && (
        <Image
          source={{ uri: item.photo }}
          style={styles.fighterImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.fighterInfo}>
        <Text style={styles.fighterNameLarge}>{item.name}</Text>
        <View style={styles.fighterDetailRow}>
          <Feather name="flag" size={14} color={theme.colors.textSecondary} />
          <Text style={styles.fighterDetail}>{item.nationality}</Text>
        </View>
        {item.weight && (
          <View style={styles.fighterDetailRow}>
            <Feather name="activity" size={14} color={theme.colors.textSecondary} />
            <Text style={styles.fighterDetail}>{item.weight}</Text>
          </View>
        )}
        {item.team && (
          <View style={styles.fighterDetailRow}>
            <Feather name="shield" size={14} color={theme.colors.textSecondary} />
            <Text style={styles.fighterDetail}>{item.team}</Text>
          </View>
        )}
      </View>
      <Feather name="chevron-right" size={24} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Type Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, searchType === 'events' && styles.tabActive]}
          onPress={() => setSearchType('events')}
        >
          <Feather
            name="search"
            size={18}
            color={searchType === 'events' ? theme.colors.primary : theme.colors.textSecondary}
          />
          <Text style={[styles.tabText, searchType === 'events' && styles.tabTextActive]}>
            Events
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, searchType === 'past' && styles.tabActive]}
          onPress={() => {
            setSearchType('past');
            setSearchQuery('');
          }}
        >
          <Feather
            name="clock"
            size={18}
            color={searchType === 'past' ? theme.colors.primary : theme.colors.textSecondary}
          />
          <Text style={[styles.tabText, searchType === 'past' && styles.tabTextActive]}>
            Past Results
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, searchType === 'fighters' && styles.tabActive]}
          onPress={() => setSearchType('fighters')}
        >
          <Feather
            name="user"
            size={18}
            color={searchType === 'fighters' ? theme.colors.primary : theme.colors.textSecondary}
          />
          <Text style={[styles.tabText, searchType === 'fighters' && styles.tabTextActive]}>
            Fighters
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        {searchType !== 'past' && (
          <TextInput
            style={styles.searchInput}
            placeholder={
              searchType === 'events'
                ? 'Search by fighter name (Jones, Silva...)...'
                : 'Search fighters (or leave empty for all)...'
            }
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        )}
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Feather name="search" size={20} color={theme.colors.text} />
          <Text style={styles.searchButtonText}>
            {searchType === 'past' ? 'Load Past Results' : searchQuery.trim() ? 'Search' : 'Load All'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Results */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      ) : searched && results.length === 0 ? (
        <View style={styles.centerContainer}>
          <Feather name="inbox" size={64} color={theme.colors.textSecondary} />
          <Text style={styles.emptyText}>No results found</Text>
          <Text style={styles.emptySubtext}>Try a different search term</Text>
        </View>
      ) : !searched ? (
        <View style={styles.centerContainer}>
          <Feather name="search" size={64} color={theme.colors.textSecondary} />
          <Text style={styles.emptyText}>
            {searchType === 'past' ? 'Load Past Results' : 'Search for Events or Fighters'}
          </Text>
          <Text style={styles.emptySubtext}>
            {searchType === 'events' && 'Search for UFC, Bellator, or Boxing events'}
            {searchType === 'past' && 'View results from completed fights'}
            {searchType === 'fighters' && 'Find fighter profiles and stats'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          renderItem={searchType === 'fighters' ? renderFighterResult : renderEventResult}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          contentContainerStyle={styles.resultsList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: staticTheme.colors.background,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: staticTheme.colors.card,
    padding: staticTheme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: staticTheme.colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: staticTheme.spacing.sm,
    paddingHorizontal: staticTheme.spacing.xs,
    borderRadius: staticTheme.borderRadius.md,
  },
  tabActive: {
    backgroundColor: staticTheme.colors.background,
  },
  tabText: {
    fontSize: staticTheme.fontSize.sm,
    color: staticTheme.colors.textSecondary,
    marginLeft: staticTheme.spacing.xs,
    fontWeight: staticTheme.fontWeight.medium,
  },
  tabTextActive: {
    color: staticTheme.colors.primary,
    fontWeight: staticTheme.fontWeight.bold,
  },
  searchContainer: {
    padding: staticTheme.spacing.md,
    backgroundColor: staticTheme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: staticTheme.colors.border,
  },
  searchInput: {
    backgroundColor: staticTheme.colors.background,
    borderRadius: staticTheme.borderRadius.md,
    padding: staticTheme.spacing.md,
    fontSize: staticTheme.fontSize.md,
    color: staticTheme.colors.text,
    marginBottom: staticTheme.spacing.sm,
    borderWidth: 1,
    borderColor: staticTheme.colors.border,
  },
  searchButton: {
    backgroundColor: staticTheme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: staticTheme.spacing.md,
    borderRadius: staticTheme.borderRadius.md,
  },
  searchButtonText: {
    color: staticTheme.colors.text,
    fontSize: staticTheme.fontSize.md,
    fontWeight: staticTheme.fontWeight.bold,
    marginLeft: staticTheme.spacing.sm,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: staticTheme.spacing.xl,
  },
  loadingText: {
    color: staticTheme.colors.textSecondary,
    fontSize: staticTheme.fontSize.md,
    marginTop: staticTheme.spacing.md,
  },
  emptyText: {
    fontSize: staticTheme.fontSize.lg,
    color: staticTheme.colors.text,
    marginTop: staticTheme.spacing.md,
    fontWeight: staticTheme.fontWeight.semibold,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: staticTheme.fontSize.sm,
    color: staticTheme.colors.textSecondary,
    marginTop: staticTheme.spacing.xs,
    textAlign: 'center',
  },
  resultsList: {
    padding: staticTheme.spacing.md,
  },
  resultCard: {
    backgroundColor: staticTheme.colors.card,
    borderRadius: staticTheme.borderRadius.lg,
    marginBottom: staticTheme.spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: staticTheme.colors.border,
  },
  resultImage: {
    width: '100%',
    height: 150,
    backgroundColor: staticTheme.colors.border,
  },
  resultContent: {
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
  resultTitle: {
    fontSize: staticTheme.fontSize.lg,
    fontWeight: staticTheme.fontWeight.bold,
    color: staticTheme.colors.text,
    marginBottom: staticTheme.spacing.sm,
  },
  fightersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: staticTheme.spacing.sm,
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
  },
  infoText: {
    fontSize: staticTheme.fontSize.sm,
    color: staticTheme.colors.textSecondary,
    marginLeft: staticTheme.spacing.xs,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: staticTheme.spacing.sm,
    paddingVertical: 2,
    borderRadius: staticTheme.borderRadius.sm,
    marginLeft: staticTheme.spacing.sm,
  },
  statusText: {
    color: staticTheme.colors.text,
    fontSize: staticTheme.fontSize.xs,
    fontWeight: staticTheme.fontWeight.bold,
  },
  fighterCard: {
    backgroundColor: staticTheme.colors.card,
    borderRadius: staticTheme.borderRadius.lg,
    padding: staticTheme.spacing.md,
    marginBottom: staticTheme.spacing.md,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: staticTheme.colors.border,
  },
  fighterImage: {
    width: 80,
    height: 80,
    borderRadius: staticTheme.borderRadius.md,
    backgroundColor: staticTheme.colors.border,
    marginRight: staticTheme.spacing.md,
  },
  fighterInfo: {
    flex: 1,
  },
  fighterNameLarge: {
    fontSize: staticTheme.fontSize.lg,
    fontWeight: staticTheme.fontWeight.bold,
    color: staticTheme.colors.text,
    marginBottom: staticTheme.spacing.xs,
  },
  fighterDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: staticTheme.spacing.xs,
  },
  fighterDetail: {
    fontSize: staticTheme.fontSize.sm,
    color: staticTheme.colors.textSecondary,
    marginLeft: staticTheme.spacing.xs,
  },
});
