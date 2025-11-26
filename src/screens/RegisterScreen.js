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
} from 'react-native';
import { useTheme, themes, sharedTheme } from '../context/ThemeContext';

// Static theme for StyleSheet (uses dark theme as base)
const staticTheme = { ...themes.dark, ...sharedTheme };

export default function RegisterScreen({ navigation }) {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    // Validation
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Simulate registration success
    Alert.alert(
      'Success',
      'Account created successfully! Please login.',
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Login'),
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Header */}
        <Text style={styles.title}>Join FightNight</Text>
        <Text style={styles.subtitle}>🥊 Create Your Fighter Profile</Text>

        {/* Input Fields */}
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor={theme.colors.textSecondary}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={theme.colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
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

          {/* Register Button */}
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Create Account</Text>
          </TouchableOpacity>

          {/* Login Link */}
          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginText}>
              Already have an account?{' '}
              <Text style={styles.loginTextBold}>Login</Text>
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
  registerButton: {
    backgroundColor: staticTheme.colors.primary,
    borderRadius: staticTheme.borderRadius.md,
    padding: staticTheme.spacing.md,
    alignItems: 'center',
    marginTop: staticTheme.spacing.md,
  },
  registerButtonText: {
    color: staticTheme.colors.text,
    fontSize: staticTheme.fontSize.lg,
    fontWeight: staticTheme.fontWeight.bold,
  },
  loginLink: {
    marginTop: staticTheme.spacing.lg,
    alignItems: 'center',
  },
  loginText: {
    color: staticTheme.colors.textSecondary,
    fontSize: staticTheme.fontSize.md,
  },
  loginTextBold: {
    color: staticTheme.colors.accent,
    fontWeight: staticTheme.fontWeight.bold,
  },
});
