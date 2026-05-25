import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Alert, StyleSheet, TextInput, Modal, ScrollView, Platform } from 'react-native';
import { Link } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../src/services/api';
import { LucideFolder, LucidePlus, LucideChevronRight } from 'lucide-react-native';

const webAlert = (title: string, message: string, buttons?: any[]) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}: ${message}`);
    if (buttons && buttons.length > 0) {
      // Find the first non-cancel button and run its onPress
      const actionButton = buttons.find(b => b.style !== 'cancel');
      if (actionButton && actionButton.onPress) {
        actionButton.onPress();
      }
    }
  } else {
    Alert.alert(title, message, buttons);
  }
};

export default function Folders() {
  const queryClient = useQueryClient();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);

  const { data: folders, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['folders'],
    queryFn: async () => {
      const response = await api.get('/folders');
      return response.data;
    },
  });

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      webAlert("Error", "El nombre de la carpeta no puede estar vacío");
      return;
    }

    try {
      await api.post('/folders', { name: newFolderName, parent_id: selectedParentId });
      setNewFolderName('');
      setSelectedParentId(null);
      setIsModalVisible(false);
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      webAlert("Éxito", "Carpeta creada correctamente");
    } catch (error) {
      webAlert("Error", "No se pudo crear la carpeta");
    }
  };

  const handleDeleteFolder = (folderId: number, folderName: string) => {
    webAlert(
      "Eliminar Carpeta",
      `¿Estás seguro de que deseas eliminar la carpeta "${folderName}"? Se eliminarán todas las notas y tareas en su interior.`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/folders/${folderId}`);
              queryClient.invalidateQueries({ queryKey: ['folders'] });
              webAlert("Éxito", "Carpeta eliminada");
            } catch (error) {
              webAlert("Error", "No se pudo eliminar la carpeta");
            }
          }
        }
      ]
    );
  };

  const renderFolderItem = (folder: any, level = 0) => {
    const children = folders?.filter((f: any) => f.parent_id === folder.id) || [];
    
    return (
      <View key={`folder-${folder.id}`}>
        <Link href={`/folder/${folder.id}`} asChild>
          <TouchableOpacity 
            style={StyleSheet.flatten([styles.folderCard, { marginLeft: 16 + (level * 24) }])}
            onLongPress={() => handleDeleteFolder(folder.id, folder.name)}
          >
            <LucideFolder color="#D4A017" size={24} style={{ marginRight: 16 }} />
            <Text style={styles.folderName}>{folder.name}</Text>
            <LucideChevronRight color="#C7C7CC" size={20} />
          </TouchableOpacity>
        </Link>
        {children.map((child: any) => renderFolderItem(child, level + 1))}
      </View>
    );
  };

  const rootFolders = folders?.filter((f: any) => !f.parent_id) || [];

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color="#D4A017" />
        </View>
      ) : (
        <FlatList
          data={rootFolders}
          keyExtractor={(item) => `root-${item.id}`}
          renderItem={({ item }) => renderFolderItem(item, 0)}
          contentContainerStyle={{ paddingVertical: 16 }}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#D4A017" />
          }
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <LucideFolder color="#C7C7CC" size={64} strokeWidth={1} />
              <Text style={styles.emptyText}>No hay carpetas todavía</Text>
            </View>
          )}
        />
      )}

      {/* Floating Action Button for Folders */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => setIsModalVisible(true)}
        activeOpacity={0.8}
      >
        <LucidePlus color="#FFF" size={32} />
      </TouchableOpacity>

      {/* New Folder Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nueva Carpeta</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre de la carpeta"
              value={newFolderName}
              onChangeText={setNewFolderName}
              autoFocus={true}
            />
            
            <Text style={{fontWeight: '600', marginBottom: 8}}>Carpeta Padre (Opcional):</Text>
            <View style={{maxHeight: 120, marginBottom: 24}}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity 
                  style={StyleSheet.flatten([styles.parentChip, selectedParentId === null && styles.parentChipActive])}
                  onPress={() => setSelectedParentId(null)}
                >
                  <Text style={StyleSheet.flatten([styles.parentChipText, selectedParentId === null && styles.parentChipTextActive])}>Ninguna</Text>
                </TouchableOpacity>
                {folders?.map((f: any) => (
                  <TouchableOpacity 
                    key={f.id}
                    style={StyleSheet.flatten([styles.parentChip, selectedParentId === f.id && styles.parentChipActive])}
                    onPress={() => setSelectedParentId(f.id)}
                  >
                    <Text style={StyleSheet.flatten([styles.parentChipText, selectedParentId === f.id && styles.parentChipTextActive])}>{f.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={StyleSheet.flatten([styles.modalButton, styles.cancelButton])} 
                onPress={() => {
                  setIsModalVisible(false);
                  setNewFolderName('');
                  setSelectedParentId(null);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={StyleSheet.flatten([styles.modalButton, styles.createButton])} 
                onPress={handleCreateFolder}
              >
                <Text style={styles.createButtonText}>Crear</Text>
              </TouchableOpacity>
            </View>
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
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  folderCard: {
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
  folderName: {
    fontSize: 17,
    fontWeight: '500',
    flex: 1,
    color: '#000',
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: '#000',
  },
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginLeft: 12,
  },
  cancelButton: {
    backgroundColor: '#F2F2F7',
  },
  createButton: {
    backgroundColor: '#D4A017',
  },
  cancelButtonText: {
    color: '#8E8E93',
    fontWeight: '600',
  },
  createButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  parentChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    marginRight: 8,
  },
  parentChipActive: {
    backgroundColor: '#D4A017',
  },
  parentChipText: {
    color: '#8E8E93',
    fontWeight: '600',
  },
  parentChipTextActive: {
    color: '#FFF',
  }
});
