import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView, Animated, Modal, Platform, Dimensions, Image, ActivityIndicator, Share } from "react-native";
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from 'expo-clipboard';
import { API_URL } from '../../config';

export default function AdminQRPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('QR');
  const translateX = useRef(new Animated.Value(0)).current;
  const [groupData, setGroupData] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const animatedMembersRef = useRef(new Set());

  useEffect(() => {
    loadGroupData();
    // Actualizar miembros cada 5 segundos
    const interval = setInterval(() => {
      if (groupData?.id) {
        loadGroupMembers(groupData.id);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [groupData?.id]);

  const loadGroupData = async () => {
    try {
      const groupJSON = await AsyncStorage.getItem('currentGroup');
      if (groupJSON) {
        const group = JSON.parse(groupJSON);
        setGroupData(group);
        // Cargar miembros inmediatamente después de establecer los datos del grupo
        await loadGroupMembers(group.id);
      } else {
        Alert.alert('Error', 'No se encontraron datos del grupo');
      }
    } catch (error) {
      console.error('Error al cargar grupo:', error);
      Alert.alert('Error', 'Error al cargar la información del grupo');
    } finally {
      setLoading(false);
    }
  };

  const loadGroupMembers = async (groupId) => {
    try {
      const response = await fetch(`${API_URL}/groups/${groupId}/members`);
      if (response.ok) {
        const members = await response.json();
        setGroupMembers(members.map(member => ({
          id: member.id,
          name: `${member.nombre} ${member.apellido}`,
          email: member.email,
          avatar: member.nombre.charAt(0).toUpperCase(),
          isAdmin: member.id === groupData?.admin_id
        })));
      } else {
        console.warn('Error al cargar miembros: Respuesta no exitosa');
        // Si no hay miembros en el backend, mostrar al admin como miembro predeterminado
        if (groupData?.admin_id) {
          const currentUser = await AsyncStorage.getItem('user');
          if (currentUser) {
            const user = JSON.parse(currentUser);
            setGroupMembers([{
              id: user.id,
              name: `${user.nombre} ${user.apellido}`,
              email: user.email,
              avatar: user.nombre.charAt(0).toUpperCase(),
              isAdmin: true
            }]);
          }
        }
      }
    } catch (error) {
      console.error('Error al cargar miembros:', error);
      // Si hay error de red, mostrar al admin como miembro predeterminado
      if (groupData?.admin_id) {
        try {
          const currentUser = await AsyncStorage.getItem('user');
          if (currentUser) {
            const user = JSON.parse(currentUser);
            setGroupMembers([{
              id: user.id,
              name: `${user.nombre} ${user.apellido}`,
              email: user.email,
              avatar: user.nombre.charAt(0).toUpperCase(),
              isAdmin: true
            }]);
          }
        } catch (storageError) {
          console.error('Error al cargar usuario desde storage:', storageError);
        }
      }
    }
  };

  const handleShare = async () => {
    if (groupData) {
      // Crear link de invitación usando la IP local
      const baseUrl = Platform.OS === 'web' ? 'http://localhost:8081' : `http://${API_URL.split('//')[1].split(':')[0]}:8081`;
      const inviteLink = `${baseUrl}/auth/register?groupCode=${groupData.join_link}`;
      
      try {
        // Copiar directamente al portapapeles
        await Clipboard.setStringAsync(inviteLink);
        Alert.alert('✓ Link copiado', 'Ahora puedes pegarlo en WhatsApp');
      } catch (error) {
        Alert.alert('Error', 'No se pudo copiar el link');
      }
    }
  };


  const handleUserPress = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      console.log('Eliminar usuario:', selectedUser.id);
      // Aquí se implementaría la lógica para eliminar el usuario
      Alert.alert('Éxito', `${selectedUser.name} ha sido eliminado del grupo`);
      setShowDeleteModal(false);
      setSelectedUser(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  const switchToTab = (tab) => {
    setActiveTab(tab);
    const toValue = tab === 'QR' ? 0 : -1;
    Animated.spring(translateX, {
      toValue,
      useNativeDriver: true,
    }).start();
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX, velocityX } = event.nativeEvent;
      
      if (Math.abs(translationX) > 50 || Math.abs(velocityX) > 500) {
        if (translationX > 0 && activeTab === 'GRUPO') {
          switchToTab('QR');
        } else if (translationX < 0 && activeTab === 'QR') {
          switchToTab('GRUPO');
        } else {
          Animated.spring(translateX, {
            toValue: activeTab === 'QR' ? 0 : -1,
            useNativeDriver: true,
          }).start();
        }
      } else {
        Animated.spring(translateX, {
          toValue: activeTab === 'QR' ? 0 : -1,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const QRContent = () => {
    if (loading || !groupData) {
      return (
        <View style={styles.content}>
          <ActivityIndicator size="large" color="#1E40AF" />
          <Text style={styles.loadingText}>Cargando información del grupo...</Text>
        </View>
      );
    }

    return (
      <ScrollView 
        style={styles.qrScrollView} 
        contentContainerStyle={styles.qrScrollContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        <View style={styles.scannerContainer}>
          <View style={styles.scannerFrame}>
            {groupData.qr_code ? (
              <Image 
                source={{ uri: groupData.qr_code }} 
                style={styles.qrImage}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.qrIconContainer}>
                <Ionicons name="qr-code" size={80} color="#1E40AF" />
              </View>
            )}
          </View>
          <Text style={styles.scannerLabel}>Código QR del Grupo</Text>
          <Text style={styles.scannerSubtext}>
            Comparte este código QR para que otros se unan al grupo
          </Text>
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>O</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.codeContainer}>
          <View style={styles.codeInfo}>
            <Text style={styles.codeLabel}>Código:</Text>
            <Text style={styles.codeValue}>{groupData.join_link}</Text>
          </View>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Ionicons name="logo-whatsapp" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

      </ScrollView>
    );
  };

  const GroupsContent = () => {


    const AnimatedUserCard = ({ user, index }) => {
      const isNewMember = !animatedMembersRef.current.has(user.id);
      const fadeAnim = useRef(new Animated.Value(isNewMember ? 0 : 1)).current;
      const slideAnim = useRef(new Animated.Value(isNewMember ? -50 : 0)).current;
      const scaleAnim = useRef(new Animated.Value(isNewMember ? 0.8 : 1)).current;

      useEffect(() => {
        // Solo animar si es un nuevo miembro
        if (isNewMember) {
          animatedMembersRef.current.add(user.id);
          
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 500,
              delay: index * 100,
              useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
              toValue: 0,
              tension: 50,
              friction: 7,
              delay: index * 100,
              useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
              toValue: 1,
              tension: 50,
              friction: 7,
              delay: index * 100,
              useNativeDriver: true,
            }),
          ]).start();
        }
      }, [user.id]);

      return (
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [
              { translateX: slideAnim },
              { scale: scaleAnim }
            ],
          }}
        >
          <TouchableOpacity 
            style={styles.userCard}
            onPress={() => handleUserPress(user)}
            activeOpacity={0.7}
          >
            <View style={styles.userInfo}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{user.avatar}</Text>
              </View>
              <View style={styles.userDetails}>
                <View style={styles.nameContainer}>
                  <Text style={styles.userName}>{user.name}</Text>
                  {user.isAdmin && (
                    <View style={styles.adminBadge}>
                      <Ionicons name="shield-checkmark" size={12} color="#C1121F" />
                      <Text style={styles.adminText}>Admin</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Text style={styles.joinTime}>{user.joinTime || 'Administrador'}</Text>
              </View>
            </View>
            <View style={styles.userIndicator}>
              <Ionicons name="chevron-forward" size={20} color="#949494" />
            </View>
          </TouchableOpacity>
        </Animated.View>
      );
    };

    return (
      <ScrollView style={styles.tabContent}>
        <View style={styles.groupsHeader}>
          <Text style={styles.groupsTitle}>Integrantes del Grupo</Text>
          <Text style={styles.memberCount}>{groupMembers.length} miembros</Text>
        </View>
        
        {groupMembers.length > 0 ? (
          <>
            <View style={styles.membersList}>
              {groupMembers.map((user, index) => (
                <AnimatedUserCard key={user.id} user={user} index={index} />
              ))}
            </View>
            
            <TouchableOpacity 
              style={styles.continueButton}
              onPress={() => router.push('/admin/escanear-ticket')}
            >
              <Ionicons name="scan" size={20} color="#FFFFFF" />
              <Text style={styles.continueButtonText}>ESCANEAR TICKET</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color="#8E8E93" />
            <Text style={styles.emptyTitle}>No hay miembros aún</Text>
            <Text style={styles.emptySubtitle}>Comparte el código QR para que otros se unan al grupo</Text>
          </View>
        )}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header con gradiente bancario */}
      <LinearGradient
        colors={['#1e3c72', '#2a5298', '#3b82f6']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{groupData ? groupData.name : 'Crear Grupo'}</Text>
        </View>
      </LinearGradient>

      {/* Barra de navegación con pestañas flotante */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'QR' && styles.activeTab]}
          onPress={() => switchToTab('QR')}
        >
          <Text style={[styles.tabText, activeTab === 'QR' && styles.activeTabText]}>QR</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'GRUPO' && styles.activeTab]}
          onPress={() => switchToTab('GRUPO')}
        >
          <Text style={[styles.tabText, activeTab === 'GRUPO' && styles.activeTabText]}>GRUPO</Text>
        </TouchableOpacity>
      </View>

      {/* Contenido con swipe */}
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View style={[styles.contentContainer, { transform: [{ translateX }] }]}>
          <View style={styles.content}>
            {activeTab === 'QR' ? <QRContent /> : <GroupsContent />}
          </View>
        </Animated.View>
      </PanGestureHandler>

      {/* Modal de confirmación para eliminar usuario */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Ionicons name="warning" size={24} color="#C1121F" />
              <Text style={styles.modalTitle}>Eliminar del grupo</Text>
            </View>
            
            <Text style={styles.modalMessage}>
              ¿Estás seguro de que quieres eliminar a {selectedUser?.name} del grupo?
            </Text>
            
            <Text style={styles.modalSubtext}>
              Esta acción no se puede deshacer.
            </Text>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={handleCancelDelete}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalConfirmButton}
                onPress={handleConfirmDelete}
              >
                <Text style={styles.modalConfirmText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  
  // Barra de navegación flotante
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginTop: -20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 20,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#1E40AF',
    backgroundColor: '#F8FAFC',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#1E40AF',
    fontWeight: '700',
  },
  // Contenedor del contenido
  contentContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  tabContent: {
    flex: 1,
    width: '100%',
  },
  // Estilos para carga
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  // Estilos para el contenido QR (similar a scan-qr.js)
  qrScrollView: {
    flex: 1,
    width: '100%',
  },
  qrScrollContent: {
    alignItems: 'center',
    padding: 24,
    paddingBottom: 40, // Espacio adicional en la parte inferior para Android
    minHeight: '100%', // Asegura que el contenido ocupe al menos toda la altura
  },
  groupNameContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  groupNameLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    fontWeight: '500',
  },
  groupNameValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E40AF',
    textAlign: 'center',
  },
  scannerContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  scannerFrame: {
    width: 280,
    height: 280,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 3,
    borderColor: '#1E40AF',
    borderStyle: 'dashed',
  },
  qrImage: {
    width: 250,
    height: 250,
  },
  qrIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  scannerSubtext: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
    marginBottom: 24,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E40AF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginTop: 20,
    marginHorizontal: 24,
    marginBottom: 20,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    gap: 10,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 20,
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  codeInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeLabel: {
    fontSize: 16,
    color: '#6B7280',
    marginRight: 10,
    fontWeight: '500',
  },
  codeValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E40AF',
  },
  shareButton: {
    backgroundColor: '#25D366',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    minWidth: 48,
    minHeight: 48,
  },
  // Estilos para el contenido de grupos
  groupsHeader: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  groupsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  memberCount: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  membersList: {
    padding: 24,
    gap: 16,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F3F4F6',
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
    backgroundColor: '#1E40AF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userDetails: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginRight: 8,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF0D5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  adminText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#C1121F',
    marginLeft: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 2,
    fontWeight: '500',
  },
  joinTime: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  userIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
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
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  // Estilos del modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 12,
  },
  modalMessage: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 22,
    marginBottom: 8,
  },
  modalSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  modalConfirmButton: {
    flex: 1,
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
