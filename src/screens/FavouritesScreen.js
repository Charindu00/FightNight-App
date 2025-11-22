import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useSelector } from 'react-redux';
import { selectFavourites } from '../redux/slices/favouritesSlice';
import { theme } from '../styles/theme';

export default function FavouritesScreen() {
  const favourites = useSelector(selectFavourites);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>❤️ My Favourites</Text>
      <Text style={styles.count}>
        {favourites.length === 0
          ? 'No favourites yet'
          : `${favourites.length} saved fights`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  count: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
});
