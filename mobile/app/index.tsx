import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, TextInput, Alert, StyleSheet, Platform, Modal, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../src/services/api';
import { LucideFolder, LucideFileText, LucideLayoutList, LucidePlus, LucideSearch, LucideMove } from 'lucide-react-native';

const webAlert = (title: string, message: string, buttons?: any[]) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}: ${message}`);
    if (buttons && buttons.length > 0) {
      const actionButton = buttons.find(b => b.style !== 'cancel' && b.text !== 'Cancelar');
      if (actionButton && actionButton.onPress) {
        actionButton.onPress();
      }
    }
  } else {
    Alert.alert(title, message, buttons);
  }
};

export default function Dashboard() {
  const [search, setSearch] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [isMoveModalVisible, setIsMoveModalVisible] = useState(false);
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

  const moveMutation = useMutation({
    mutationFn: ({ entryId, folderId }: { entryId: number, folderId: number | null }) => 
      api.patch(`/entries/${entryId}`, { folder_id: folderId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      setIsMoveModalVisible(false);
      setSelectedEntry(null);
    }
  });

  const handleCreateEntry = () => {
    if (Platform.OS === 'web') {
      const type = window.prompt("¿Qué deseas crear? Escribe 'nota' o 'tarea':", "nota");
      if (type?.toLowerCase() === 'nota') {
        router.push('/entry/new?type=note');
      } else if (type?.toLowerCase() === 'tarea') {
        router.push('/entry/new?type=task');
      }
      return;
    }

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

  const handleMoveEntry = (entry: any) => {
    setSelectedEntry(entry);
    setIsMoveModalVisible(true);
  };

  const renderEntry = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.entryCard}
      onPress={() => router.push(`/entry/${item.id}`)}
      onLongPress={() => handleMoveEntry(item)}
    >
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
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.entryDate}>
          {new Date(item.fecha_creacion).toLocaleDateString()}
        </Text>
        {item.folder_id && (
          <View style={styles.folderTag}>
            <LucideFolder color="#8E8E93" size={10} style={{ marginRight: 4 }} />
            <Text style={styles.folderTagText}>
              {folders?.find((f: any) => f.id === item.folder_id)?.name}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
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
                    data={folders.filter((f: any) => !f.parent_id)}
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

      {/* Move to Folder Modal */}
      <Modal
        visible={isMoveModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsMoveModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <LucideMove color="#D4A017" size={24} style={{ marginRight: 12 }} />
              <Text style={styles.modalTitle}>Mover a carpeta</Text>
            </View>
            <Text style={styles.modalSubtitle}>"{selectedEntry?.titulo}"</Text>
            
            <ScrollView style={{ maxHeight: 300, marginVertical: 16 }}>
              <TouchableOpacity 
                style={StyleSheet.flatten([styles.folderOption, selectedEntry?.folder_id === null && styles.folderOptionActive])}
                onPress={() => moveMutation.mutate({ entryId: selectedEntry.id, folderId: null })}
              >
                <Text style={StyleSheet.flatten([styles.folderOptionText, selectedEntry?.folder_id === null && styles.folderOptionTextActive])}>
                  (Sin carpeta)
                </Text>
              </TouchableOpacity>
              {folders?.map((f: any) => (
                <TouchableOpacity 
                  key={f.id}
                  style={StyleSheet.flatten([styles.folderOption, selectedEntry?.folder_id === f.id && styles.folderOptionActive])}
                  onPress={() => moveMutation.mutate({ entryId: selectedEntry.id, folderId: f.id })}
                >
                  <LucideFolder color={selectedEntry?.folder_id === f.id ? "#FFF" : "#D4A017"} size={18} style={{ marginRight: 12 }} />
                  <Text style={StyleSheet.flatten([styles.folderOptionText, selectedEntry?.folder_id === f.id && styles.folderOptionTextActive])}>
                    {f.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setIsMoveModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  },
  folderTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  folderTagText: {
    fontSize: 10,
    color: '#8E8E93',
    fontWeight: '600',
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  modalSubtitle: {
    fontSize: 15,
    color: '#8E8E93',
    marginBottom: 16,
  },
  folderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F2F2F7',
  },
  folderOptionActive: {
    backgroundColor: '#D4A017',
  },
  folderOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  folderOptionTextActive: {
    color: '#FFF',
  },
  closeButton: {
    marginTop: 8,
    alignItems: 'center',
    padding: 16,
  },
  closeButtonText: {
    fontSize: 17,
    color: '#000',
    fontWeight: '600',
  }
});
