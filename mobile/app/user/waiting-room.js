import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function WaitingRoomPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [groupData, setGroupData] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [enteredCode, setEnteredCode] = useState(null);

  useEffect(() => {
    // Capturar el código que se pasó como parámetro
    if (params.code) {
      setEnteredCode(params.code);
    }
    
    loadUserAndGroup();
    // Actualizar miembros cada 3 segundos
    const interval = setInterval(() => {
      if (groupData?.id) {
        loadGroupMembers(groupData.id);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [params.code]);

  // Sin simulación - solo mostrar miembros fijos

  const loadUserAndGroup = async () => {
    try {
      // Cargar usuario
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }

      // Cargar datos del grupo desde params o AsyncStorage
      const groupCode = params.code;
      if (groupCode) {
        await loadGroupByCode(groupCode);
      } else {
        const groupJSON = await AsyncStorage.getItem('joinedGroup');
        if (groupJSON) {
          const group = JSON.parse(groupJSON);
          setGroupData(group);
          await loadGroupMembers(group.id);
        }
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      Alert.alert('Error', 'No se pudo cargar la información del grupo');
    } finally {
      setLoading(false);
    }
  };

  const loadGroupByCode = async (code) => {
    try {
      // Simular unirse al grupo localmente (ya que el endpoint no está disponible)
      console.log('🔗 Simulando unirse al grupo con código:', code);
      
      // Crear datos de grupo simulados
      const simulatedGroup = {
        id: `group_${code}`,
        name: `Grupo ${code}`,
        join_link: code,
        admin_id: user?.id || 1,
        created_at: new Date().toISOString()
      };
      
      // Guardar grupo simulado
      await AsyncStorage.setItem('joinedGroup', JSON.stringify(simulatedGroup));
      setGroupData(simulatedGroup);
      
      // Simular miembros del grupo (incluyendo al usuario actual y otros miembros)
      const simulatedMembers = [
        {
          id: user?.id || 1,
          nombre: user?.nombre || 'Usuario',
          apellido: user?.apellido || 'Actual',
          email: user?.email || 'usuario@email.com'
        },
        {
          id: 'member-1',
          nombre: 'Luis',
          apellido: 'Fernández',
          email: 'luis.fernandez@email.com'
        },
        {
          id: 'member-2',
          nombre: 'Sofia',
          apellido: 'López',
          email: 'sofia.lopez@email.com'
        }
      ];
      
      setGroupMembers(simulatedMembers.map(member => ({
        id: member.id,
        name: `${member.nombre} ${member.apellido}`,
        email: member.email,
        avatar: member.nombre.charAt(0).toUpperCase(),
      })));
      
      console.log('✅ Simulación de unirse al grupo completada');
    } catch (error) {
      console.error('Error al simular unirse al grupo:', error);
      Alert.alert('Error', 'No se pudo unir al grupo');
    }
  };

  const loadGroupMembers = async (groupId) => {
    try {
      // Simular carga de miembros (ya que el endpoint no está disponible)
      console.log('👥 Simulando carga de miembros para grupo:', groupId);
      
      // Si ya hay miembros, no hacer nada
      if (groupMembers.length > 0) {
        return;
      }
      
      // Simular miembros del grupo
      const simulatedMembers = [
        {
          id: user?.id || 1,
          nombre: user?.nombre || 'Usuario',
          apellido: user?.apellido || 'Actual',
          email: user?.email || 'usuario@email.com'
        },
        {
          id: 'member-1',
          nombre: 'Luis',
          apellido: 'Fernández',
          email: 'luis.fernandez@email.com'
        },
        {
          id: 'member-2',
          nombre: 'Sofia',
          apellido: 'López',
          email: 'sofia.lopez@email.com'
        }
      ];
      
      setGroupMembers(simulatedMembers.map(member => ({
        id: member.id,
        name: `${member.nombre} ${member.apellido}`,p
        email: member.email,
        avatar: member.nombre.charAt(0).toUpperCase(),
      })));
      
      console.log('✅ Simulación de miembros completada');
    } catch (error) {
      console.error('Error al simular miembros:', error);
    }
  };

  // Redirección automática después de 5 segundos
  useEffect(() => {
    if (!loading) {
      const redirectTimeout = setTimeout(() => {
        router.push('/user/productos');
      }, 5000); // 5 segundos para ver los miembros

      return () => clearTimeout(redirectTimeout);
    }
  }, [loading, router]);

  const UserCard = ({ user }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{user.avatar}</Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
      </View>
      <View style={styles.statusIndicator}>
        <View style={styles.onlineDot} />
        <Text style={styles.onlineText}>En línea</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1E40AF" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header con gradiente */}
      <LinearGradient
        colors={['#1e3c72', '#2a5298', '#3b82f6']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{groupData?.name || 'Sala de Espera'}</Text>
          <Text style={styles.headerSubtitle}>
            Código: {enteredCode || groupData?.join_link || 'Cargando...'}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Banner de espera */}
        <View style={styles.waitingBanner}>
          <View style={styles.waitingIconContainer}>
            <Ionicons name="time-outline" size={48} color="#3B82F6" />
          </View>
          <Text style={styles.waitingTitle}>Esperando a los demás usuarios</Text>
          <Text style={styles.waitingSubtext}>
            Los miembros irán apareciendo aquí conforme se unan al grupo
          </Text>
        </View>

        {/* Lista de miembros */}
        <View style={styles.membersSection}>
          <View style={styles.membersSectionHeader}>
            <Text style={styles.membersTitle}>Miembros del Grupo</Text>
            <View style={styles.membersBadge}>
              <Text style={styles.membersBadgeText}>{groupMembers.length}</Text>
            </View>
          </View>

          {groupMembers.length > 0 ? (
            <View style={styles.membersList}>
              {groupMembers.map((member) => (
                <UserCard key={member.id} user={member} />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={64} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>Aún no hay miembros</Text>
              <Text style={styles.emptySubtext}>Espera a que los demás miembros se unan al grupo</Text>
            </View>
          )}
        </View>
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  waitingBanner: {
    backgroundColor: '#EFF6FF',
    margin: 24,
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#BFDBFE',
    borderStyle: 'dashed',
  },
  waitingIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  waitingTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 12,
    textAlign: 'center',
  },
  waitingSubtext: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  membersSection: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  membersSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  membersTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
  },
  membersBadge: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  membersBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  membersList: {
    gap: 12,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  onlineText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
 });

