import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Link, useRouter, Stack } from 'expo-router';
import { api } from '../../src/services/api';
import { useAuth } from '../../src/context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const response = await api.post('/auth/token', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await login(response.data.access_token);
      router.replace('/');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.detail || 'Error al iniciar sesión. Verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Iniciar Sesión", headerRight: () => (
        <Link href="/settings" asChild>
          <TouchableOpacity>
            <Text style={styles.headerButton}>Ajustes</Text>
          </TouchableOpacity>
        </Link>
      )}} />

      <Text style={styles.logo}>Pro Notes</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor="#8E8E93"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#8E8E93"
      />

      <TouchableOpacity 
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Cargando..." : "Entrar"}
        </Text>
      </TouchableOpacity>

      <Link href="/auth/register" asChild>
        <TouchableOpacity style={styles.linkContainer}>
          <Text style={styles.linkText}>
            ¿No tienes cuenta? Regístrate
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    padding: 32,
    justifyContent: 'center',
  },
  headerButton: {
    color: '#D4A017',
    marginRight: 8,
    fontSize: 16,
  },
  logo: {
    fontSize: 40,
    fontWeight: '800',
    marginBottom: 32,
    color: '#000',
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#C6C6C8',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    marginBottom: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#D4A017',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 18,
    textAlign: 'center',
  },
  linkContainer: {
    alignItems: 'center',
  },
  linkText: {
    color: '#D4A017',
    fontSize: 17,
  }
});
