import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Storage } from '../src/services/storage';
import { setApiBaseUrl } from '../src/services/api';
import { useAuth } from '../src/context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { LucideServer, LucideLogOut, LucideChevronRight } from 'lucide-react-native';

export default function Settings() {
  const [url, setUrl] = useState('http://10.0.2.2:8000');
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();
  const queryClient = useQueryClient();

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
    setIsEditingUrl(false);
    Alert.alert('Éxito', 'Configuración guardada correctamente');
  };

  const handleLogout = async () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que deseas salir?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Salir", 
          style: "destructive",
          onPress: async () => {
            await logout();
            queryClient.clear();
            router.replace('/auth/login');
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Conexión</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <LucideServer color="#D4A017" size={20} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Servidor API</Text>
              {!isEditingUrl ? (
                <Text style={styles.value}>{url}</Text>
              ) : (
                <TextInput
                  style={styles.input}
                  value={url}
                  onChangeText={setUrl}
                  placeholder="http://192.168.1.xx:8000"
                  autoCapitalize="none"
                  keyboardType="url"
                />
              )}
            </View>
            <TouchableOpacity 
              onPress={() => isEditingUrl ? handleSave() : setIsEditingUrl(true)}
              style={styles.editButton}
            >
              <Text style={styles.editButtonText}>{isEditingUrl ? "Guardar" : "Cambiar"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cuenta</Text>
        <TouchableOpacity style={styles.card} onPress={handleLogout}>
          <View style={styles.infoRow}>
            <LucideLogOut color="#FF3B30" size={20} style={{ marginRight: 12 }} />
            <Text style={[styles.label, { color: '#FF3B30', flex: 1 }]}>Cerrar Sesión</Text>
            <LucideChevronRight color="#C7C7CC" size={20} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={{ padding: 24, alignItems: 'center' }}>
        <Text style={{ color: '#8E8E93', fontSize: 13 }}>BetterNotes v1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  value: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  input: {
    fontSize: 14,
    color: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#D4A017',
    paddingVertical: 4,
    marginTop: 4,
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(212, 160, 23, 0.1)',
  },
  editButtonText: {
    color: '#D4A017',
    fontWeight: '600',
    fontSize: 14,
  }
});
