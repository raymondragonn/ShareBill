import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function GroupsPage() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Grupos</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={64} color="#8E8E93" />
          <Text style={styles.emptyTitle}>No hay grupos aún</Text>
          <Text style={styles.emptySubtitle}>Crea tu primer grupo para compartir gastos</Text>
          <TouchableOpacity style={styles.createButton}>
            <Text style={styles.createButtonText}>Crear grupo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#949494',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#003049',
  },
  addButton: {
    backgroundColor: '#669BBC',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#003049',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#003049',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#949494',
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#669BBC',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 15,
    shadowColor: '#003049',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  createButtonText: {
    color: '#FDF0D5',
    fontSize: 16,
    fontWeight: '700',
  },
});
