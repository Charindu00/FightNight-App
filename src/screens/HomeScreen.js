import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { fetchAllFights } from '../services/api';
import { useTheme } from '../context/ThemeContext';

export default function HomeScreen({ navigation }) {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [fights, setFights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Fetch fights on component mount
  useEffect(() => {
    loadFights();
  }, []);

  const loadFights = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch real data from dummyjson API
      const data = await fetchAllFights();
      
      if (!data || data.length === 0) {
        console.log('⚠️ NO API DATA');
        setError('No fights available');
        setFights([]);
      } else {
        console.log('✅ API DATA LOADED:', data.length, 'events');
        console.log('First event:', data[0]?.title);
        setFights(data);
      }
    } catch (err) {
      console.error('Error loading fights:', err);
      setError('Failed to load fights');
      // Fallback to mock data on error
      setFights(getMockFights());
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFights();
    setRefreshing(false);
  };

  const renderFightCard = ({ item }) => {
    // Determine color based on fight sport
    const sportColors = {
      'MMA': '#d20a0a',      // Red for MMA
      'UFC': '#d20a0a',       // Red for UFC
      'Boxing': '#FFD700',    // Gold for Boxing
      'default': '#666666'
    };
    const sportBgColor = sportColors[item.sport] || sportColors['default'];

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
        onPress={() => navigation.navigate('Details', { fight: item })}
        activeOpacity={0.8}
      >
        {/* Fight Poster - Using colored background instead of image */}
        <View style={[styles.cardImage, { backgroundColor: sportBgColor }]}>
          <Text style={styles.cardImageText}>{item.sport}</Text>
          <Feather name="zap" size={48} color="rgba(255,255,255,0.3)" style={styles.cardIcon} />
        </View>

        {/* Fight Info */}
        <View style={styles.cardContent}>
          {/* Sport Badge */}
          <View style={[styles.sportBadge, { backgroundColor: theme.colors.primary }]}>
            <Text style={[styles.sportText, { color: '#FFFFFF' }]}>{item.sport}</Text>
          </View>

          {/* Fight Title */}
          <Text style={[styles.cardTitle, { color: theme.colors.text }]} numberOfLines={2}>
            {item.title}
          </Text>

          {/* Fighters */}
          <View style={styles.fightersRow}>
            <Text style={[styles.fighterName, { color: theme.colors.accent }]} numberOfLines={1}>
              {item.fighter1}
            </Text>
            <Text style={[styles.vs, { color: theme.colors.textSecondary }]}>VS</Text>
            <Text style={[styles.fighterName, { color: theme.colors.accent }]} numberOfLines={1}>
              {item.fighter2}
            </Text>
          </View>

          {/* Location & Date */}
          <View style={styles.infoRow}>
            <Feather name="map-pin" size={14} color={theme.colors.textSecondary} />
            <Text style={[styles.infoText, { color: theme.colors.textSecondary }]} numberOfLines={1}>
              {item.location}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Feather name="calendar" size={14} color={theme.colors.textSecondary} />
            <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>{item.date}</Text>
          </View>
          
          {/* Ticket Price */}
          {item.ticketPrice && (
            <View style={[styles.priceRow, { borderTopColor: theme.colors.border }]}>
              <Feather name="dollar-sign" size={14} color={theme.colors.accent} />
              <Text style={[styles.priceText, { color: theme.colors.accent }]}>${item.ticketPrice}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Loading fights...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Theme Toggle Header */}
      <View style={[styles.themeHeader, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.themeHeaderTitle, { color: theme.colors.text }]}>🥊 Upcoming Fights</Text>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
          <Feather 
            name={isDarkMode ? 'sun' : 'moon'} 
            size={24} 
            color={isDarkMode ? '#FFD700' : '#333'} 
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={fights}
        renderItem={renderFightCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="inbox" size={64} color={theme.colors.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>No fights available</Text>
            <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>Pull down to refresh</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  themeHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  themeToggle: {
    padding: 8,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
  listContent: {
    padding: 16,
  },
  card: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  cardImage: {
    width: '100%',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cardImageText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  cardIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  cardContent: {
    padding: 16,
  },
  sportBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  sportText: {
    fontSize: 12,
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  fightersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  fighterName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  vs: {
    fontSize: 14,
    marginHorizontal: 8,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 4,
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  priceText: {
    fontSize: 16,
    marginLeft: 4,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    marginTop: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 4,
  },
});
