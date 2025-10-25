import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function HomePage() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>¡Hola Papa! 👋</Text>
        <Text style={styles.welcomeText}>Bienvenido a ShareBill</Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="add-circle" size={32} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Nuevo grupo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButtonSecondary}>
          <Ionicons name="qr-code" size={32} color="#007AFF" />
          <Text style={styles.actionButtonTextSecondary}>Unirse a grupo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButtonTertiary}>
          <Ionicons name="time" size={32} color="#8E8E93" />
          <Text style={styles.actionButtonTextTertiary}>Historial</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.recentGroups}>
        <Text style={styles.sectionTitle}>Grupos recientes</Text>
        
        <View style={styles.groupCard}>
          <View style={styles.groupInfo}>
            <Text style={styles.groupName}>Cena familiar</Text>
            <Text style={styles.groupDate}>Hace 2 horas</Text>
          </View>
          <View style={styles.groupStats}>
            <Text style={styles.groupAmount}>$45.50</Text>
            <Text style={styles.groupMembers}>3 miembros</Text>
          </View>
        </View>

        <View style={styles.groupCard}>
          <View style={styles.groupInfo}>
            <Text style={styles.groupName}>Gasolina</Text>
            <Text style={styles.groupDate}>Ayer</Text>
          </View>
          <View style={styles.groupStats}>
            <Text style={styles.groupAmount}>$30.00</Text>
            <Text style={styles.groupMembers}>2 miembros</Text>
          </View>
        </View>
      </View>

      <View style={styles.quickStats}>
        <View style={styles.statCard}>
          <Ionicons name="receipt" size={24} color="#007AFF" />
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Facturas este mes</Text>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="people" size={24} color="#34C759" />
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Grupos activos</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 5,
  },
  welcomeText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  actionsContainer: {
    padding: 20,
    gap: 15,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  actionButtonSecondary: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButtonTextSecondary: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  actionButtonTertiary: {
    backgroundColor: '#F2F2F7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 16,
  },
  actionButtonTextTertiary: {
    color: '#8E8E93',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  recentGroups: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 15,
  },
  groupCard: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  groupDate: {
    fontSize: 14,
    color: '#8E8E93',
  },
  groupStats: {
    alignItems: 'flex-end',
  },
  groupAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  groupMembers: {
    fontSize: 12,
    color: '#8E8E93',
  },
  quickStats: {
    flexDirection: 'row',
    padding: 20,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
    textAlign: 'center',
  },
});
