import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../src/services/api';
import { LucideSave, LucideLock, LucideUnlock, LucideTrash } from 'lucide-react-native';
import { Encryption } from '../../src/services/encryption';

export default function EntryDetail() {
  const { id, type } = useLocalSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [folderId, setFolderId] = useState<number | null>(null);

  const isNew = id === 'new';

  const { data: folders } = useQuery({
    queryKey: ['folders'],
    queryFn: async () => {
      const response = await api.get('/folders');
      return response.data;
    },
  });

  const { data: entry, isLoading } = useQuery({
    queryKey: ['entry', id],
    queryFn: async () => {
      const response = await api.get(`/entries/${id}`);
      return response.data;
    },
    enabled: !!id && !isNew,
  });

  useEffect(() => {
    if (entry) {
      setTitulo(entry.titulo);
      setFolderId(entry.folder_id || null);
      if (!entry.is_encrypted) {
        setContenido(entry.contenido);
        setIsUnlocked(true);
      }
    } else if (isNew) {
      setIsUnlocked(true);
    }
  }, [entry, isNew]);

  const saveMutation = useMutation({
    mutationFn: (data: any) => {
      if (isNew) {
        return api.post('/entries', { ...data, type: type || 'note' });
      }
      return api.patch(`/entries/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      Alert.alert("Éxito", "Cambios guardados", [
        { text: "OK", onPress: () => isNew && router.back() }
      ]);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/entries/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      router.back();
    }
  });

  const handleDecrypt = async () => {
    if (!password) return;
    const decrypted = await Encryption.decrypt(entry.contenido, password);
    setContenido(decrypted);
    setIsUnlocked(true);
  };

  const handleSave = () => {
    if (!titulo) {
      Alert.alert("Error", "El título es obligatorio");
      return;
    }
    saveMutation.mutate({ titulo, contenido, folder_id: folderId });
  };

  if (isLoading) return <ActivityIndicator style={styles.loading} color="#D4A017" />;

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: (entry?.type || type) === 'task' ? "Tarea" : "Nota",
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              {!isNew && (
                <TouchableOpacity onPress={() => Alert.alert("Confirmar", "¿Eliminar nota?", [
                  { text: "Cancelar" },
                  { text: "Eliminar", onPress: () => deleteMutation.mutate() }
                ])}>
                  <LucideTrash color="#FF3B30" size={24} style={{ marginRight: 16 }} />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={handleSave}>
                <LucideSave color="#D4A017" size={24} style={{ marginRight: 16 }} />
              </TouchableOpacity>
            </View>
          )
        }} 
      />

      <ScrollView style={styles.scroll}>
        <TextInput
          style={styles.titleInput}
          placeholder="Título"
          value={titulo}
          onChangeText={setTitulo}
          multiline
          placeholderTextColor="#8E8E93"
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.folderSelector}>
          <TouchableOpacity 
            style={[styles.folderChip, folderId === null && styles.folderChipActive]}
            onPress={() => setFolderId(null)}
          >
            <Text style={[styles.folderChipText, folderId === null && styles.folderChipTextActive]}>
              Sin carpeta
            </Text>
          </TouchableOpacity>
          {folders?.map((folder: any) => (
            <TouchableOpacity 
              key={folder.id}
              style={[styles.folderChip, folderId === folder.id && styles.folderChipActive]}
              onPress={() => setFolderId(folder.id)}
            >
              <Text style={[styles.folderChipText, folderId === folder.id && styles.folderChipTextActive]}>
                {folder.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {entry?.is_encrypted && !isUnlocked ? (
          <View style={styles.lockedContainer}>
            <LucideLock color="#8E8E93" size={48} style={{ marginBottom: 16 }} />
            <Text style={styles.lockedText}>
              Esta nota está cifrada. Ingresa tu contraseña para verla.
            </Text>
            <TextInput
              style={styles.passwordInput}
              placeholder="Contraseña Maestra"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#8E8E93"
            />
            <TouchableOpacity style={styles.decryptButton} onPress={handleDecrypt}>
              <Text style={styles.decryptButtonText}>Descifrar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TextInput
            style={styles.contentInput}
            placeholder="Empieza a escribir..."
            value={contenido}
            onChangeText={setContenido}
            multiline
            textAlignVertical="top"
            placeholderTextColor="#8E8E93"
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    flex: 1,
    padding: 24,
  },
  titleInput: {
    fontSize: 32,
    fontWeight: '800',
    color: '#000',
    marginBottom: 16,
  },
  contentInput: {
    fontSize: 18,
    color: '#000',
    lineHeight: 28,
    minHeight: 300,
  },
  lockedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  lockedText: {
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
  },
  passwordInput: {
    width: '100%',
    backgroundColor: '#F2F2F7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 17,
    color: '#000',
  },
  decryptButton: {
    backgroundColor: '#D4A017',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  decryptButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  folderSelector: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  folderChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    marginRight: 8,
  },
  folderChipActive: {
    backgroundColor: '#D4A017',
  },
  folderChipText: {
    color: '#8E8E93',
    fontWeight: '600',
  },
  folderChipTextActive: {
    color: '#FFF',
  }
});
