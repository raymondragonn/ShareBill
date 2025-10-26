import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, Dimensions, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Error al cargar usuario:", error);
    }
  };

  const handleCreateGroup = async () => {
    try {
      const response = await fetch('http://localhost:8000/groups/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Nuevo grupo',
        }),
      });

      if (response.ok) {
        const groupData = await response.json();
        // Guardar los datos del grupo para mostrarlos en la pantalla de QR
        await AsyncStorage.setItem('currentGroup', JSON.stringify(groupData));
        // Navegar a la pantalla de QR
        router.push('/admin/qr');
      } else {
        const error = await response.json();
        Alert.alert('Error', error.detail || 'Error al crear el grupo');
      }
    } catch (error) {
      console.error('Error al crear grupo:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header con gradiente bancario */}
      <LinearGradient
        colors={['#1e3c72', '#2a5298', '#3b82f6']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Hola, {user ? user.nombre : 'Usuario'}</Text>
          <Text style={styles.subtitle}>Gestiona tus grupos y gastos compartidos</Text>
        </View>
      </LinearGradient>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleCreateGroup}>
          <View style={styles.actionIconContainer}>
            <Ionicons name="add-circle" size={28} color="#1E40AF" />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionButtonText}>Nuevo grupo</Text>
            <Text style={styles.actionButtonSubtext}>Crear un nuevo grupo</Text>
          </View>
        </TouchableOpacity>
        
        <Link href="/scan-qr" asChild>
          <TouchableOpacity style={styles.actionButtonSecondary}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="qr-code" size={28} color="#059669" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionButtonTextSecondary}>Unirme a grupo</Text>
              <Text style={styles.actionButtonSubtextSecondary}>Escanear código QR</Text>
            </View>
          </TouchableOpacity>
        </Link>
      </View>

      {/* ...existing code... */}
      <View style={styles.recentGroups}>
        <Text style={styles.sectionTitle}>Grupos recientes</Text>
        
        <View style={styles.groupsList}>
          <View style={styles.groupCard}>
            <View style={styles.groupIcon}>
              <Ionicons name="restaurant" size={20} color="#EF4444" />
            </View>
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
            <View style={styles.groupIcon}>
              <Ionicons name="car" size={20} color="#3B82F6" />
            </View>
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
            <View style={styles.groupIcon}>
              <Ionicons name="gift" size={20} color="#10B981" />
            </View>
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
            <View style={styles.groupIcon}>
              <Ionicons name="airplane" size={20} color="#F59E0B" />
            </View>
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
            <View style={styles.groupIcon}>
              <Ionicons name="briefcase" size={20} color="#8B5CF6" />
            </View>
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
      </View>
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  
  // Header con gradiente
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },

  // Acciones principales
  actionsContainer: {
    padding: 24,
    gap: 16,
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionButtonSecondary: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  actionButtonTextSecondary: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  actionButtonSubtext: {
    fontSize: 14,
    color: '#6B7280',
  },
  actionButtonSubtextSecondary: {
    fontSize: 14,
    color: '#6B7280',
  },

  // Grupos recientes
  recentGroups: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  groupsList: {
    gap: 12,
  },
  groupCard: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  groupIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  groupDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  groupStats: {
    alignItems: 'flex-end',
  },
  groupAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  groupMembers: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
});
