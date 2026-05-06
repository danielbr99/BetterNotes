import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../src/services/api';
import { LucideFileText, LucideLayoutList } from 'lucide-react-native';

export default function FolderView() {
  const { id } = useLocalSearchParams();

  const { data: entries, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['entries', 'folder', id],
    queryFn: async () => {
      const response = await api.get('/entries', {
        params: { folder_id: id }
      });
      return response.data;
    },
  });

  const renderEntry = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.entryCard}>
      <View style={styles.entryIcon}>
        {item.type === 'task' ? (
          <LucideLayoutList color="#D4A017" size={24} />
        ) : (
          <LucideFileText color="#D4A017" size={24} />
        )}
      </View>
      <View style={styles.entryContent}>
        <Text style={styles.entryTitle}>{item.titulo}</Text>
        <Text style={styles.entrySubtitle} numberOfLines={1}>
          {item.is_encrypted ? "🔒 Contenido Protegido" : item.contenido}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Carpeta" }} />

      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color="#D4A017" />
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => `entry-${item.id}`}
          renderItem={renderEntry}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#D4A017" />
          }
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Esta carpeta está vacía</Text>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    fontSize: 17,
    color: '#8E8E93',
  }
});
