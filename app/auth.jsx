import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, useRouter } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useColorScheme } from '@/components/useColorScheme';
import { SegmentedControl } from '@/src/components/SegmentedControl';
import { StyledButton } from '@/src/components/StyledButton';
import { StyledInput } from '@/src/components/StyledInput';
import { ThemeToggleButton } from '@/src/components/ThemeToggleButton';
import { useFinanceStore } from '@/src/store/useFinanceStore';
import { Colors } from '@/src/theme';

const AUTH_MODES = ['Sign In', 'Sign Up'];

export default function AuthScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'];
  const { isAuthenticated, signIn, signUp } = useFinanceStore();
  const [modeIndex, setModeIndex] = useState(0);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('gautammanoj767@gmail.com');
  const [password, setPassword] = useState('mangesh12345');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const isSignUp = modeIndex === 1;
  const helperText = useMemo(
    () => (isSignUp ? 'Create your local account to start tracking your money.' : 'Sign in to continue managing your finance dashboard.'),
    [isSignUp]
  );

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  const handleSubmit = () => {
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      return;
    }

    if (isSignUp) {
      if (!fullName.trim()) {
        setError('Full name is required');
        return;
      }

      if (password.trim().length < 6) {
        setError('Password should be at least 6 characters');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      const result = signUp({
        name: fullName,
        email,
        password,
      });

      if (!result.success) {
        setError(result.message);
        return;
      }

      router.replace('/(tabs)');
      return;
    }

    const result = signIn({ email, password });
    if (!result.success) {
      setError(result.message);
      return;
    }

    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'android' ? 28 : 0}
      >
        <LinearGradient
          colors={colorScheme === 'dark' ? ['#0A0A0A', '#121212', '#090909'] : ['#FCFCFD', '#F2F4F7', '#EDEFF3']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.topBar}>
          <Image
            source={require('@/assets/images/tuf-logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <ThemeToggleButton />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
        >
          <View style={styles.hero}>
            <Text style={[styles.title, { color: theme.text }]}>Welcome to TUF</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Sign in to your finance workspace and keep your income, expenses, and insights in one place.
            </Text>
          </View>

          <View
            style={[
              styles.card,
              {
                backgroundColor: colorScheme === 'dark' ? 'rgba(24,24,24,0.92)' : 'rgba(255,255,255,0.96)',
                borderColor: theme.outline,
              },
            ]}
          >
            <Text style={[styles.cardTitle, { color: theme.text }]}>Get started</Text>
            <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>{helperText}</Text>

            <SegmentedControl
              values={AUTH_MODES}
              selectedIndex={modeIndex}
              onChange={(nextIndex) => {
                setModeIndex(nextIndex);
                setError('');
              }}
              style={styles.segmentControl}
            />

            {isSignUp ? (
              <StyledInput
                label="Full Name"
                placeholder="Enter your full name"
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  setError('');
                }}
                autoCapitalize="words"
              />
            ) : null}

            <StyledInput
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View>
              <StyledInput
                label="Password"
                placeholder={isSignUp ? 'Create a password' : 'Enter your password'}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError('');
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                activeOpacity={0.85}
                onPress={() => setShowPassword((value) => !value)}
              >
                {showPassword ? <EyeOff color={theme.textMuted} size={18} /> : <Eye color={theme.textMuted} size={18} />}
              </TouchableOpacity>
            </View>

            {isSignUp ? (
              <View>
                <StyledInput
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    setError('');
                  }}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  error={error}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  activeOpacity={0.85}
                  onPress={() => setShowConfirmPassword((value) => !value)}
                >
                  {showConfirmPassword ? <EyeOff color={theme.textMuted} size={18} /> : <Eye color={theme.textMuted} size={18} />}
                </TouchableOpacity>
              </View>
            ) : error ? (
              <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text>
            ) : (
              <Text style={[styles.demoHint, { color: theme.textMuted }]}>
                Demo sign in: `gautammanoj767@gmail.com` / `mangesh12345`
              </Text>
            )}

            {!isSignUp ? (
              <TouchableOpacity activeOpacity={0.8} style={styles.forgotWrap}>
                <Text style={[styles.forgotText, { color: theme.textSecondary }]}>Forgot password?</Text>
              </TouchableOpacity>
            ) : null}

            <StyledButton
              title={isSignUp ? 'Create Account' : 'Sign In'}
              onPress={handleSubmit}
              style={styles.submitButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 120,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoImage: {
    width: 56,
    height: 56,
    borderRadius: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1.2,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 320,
  },
  card: {
    borderWidth: 1,
    borderRadius: 28,
    padding: 20,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -0.8,
  },
  cardSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 18,
  },
  segmentControl: {
    marginBottom: 18,
  },
  eyeButton: {
    position: 'absolute',
    right: 14,
    top: 44,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  demoHint: {
    fontSize: 12,
    marginTop: -2,
    marginBottom: 14,
  },
  errorText: {
    fontSize: 12,
    marginTop: -2,
    marginBottom: 10,
    marginLeft: 4,
    fontWeight: '600',
  },
  forgotWrap: {
    alignSelf: 'flex-end',
    marginTop: -2,
    marginBottom: 16,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 4,
  },
});
