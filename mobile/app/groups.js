import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform, Dimensions, Modal } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function GroupsPage() {
  const router = useRouter();
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
    }
  ];


  const handleRemoveUser = (userId) => {
    // Aquí se implementaría la lógica para remover un usuario
    console.log('Remover usuario:', userId);
  };

  const handleMakeAdmin = (userId) => {
    // Aquí se implementaría la lógica para hacer admin a un usuario
    console.log('Hacer admin:', userId);
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

  const UserCard = ({ user }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{user.avatar}</Text>
        </View>
        <View style={styles.userDetails}>
          <View style={styles.nameContainer}>
            <Text style={styles.userName}>{user.name}</Text>
            {user.isAdmin && (
              <View style={styles.adminBadge}>
                <Ionicons name="star" size={12} color="#FFD700" />
                <Text style={styles.adminText}>Admin</Text>
              </View>
            )}
          </View>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.joinTime}>{user.joinTime}</Text>
        </View>
      </View>
      <View style={styles.userActions}>
        {!user.isAdmin && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleMakeAdmin(user.id)}
          >
            <Ionicons name="star-outline" size={16} color="#007AFF" />
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleRemoveUser(user.id)}
        >
          <Ionicons name="trash-outline" size={16} color="#FF3B30" />
        </TouchableOpacity>
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
          <View style={styles.headerInfo}>
            <Text style={styles.title}>Integrantes del grupo</Text>
            <Text style={styles.memberCount}>{groupMembers.length} miembros</Text>
          </View>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
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
        
        {groupMembers.length > 0 && (
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <View style={styles.buttonIconContainer}>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.continueButtonText}>CONTINUAR</Text>
          </TouchableOpacity>
        )}
      </View>

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  memberCount: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  settingsButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Contenido
  content: {
    flex: 1,
    padding: 24,
  },
  membersList: {
    // gap: 16, // No compatible con todas las versiones
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16, // Espacio entre tarjetas
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
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1E40AF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarText: {
    fontSize: 20,
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
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 12,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  adminText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D97706',
    marginLeft: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  joinTime: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  userActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 24,
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },
  
  // Estilos para el botón continuar
  continueButton: {
    backgroundColor: '#1E40AF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 16,
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  
  // Estilos para el modal de confirmación
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  confirmModalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  confirmModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 12,
  },
  confirmModalMessage: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  membersPreview: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  membersPreviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
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
    backgroundColor: '#1E40AF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  memberPreviewAvatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  memberPreviewInfo: {
    flex: 1,
  },
  memberPreviewName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  memberPreviewEmail: {
    fontSize: 12,
    color: '#6B7280',
  },
  confirmModalSubtext: {
    fontSize: 14,
    color: '#6B7280',
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
    backgroundColor: '#F9FAFB',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  confirmModalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  confirmModalConfirmButton: {
    flex: 1,
    backgroundColor: '#25D366',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  confirmModalConfirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
