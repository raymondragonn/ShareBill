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

  useEffect(() => {
    loadUserAndGroup();
    // Actualizar miembros cada 3 segundos
    const interval = setInterval(() => {
      if (groupData?.id) {
        loadGroupMembers(groupData.id);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
      // Buscar grupo por código
      const response = await fetch(`http://localhost:8000/groups/join-by-code?code=${code}&user_id=${user?.id || 1}`);
      if (response.ok) {
        const data = await response.json();
        const groupInfo = data.group;
        // Guardar grupo
        await AsyncStorage.setItem('joinedGroup', JSON.stringify(groupInfo));
        setGroupData(groupInfo);
        await loadGroupMembers(groupInfo.id);
      } else {
        Alert.alert('Error', 'Código de grupo inválido');
      }
    } catch (error) {
      console.error('Error al unirse al grupo:', error);
      Alert.alert('Error', 'No se pudo unir al grupo');
    }
  };

  const loadGroupMembers = async (groupId) => {
    try {
      const response = await fetch(`http://localhost:8000/groups/${groupId}/members`);
      if (response.ok) {
        const members = await response.json();
        setGroupMembers(members.map(member => ({
          id: member.id,
          name: `${member.nombre} ${member.apellido}`,
          email: member.email,
          avatar: member.nombre.charAt(0).toUpperCase(),
        })));
      }
    } catch (error) {
      console.error('Error al cargar miembros:', error);
    }
  };

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
          <Text style={styles.headerSubtitle}>Código: {groupData?.join_link}</Text>
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
              <Text style={styles.emptySubtext}>Sé el primero en unirte al grupo</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Botón flotante para continuar (cuando haya al menos 2 miembros) */}
      {groupMembers.length >= 2 && (
        <View style={styles.floatingButton}>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={() => router.push('/admin/escanear-ticket')}
          >
            <Text style={styles.continueButtonText}>Continuar al Ticket</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}
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
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
  },
  continueButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
});

