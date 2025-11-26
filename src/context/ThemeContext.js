import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Theme definitions
export const themes = {
  dark: {
    isDark: true,
    colors: {
      // Primary colors for MMA/Boxing theme
      primary: '#FF4444', // Fight red
      secondary: '#1a1a1a', // Dark background
      accent: '#FFD700', // Gold for premium features
      
      // UI colors
      background: '#000000',
      card: '#1a1a1a',
      text: '#FFFFFF',
      textSecondary: '#B0B0B0',
      border: '#333333',
      
      // Status colors
      success: '#4CAF50',
      error: '#FF4444',
      warning: '#FFA726',
      
      // Button colors
      buttonPrimary: '#FF4444',
      buttonSecondary: '#333333',
    },
  },
  light: {
    isDark: false,
    colors: {
      // Primary colors for MMA/Boxing theme
      primary: '#D32F2F', // Fight red (slightly darker for light mode)
      secondary: '#F5F5F5', // Light background
      accent: '#FFA000', // Gold/amber for premium features
      
      // UI colors
      background: '#FFFFFF',
      card: '#F5F5F5',
      text: '#212121',
      textSecondary: '#757575',
      border: '#E0E0E0',
      
      // Status colors
      success: '#4CAF50',
      error: '#D32F2F',
      warning: '#FF9800',
      
      // Button colors
      buttonPrimary: '#D32F2F',
      buttonSecondary: '#E0E0E0',
    },
  },
};

// Shared theme properties (same for both modes)
export const sharedTheme = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
  
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

// Create context
const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved theme preference
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('themeMode');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    try {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      await AsyncStorage.setItem('themeMode', newMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  // Combine theme colors with shared properties
  const currentTheme = {
    ...(isDarkMode ? themes.dark : themes.light),
    ...sharedTheme,
  };

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, isDarkMode, toggleTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
