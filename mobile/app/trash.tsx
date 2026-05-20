import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Alert, StyleSheet } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../src/services/api';
import { LucideFileText, LucideLayoutList, LucideRotateCcw, LucideTrash2 } from 'lucide-react-native';

export default function Trash() {
  const queryClient = useQueryClient();

  const { data: entries, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['trash'],
    queryFn: async () => {
      const response = await api.get('/entries/trash');
      return response.data;
    },
  });

  const handleRestore = async (id: number) => {
    try {
      await api.post(`/entries/${id}/restore`);
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['trash'] });
      Alert.alert("Éxito", "Nota restaurada correctamente");
    } catch (error) {
      Alert.alert("Error", "No se pudo restaurar la nota");
    }
  };

  const handlePermanentDelete = async (id: number) => {
    Alert.alert(
      "Eliminar Permanentemente",
      "¿Estás seguro? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/entries/${id}`);
              queryClient.invalidateQueries({ queryKey: ['trash'] });
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar la nota");
            }
          }
        }
      ]
    );
  };

  const renderEntry = ({ item }: { item: any }) => (
    <View style={styles.entryCard}>
      <View style={styles.entryIcon}>
        {item.type === 'task' ? (
          <LucideLayoutList color="#8E8E93" size={24} />
        ) : (
          <LucideFileText color="#8E8E93" size={24} />
        )}
      </View>
      <View style={styles.entryContent}>
        <Text style={styles.entryTitle}>{item.titulo}</Text>
        <Text style={styles.entrySubtitle} numberOfLines={1}>
          {item.is_encrypted ? "🔒 Contenido Protegido" : item.contenido}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleRestore(item.id)} style={styles.actionButton}>
          <LucideRotateCcw color="#D4A017" size={20} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePermanentDelete(item.id)} style={styles.actionButton}>
          <LucideTrash2 color="#FF3B30" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color="#D4A017" />
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => `trash-${item.id}`}
          renderItem={renderEntry}
          contentContainerStyle={{ paddingVertical: 16 }}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#D4A017" />
          }
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <LucideTrash2 color="#C7C7CC" size={64} strokeWidth={1} />
              <Text style={styles.emptyText}>La papelera está vacía</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  entryCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  entryIcon: {
    marginRight: 16,
  },
  entryContent: {
    flex: 1,
  },
  entryTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  entrySubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 120,
  },
  emptyText: {
    fontSize: 17,
    color: '#8E8E93',
    marginTop: 16,
  },
});
