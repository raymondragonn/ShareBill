import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Link } from 'expo-router';

export default function HomePage() {
  const user = { name: 'Pedro' };
  const router = useRouter();

  const handleCreateGroup = async () => {
    try {
      // Cambia la URL por la de tu backend
      const response = await fetch('http://localhost:8000/group', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Nuevo grupo', // Puedes personalizar el nombre
          members: [user.name], // Ejemplo: solo el usuario actual
        }),
      });
      if (response.ok) {
        // Navega a la pantalla de QR
        router.push('/admin/qr');
      } else {
        alert('Error al crear el grupo');
      }
    } catch (error) {
      alert('Error de red al crear el grupo');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hola, {user.name}</Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleCreateGroup}>
          <Ionicons name="add-circle" size={36} color="#000000" />
          <Text style={styles.actionButtonText}>Nuevo grupo</Text>
        </TouchableOpacity>
        
        <Link href="/scan-qr" asChild>
          <TouchableOpacity style={styles.actionButtonSecondary}>
            <Ionicons name="qr-code" size={36} color="#007AFF" />
            <Text style={styles.actionButtonTextSecondary}>Unirme a grupo</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* ...existing code... */}
      <View style={styles.recentGroups}>
        {/* ...existing code... */}
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
