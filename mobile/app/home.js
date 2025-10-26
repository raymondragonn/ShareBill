import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, Dimensions, Alert, FlatList } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Datos de grupos para el carrusel
  const groupsData = [
    {
      id: '1',
      name: 'Cena familiar',
      code: '1234',
      date: 'Hace 2 horas',
      amount: '$245.50',
      members: '3 miembros',
      icon: 'restaurant',
      color: '#EF4444'
    },
    {
      id: '2',
      name: 'Gasolina',
      code: '5678',
      date: 'Ayer',
      amount: '$180.00',
      members: '2 miembros',
      icon: 'car',
      color: '#3B82F6'
    },
    {
      id: '3',
      name: 'Cumpleaños Ana',
      code: '9012',
      date: 'Hace 3 días',
      amount: '$420.75',
      members: '5 miembros',
      icon: 'gift',
      color: '#10B981'
    },
    {
      id: '4',
      name: 'Viaje a la playa',
      code: '3456',
      date: 'Hace 1 semana',
      amount: '$1,250.30',
      members: '4 miembros',
      icon: 'airplane',
      color: '#F59E0B'
    },
    {
      id: '5',
      name: 'Cena de trabajo',
      code: '7890',
      date: 'Hace 2 semanas',
      amount: '$365.50',
      members: '3 miembros',
      icon: 'briefcase',
      color: '#8B5CF6'
    }
  ];

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

  const renderGroupItem = ({ item }) => (
    <View style={styles.carouselGroupCard}>
      <View style={styles.groupIcon}>
        <Ionicons name={item.icon} size={20} color={item.color} />
      </View>
      <View style={styles.groupInfo}>
        <Text style={styles.groupCode}>{item.code}</Text>
        <Text style={styles.groupDate}>{item.date}</Text>
      </View>
      <View style={styles.groupStats}>
        <Text style={styles.groupAmount}>{item.amount}</Text>
        <Text style={styles.groupMembers}>{item.members}</Text>
      </View>
    </View>
  );

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
            <Ionicons name="add-circle" size={32} color="#1E40AF" />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionButtonText}>Nuevo grupo</Text>
            <Text style={styles.actionButtonSubtext}>Crear grupo</Text>
          </View>
        </TouchableOpacity>
        
        <Link href="/scan-qr" asChild>
          <TouchableOpacity style={styles.actionButtonSecondary}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="qr-code" size={32} color="#059669" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionButtonTextSecondary}>Unirme a grupo</Text>
              <Text style={styles.actionButtonSubtextSecondary}>Escanear QR</Text>
            </View>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Transacciones recientes */}
      <View style={styles.recentTransactions}>
        <Text style={styles.sectionTitle}>Transacciones recientes</Text>
        
        <View style={styles.transactionsList}>
          <View style={styles.transactionCard}>
            <View style={styles.transactionIcon}>
              <Ionicons name="card" size={20} color="#10B981" />
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionAmount}>$25.50</Text>
              <Text style={styles.transactionGroup}>Cena familiar</Text>
              <Text style={styles.transactionCode}>Código: 1234</Text>
            </View>
            <View style={styles.transactionDate}>
              <Text style={styles.transactionTime}>Hace 1 hora</Text>
              <Text style={styles.transactionStatus}>Pagado</Text>
            </View>
          </View>

          <View style={styles.transactionCard}>
            <View style={styles.transactionIcon}>
              <Ionicons name="card" size={20} color="#3B82F6" />
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionAmount}>$15.00</Text>
              <Text style={styles.transactionGroup}>Gasolina</Text>
              <Text style={styles.transactionCode}>Código: 5678</Text>
            </View>
            <View style={styles.transactionDate}>
              <Text style={styles.transactionTime}>Ayer</Text>
              <Text style={styles.transactionStatus}>Pagado</Text>
            </View>
          </View>

          <View style={styles.transactionCard}>
            <View style={styles.transactionIcon}>
              <Ionicons name="card" size={20} color="#F59E0B" />
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionAmount}>$40.25</Text>
              <Text style={styles.transactionGroup}>Cumpleaños Ana</Text>
              <Text style={styles.transactionCode}>Código: 9012</Text>
            </View>
            <View style={styles.transactionDate}>
              <Text style={styles.transactionTime}>Hace 2 días</Text>
              <Text style={styles.transactionStatus}>Pagado</Text>
            </View>
          </View>

          <View style={styles.transactionCard}>
            <View style={styles.transactionIcon}>
              <Ionicons name="card" size={20} color="#8B5CF6" />
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionAmount}>$32.75</Text>
              <Text style={styles.transactionGroup}>Viaje a la playa</Text>
              <Text style={styles.transactionCode}>Código: 3456</Text>
            </View>
            <View style={styles.transactionDate}>
              <Text style={styles.transactionTime}>Hace 1 semana</Text>
              <Text style={styles.transactionStatus}>Pagado</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Grupos creados */}
      <View style={styles.recentGroups}>
        <Text style={styles.sectionTitle}>Grupos creados</Text>
        
        <FlatList
          data={groupsData}
          renderItem={renderGroupItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContainer}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        />
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
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16,
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
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16,
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
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionContent: {
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionButtonTextSecondary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionButtonSubtext: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  actionButtonSubtextSecondary: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },

  // Transacciones recientes
  recentTransactions: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  transactionsList: {
    gap: 12,
  },
  transactionCard: {
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
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 4,
  },
  transactionGroup: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  transactionCode: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  transactionDate: {
    alignItems: 'flex-end',
  },
  transactionTime: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  transactionStatus: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },

  // Grupos recientes
  recentGroups: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  carouselContainer: {
    paddingHorizontal: 0,
  },
  carouselGroupCard: {
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
    width: width * 0.8,
    minWidth: 280,
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
  groupCode: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 4,
    fontFamily: 'monospace',
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
