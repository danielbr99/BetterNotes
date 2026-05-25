import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, Modal } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../src/services/api';
import { LucideChevronRight, LucideMove, LucideFolder } from 'lucide-react-native';


export default function KanbanBoard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [isMoveModalVisible, setIsMoveModalVisible] = useState(false);

  const { data: columns, isLoading: colsLoading } = useQuery({
    queryKey: ['columns'],
    queryFn: async () => {
      const response = await api.get('/columns');
      return response.data;
    },
  });

  const { data: entries, isLoading: entriesLoading } = useQuery({
    queryKey: ['entries', 'tasks'],
    queryFn: async () => {
      const response = await api.get('/entries', { params: { type: 'task' } });
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

  const handleMoveEntry = (entry: any) => {
    setSelectedEntry(entry);
    setIsMoveModalVisible(true);
  };

  if (colsLoading || entriesLoading) return <ActivityIndicator style={styles.loading} color="#D4A017" />;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Tablero Kanban" }} />
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {columns?.map((col: any) => (
          <View key={col.id} style={styles.column}>
            <Text style={styles.columnTitle}>{col.name}</Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {entries?.filter((e: any) => e.status_column === col.name).map((entry: any) => (
                <TouchableOpacity 
                  key={entry.id} 
                  style={styles.taskCard}
                  onPress={() => router.push(`/entry/${entry.id}`)}
                  onLongPress={() => handleMoveEntry(entry)}
                >
                  <View style={styles.taskHeader}>
                    <View style={StyleSheet.flatten([styles.priorityBadge, entry.priority === 'high' ? styles.priorityHigh : styles.priorityNormal])}>
                      <Text style={StyleSheet.flatten([styles.priorityText, entry.priority === 'high' ? styles.priorityTextHigh : styles.priorityTextNormal])}>
                        {entry.priority || "Normal"}
                      </Text>
                    </View>
                    <LucideChevronRight color="#C6C6C8" size={16} />
                  </View>
                  <Text style={styles.taskTitle}>{entry.titulo}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, justifyContent: 'space-between' }}>
                    <Text style={styles.taskVersion}>
                      Versión {entry.version}
                    </Text>
                    {entry.folder_id && (
                      <View style={styles.folderTag}>
                        <LucideFolder color="#8E8E93" size={10} style={{ marginRight: 4 }} />
                        <Text style={styles.folderTagText}>
                          {folders?.find((f: any) => f.id === entry.folder_id)?.name}
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ))}

        {columns?.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay columnas configuradas</Text>
          </View>
        )}
      </ScrollView>

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
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalScroll: {
    flex: 1,
    paddingVertical: 16,
  },
  column: {
    width: 300,
    marginHorizontal: 8,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  columnTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    paddingHorizontal: 8,
    color: '#000',
  },
  taskCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityHigh: {
    backgroundColor: '#FFE5E5',
  },
  priorityNormal: {
    backgroundColor: '#F2F2F7',
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  priorityTextHigh: {
    color: '#FF3B30',
  },
  priorityTextNormal: {
    color: '#8E8E93',
  },
  taskTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  taskVersion: {
    fontSize: 11,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
  folderTag: {
    flexDirection: 'row',
    alignItems: 'center',
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
  emptyContainer: {
    width: 400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 17,
    color: '#8E8E93',
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
