import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView, Animated, Modal } from "react-native";
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef } from 'react';
import { useRouter } from 'expo-router';

export default function AdminQRPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('QR');
  const translateX = useRef(new Animated.Value(0)).current;
  const [groupCode] = useState("MDVL");
  const [qrCode] = useState("1838");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Datos de ejemplo de usuarios que se han unido al grupo
  const groupMembers = [
    {
      id: 1,
      name: "María González",
      email: "maria.gonzalez@email.com",
      joinTime: "Hace 2 horas",
      avatar: "M",
      isAdmin: true
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      email: "carlos.rodriguez@email.com",
      joinTime: "Hace 1 hora",
      avatar: "C",
      isAdmin: false
    },
    {
      id: 3,
      name: "Ana Martínez",
      email: "ana.martinez@email.com",
      joinTime: "Hace 30 minutos",
      avatar: "A",
      isAdmin: false
    },
    {
      id: 4,
      name: "Luis Fernández",
      email: "luis.fernandez@email.com",
      joinTime: "Hace 15 minutos",
      avatar: "L",
      isAdmin: false
    }
  ];

  const handleShare = () => {
    Alert.alert('Compartir', 'Código compartido por WhatsApp');
  };

  const handleContinue = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmGroup = () => {
    setShowConfirmModal(false);
    router.push('/admin/escanear-ticket');
  };

  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
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

  const QRContent = () => (
    <View style={styles.tabContent}>
      <View style={styles.qrContainer}>
        <View style={styles.qrCode}>
          <Ionicons name="qr-code" size={120} color="#1C1C1E" />
        </View>
        <Text style={styles.qrLabel}>Código QR</Text>
      </View>

      <View style={styles.codeContainer}>
        <Text style={styles.codeLabel}>Código:</Text>
        <Text style={styles.codeValue}>{groupCode}</Text>
      </View>

      <View style={styles.qrInfo}>
        <Text style={styles.qrInfoLabel}>QR {qrCode}</Text>
      </View>

      <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
        <Ionicons name="logo-whatsapp" size={24} color="#FFFFFF" />
        <Text style={styles.shareButtonText}>Compartir por WhatsApp</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>CONTINUAR</Text>
      </TouchableOpacity>
    </View>
  );

  const GroupsContent = () => {


    const UserCard = ({ user }) => (
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
            </View>
            <Text style={styles.userEmail}>{user.email}</Text>
            <Text style={styles.joinTime}>{user.joinTime}</Text>
          </View>
        </View>
        <View style={styles.userIndicator}>
          <Ionicons name="chevron-forward" size={20} color="#949494" />
        </View>
      </TouchableOpacity>
    );

    return (
      <ScrollView style={styles.tabContent}>
        <View style={styles.groupsHeader}>
          <Text style={styles.groupsTitle}>Integrantes del Grupo</Text>
          <Text style={styles.memberCount}>{groupMembers.length} miembros</Text>
        </View>
        
        {groupMembers.length > 0 ? (
          <View style={styles.membersList}>
            {groupMembers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </View>
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Crear Grupo</Text>
      </View>

      {/* Barra de navegación con pestañas */}
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

      {/* Modal de confirmación del grupo completo */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelConfirm}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalContainer}>
            <View style={styles.confirmModalHeader}>
              <Ionicons name="checkmark-circle" size={28} color="#25D366" />
              <Text style={styles.confirmModalTitle}>Confirmar Grupo Completo</Text>
            </View>
            
            <Text style={styles.confirmModalMessage}>
              ¿Estás seguro de que el grupo está completo con todos los usuarios que participarán en la división de la cuenta?
            </Text>
            
            <View style={styles.membersPreview}>
              <Text style={styles.membersPreviewTitle}>Integrantes del grupo:</Text>
              {groupMembers.map((user) => (
                <View key={user.id} style={styles.memberPreviewItem}>
                  <View style={styles.memberPreviewAvatar}>
                    <Text style={styles.memberPreviewAvatarText}>{user.avatar}</Text>
                  </View>
                  <View style={styles.memberPreviewInfo}>
                    <Text style={styles.memberPreviewName}>{user.name}</Text>
                    <Text style={styles.memberPreviewEmail}>{user.email}</Text>
                  </View>
                </View>
              ))}
            </View>
            
            <Text style={styles.confirmModalSubtext}>
              Una vez confirmado, podrás proceder a escanear el ticket de compra.
            </Text>
            
            <View style={styles.confirmModalActions}>
              <TouchableOpacity 
                style={styles.confirmModalCancelButton}
                onPress={handleCancelConfirm}
              >
                <Text style={styles.confirmModalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.confirmModalConfirmButton}
                onPress={handleConfirmGroup}
              >
                <Text style={styles.confirmModalConfirmText}>Confirmar y Continuar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    paddingTop: 16,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#949494',
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#003049',
  },
  // Estilos para la barra de navegación
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#949494',
    paddingHorizontal: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 20,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#003049',
  },
  tabText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#949494',
  },
  activeTabText: {
    color: '#003049',
  },
  // Contenedor del contenido
  contentContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  tabContent: {
    flex: 1,
    width: '100%',
  },
  // Estilos para el contenido QR
  qrContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  qrCode: {
    width: 200,
    height: 200,
    backgroundColor: '#f2f3f7',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#003049',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  qrLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#003049',
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f3f7',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#003049',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  codeLabel: {
    fontSize: 16,
    color: '#949494',
    marginRight: 10,
    fontWeight: '500',
  },
  codeValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003049',
  },
  qrInfo: {
    marginBottom: 40,
  },
  qrInfoLabel: {
    fontSize: 16,
    color: '#949494',
    fontWeight: '500',
  },
  shareButton: {
    backgroundColor: '#25D366',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#25D366',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },
  continueButton: {
    backgroundColor: '#669BBC',
    padding: 20,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#003049',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  continueButtonText: {
    color: '#FDF0D5',
    fontSize: 18,
    fontWeight: '700',
  },
  // Estilos para el contenido de grupos
  groupsHeader: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#949494',
  },
  groupsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#003049',
    marginBottom: 4,
  },
  memberCount: {
    fontSize: 16,
    color: '#949494',
    fontWeight: '500',
  },
  membersList: {
    padding: 24,
    gap: 16,
  },
  userCard: {
    backgroundColor: '#f2f3f7',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#003049',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
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
    backgroundColor: '#669BBC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FDF0D5',
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
    color: '#003049',
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
    color: '#949494',
    marginBottom: 2,
    fontWeight: '500',
  },
  joinTime: {
    fontSize: 14,
    color: '#949494',
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
    color: '#003049',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#949494',
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
    borderRadius: 15,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#003049',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#003049',
    marginLeft: 12,
  },
  modalMessage: {
    fontSize: 16,
    color: '#003049',
    lineHeight: 22,
    marginBottom: 8,
  },
  modalSubtext: {
    fontSize: 14,
    color: '#949494',
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#f2f3f7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#949494',
  },
  modalConfirmButton: {
    flex: 1,
    backgroundColor: '#C1121F',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Estilos para el modal de confirmación del grupo
  confirmModalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    shadowColor: '#003049',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  confirmModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#003049',
    marginLeft: 12,
  },
  confirmModalMessage: {
    fontSize: 16,
    color: '#003049',
    lineHeight: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  membersPreview: {
    backgroundColor: '#f2f3f7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  membersPreviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003049',
    marginBottom: 12,
  },
  memberPreviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  memberPreviewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#669BBC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  memberPreviewAvatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FDF0D5',
  },
  memberPreviewInfo: {
    flex: 1,
  },
  memberPreviewName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#003049',
    marginBottom: 2,
  },
  memberPreviewEmail: {
    fontSize: 12,
    color: '#949494',
  },
  confirmModalSubtext: {
    fontSize: 14,
    color: '#949494',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  confirmModalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  confirmModalCancelButton: {
    flex: 1,
    backgroundColor: '#f2f3f7',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmModalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#949494',
  },
  confirmModalConfirmButton: {
    flex: 1,
    backgroundColor: '#25D366',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmModalConfirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
