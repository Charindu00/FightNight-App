import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import { loginUser } from '../services/api';
import { useTheme, themes, sharedTheme } from '../context/ThemeContext';

// Static theme for StyleSheet (uses dark theme as base)
const staticTheme = { ...themes.dark, ...sharedTheme };

export default function LoginScreen({ navigation }) {
  const { theme } = useTheme();
  const [username, setUsername] = useState('emilys'); // Pre-filled for testing
  const [password, setPassword] = useState('emilyspass'); // Pre-filled for testing
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    // Validation
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setLoading(true);
    
    try {
      // Call dummyjson login API
      const userData = await loginUser(username, password);
      
      // Transform response to match our app structure
      const authData = {
        user: {
          id: userData.id.toString(),
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          username: userData.username,
          image: userData.image,
        },
        token: userData.token,
      };

      // Dispatch login action
      dispatch(login(authData));
      Alert.alert('Success', `Welcome back, ${userData.firstName}!`);
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid credentials. Try: emilys / emilyspass');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Header */}
        <Text style={styles.title}>FightNight</Text>
        <Text style={styles.subtitle}>🥊 Welcome Back Fighter!</Text>

        {/* Input Fields */}
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor={theme.colors.textSecondary}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={theme.colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          {/* Login Button */}
          <TouchableOpacity 
            style={[styles.loginButton, loading && styles.loginButtonDisabled]} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Helper Text */}
          <Text style={styles.helperText}>
            Test credentials: emilys / emilyspass
          </Text>

          {/* Register Link */}
          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerText}>
              Don't have an account?{' '}
              <Text style={styles.registerTextBold}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: staticTheme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: staticTheme.spacing.lg,
  },
  title: {
    fontSize: staticTheme.fontSize.xxl,
    fontWeight: staticTheme.fontWeight.bold,
    color: staticTheme.colors.primary,
    textAlign: 'center',
    marginBottom: staticTheme.spacing.sm,
  },
  subtitle: {
    fontSize: staticTheme.fontSize.lg,
    color: staticTheme.colors.accent,
    textAlign: 'center',
    marginBottom: staticTheme.spacing.xl,
  },
  formContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: staticTheme.colors.card,
    borderRadius: staticTheme.borderRadius.md,
    padding: staticTheme.spacing.md,
    fontSize: staticTheme.fontSize.md,
    color: staticTheme.colors.text,
    marginBottom: staticTheme.spacing.md,
    borderWidth: 1,
    borderColor: staticTheme.colors.border,
  },
  loginButton: {
    backgroundColor: staticTheme.colors.primary,
    borderRadius: staticTheme.borderRadius.md,
    padding: staticTheme.spacing.md,
    alignItems: 'center',
    marginTop: staticTheme.spacing.md,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: staticTheme.colors.text,
    fontSize: staticTheme.fontSize.lg,
    fontWeight: staticTheme.fontWeight.bold,
  },
  helperText: {
    color: staticTheme.colors.textSecondary,
    fontSize: staticTheme.fontSize.sm,
    textAlign: 'center',
    marginTop: staticTheme.spacing.sm,
    fontStyle: 'italic',
  },
  registerLink: {
    marginTop: staticTheme.spacing.lg,
    alignItems: 'center',
  },
  registerText: {
    color: staticTheme.colors.textSecondary,
    fontSize: staticTheme.fontSize.md,
  },
  registerTextBold: {
    color: staticTheme.colors.accent,
    fontWeight: staticTheme.fontWeight.bold,
  },
});
