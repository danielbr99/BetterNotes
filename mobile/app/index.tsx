import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, TextInput, Alert, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../src/services/api';
import { LucideFolder, LucideFileText, LucideLayoutList, LucidePlus, LucideSearch } from 'lucide-react-native';

export default function Dashboard() {
  const [search, setSearch] = useState('');
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: entries, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['entries', search],
    queryFn: async () => {
      const response = await api.get('/entries', {
        params: { q: search || undefined }
      });
      return response.data;
    },
  });

  const { data: folders } = useQuery({
    queryKey: ['folders'],
    queryFn: async () => {
      const response = await api.get('/folders');
      return response.data;
    },
  });

  const handleCreateEntry = () => {
    Alert.alert(
      "Nueva Entrada",
      "¿Qué deseas crear?",
      [
        {
          text: "Nota",
          onPress: () => router.push('/entry/new?type=note'),
        },
        {
          text: "Tarea",
          onPress: () => router.push('/entry/new?type=task'),
        },
        {
          text: "Cancelar",
          style: "cancel"
        }
      ]
    );
  };

  const renderEntry = ({ item }: { item: any }) => (
    <Link href={`/entry/${item.id}`} asChild>
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
        <Text style={styles.entryDate}>
          {new Date(item.fecha_creacion).toLocaleDateString()}
        </Text>
      </TouchableOpacity>
    </Link>
  );

  const renderFolder = ({ item }: { item: any }) => (
    <Link href={`/folder/${item.id}`} asChild>
      <TouchableOpacity style={styles.entryCard}>
        <LucideFolder color="#D4A017" size={24} style={{ marginRight: 16 }} />
        <Text style={styles.folderName}>{item.name}</Text>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <LucideSearch color="#8E8E93" size={18} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar notas..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#8E8E93"
          />
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color="#D4A017" />
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => `entry-${item.id}`}
          renderItem={renderEntry}
          ListHeaderComponent={() => (
            <View style={{ paddingVertical: 8 }}>
              {!search && folders && folders.length > 0 && (
                <>
                  <Text style={styles.sectionHeader}>Carpetas</Text>
                  <FlatList
                    data={folders}
                    keyExtractor={(item) => `folder-${item.id}`}
                    renderItem={renderFolder}
                    scrollEnabled={false}
                  />
                  <View style={{ height: 24 }} />
                </>
              )}
              <Text style={styles.sectionHeader}>
                {search ? "Resultados de búsqueda" : "Todas las Notas"}
              </Text>
            </View>
          )}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#D4A017" />
          }
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {search ? "No se encontraron resultados" : "No hay notas todavía"}
              </Text>
            </View>
          )}
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={handleCreateEntry}
        activeOpacity={0.8}
      >
        <LucidePlus color="#FFF" size={32} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  searchInput: {
    flex: 1,
    padding: 12,
    color: '#000',
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
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
  entryDate: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 8,
  },
  folderName: {
    fontSize: 17,
    fontWeight: '500',
    flex: 1,
    color: '#000',
  },
  sectionHeader: {
    paddingHorizontal: 24,
    color: '#8E8E93',
    textTransform: 'uppercase',
    fontWeight: '700',
    fontSize: 11,
    marginBottom: 8,
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
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#D4A017',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  }
});
