import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Link } from 'expo-router';

export default function HomePage() {
  const user = { name: 'Pedro' };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hola, {user.name}</Text>
      </View>

      <View style={styles.actionsContainer}>
        <Link href="/admin/qr" asChild>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="add-circle" size={36} color="#000000" />
            <Text style={styles.actionButtonText}>Nuevo grupo</Text>
          </TouchableOpacity>
        </Link>
        
        <Link href="/scan-qr" asChild>
          <TouchableOpacity style={styles.actionButtonSecondary}>
            <Ionicons name="qr-code" size={36} color="#007AFF" />
            <Text style={styles.actionButtonTextSecondary}>Unirme a grupo</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.recentGroups}>
        <View style={styles.divider} />
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

        <View style={styles.groupCard}>
          <View style={styles.groupInfo}>
            <Text style={styles.groupName}>Cumpleaños Ana</Text>
            <Text style={styles.groupDate}>Hace 3 días</Text>
          </View>
          <View style={styles.groupStats}>
            <Text style={styles.groupAmount}>$120.75</Text>
            <Text style={styles.groupMembers}>5 miembros</Text>
          </View>
        </View>

        <View style={styles.groupCard}>
          <View style={styles.groupInfo}>
            <Text style={styles.groupName}>Viaje a la playa</Text>
            <Text style={styles.groupDate}>Hace 1 semana</Text>
          </View>
          <View style={styles.groupStats}>
            <Text style={styles.groupAmount}>$85.30</Text>
            <Text style={styles.groupMembers}>4 miembros</Text>
          </View>
        </View>

        <View style={styles.groupCard}>
          <View style={styles.groupInfo}>
            <Text style={styles.groupName}>Cena de trabajo</Text>
            <Text style={styles.groupDate}>Hace 2 semanas</Text>
          </View>
          <View style={styles.groupStats}>
            <Text style={styles.groupAmount}>$65.50</Text>
            <Text style={styles.groupMembers}>3 miembros</Text>
          </View>
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
    paddingBottom: 0,
  },
  greeting: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#003049',
  },
  actionsContainer: {
    padding: 24,
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    backgroundColor: '#f2f3f7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderRadius: 15,
    color: '#003049',
    flex: 1,
  },
  actionButtonText: {
    color: '#000000',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 16,
  },
  actionButtonSecondary: {
    backgroundColor: '#f2f3f7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderRadius: 15,
    flex: 1,
  },
  actionButtonTextSecondary: {
    color: '#003049',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 16,
  },
  actionButtonTertiary: {
    backgroundColor: '#669BBC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
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
  actionButtonTextTertiary: {
    color: '#FDF0D5',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 16,
  },
  recentGroups: {
    padding: 24,
    paddingTop: 0,
  },
  divider: {
    height: 1,
    backgroundColor: '#949494',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#003049',
    marginBottom: 20,
  },
  groupCard: {
    backgroundColor: '#f2f3f7',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
    marginBottom: 16,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#003049',
    marginBottom: 6,
  },
  groupDate: {
    fontSize: 16,
    color: '#949494',
    fontWeight: '500',
  },
  groupStats: {
    alignItems: 'flex-end',
  },
  groupAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 6,
  },
  groupMembers: {
    fontSize: 14,
    color: '#949494',
    fontWeight: '500',
  },
  quickStats: {
    flexDirection: 'row',
    padding: 24,
    gap: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FDF0D5',
    padding: 24,
    borderRadius: 15,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#C1121F',
    marginTop: 12,
  },
  statLabel: {
    fontSize: 14,
    color: '#669BBC',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
});
