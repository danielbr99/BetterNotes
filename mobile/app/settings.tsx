import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Storage } from '../src/services/storage';
import { setApiBaseUrl } from '../src/services/api';

export default function Settings() {
  const [url, setUrl] = useState('http://localhost:8000');
  const router = useRouter();

  useEffect(() => {
    Storage.getServerUrl().then((savedUrl) => {
      if (savedUrl) setUrl(savedUrl);
    });
  }, []);

  const handleSave = async () => {
    if (!url.startsWith('http')) {
      Alert.alert('Error', 'La URL debe empezar con http:// o https://');
      return;
    }
    await Storage.saveServerUrl(url);
    setApiBaseUrl(url);
    Alert.alert('Éxito', 'Configuración guardada correctamente', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Conexión" }} />
      
      <Text style={styles.title}>Configurar Servidor</Text>
      
      <Text style={styles.subtitle}>
        Ingresa la IP local de tu servidor FastAPI (ej: http://192.168.1.50:8000)
      </Text>

      <TextInput
        style={styles.input}
        value={url}
        onChangeText={setUrl}
        placeholder="http://192.168.1.xx:8000"
        autoCapitalize="none"
        keyboardType="url"
        placeholderTextColor="#8E8E93"
      />

      <TouchableOpacity 
        style={styles.button}
        onPress={handleSave}
      >
        <Text style={styles.buttonText}>Guardar Configuración</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    color: '#000',
  },
  subtitle: {
    fontSize: 15,
    color: '#8E8E93',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#C6C6C8',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    marginBottom: 24,
    color: '#000',
  },
  button: {
    backgroundColor: '#D4A017',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 18,
  }
});
