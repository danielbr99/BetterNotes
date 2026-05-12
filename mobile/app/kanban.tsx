import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack, Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { api } from '../src/services/api';
import { LucideChevronRight } from 'lucide-react-native';

export default function KanbanBoard() {
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
                <Link key={entry.id} href={`/entry/${entry.id}`} asChild>
                  <TouchableOpacity style={styles.taskCard}>
                    <View style={styles.taskHeader}>
                      <View style={[styles.priorityBadge, entry.priority === 'high' ? styles.priorityHigh : styles.priorityNormal]}>
                        <Text style={[styles.priorityText, entry.priority === 'high' ? styles.priorityTextHigh : styles.priorityTextNormal]}>
                          {entry.priority || "Normal"}
                        </Text>
                      </View>
                      <LucideChevronRight color="#C6C6C8" size={16} />
                    </View>
                    <Text style={styles.taskTitle}>{entry.titulo}</Text>
                    <Text style={styles.taskVersion}>
                      Versión {entry.version}
                    </Text>
                  </TouchableOpacity>
                </Link>
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
    marginTop: 8,
    fontStyle: 'italic',
  },
  emptyContainer: {
    width: 400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 17,
    color: '#8E8E93',
  }
});
