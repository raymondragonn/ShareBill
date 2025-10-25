import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, Modal, Platform, Dimensions } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function WalletPage() {
  const [cards, setCards] = useState([
    {
      id: 1,
      type: 'credit',
      bank: 'Capital One',
      number: '**** **** **** 1234',
      name: 'Juan Pérez',
      expiry: '12/26',
      isDefault: true,
      cardName: 'VENTURE',
      cardColor: 'blue',
      pattern: 'waves'
    },
    {
      id: 2,
      type: 'credit',
      bank: 'Capital One',
      number: '**** **** **** 5678',
      name: 'Juan Pérez',
      expiry: '08/27',
      isDefault: false,
      cardName: 'QUICKSILVER',
      cardColor: 'gray',
      pattern: 'smooth'
    },
    {
      id: 3,
      type: 'debit',
      bank: 'Capital One',
      number: '**** **** **** 9012',
      name: 'Juan Pérez',
      expiry: '05/28',
      isDefault: false,
      cardName: 'SAVOR',
      cardColor: 'orange',
      pattern: 'smooth'
    }
  ]);

  const [selectedCard, setSelectedCard] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleAddCard = () => {
    Alert.alert(
      'Agregar Tarjeta',
      '¿Deseas agregar una nueva tarjeta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Continuar', onPress: () => {
          // Aquí se podría navegar a una pantalla de agregar tarjeta
          console.log('Navegar a agregar tarjeta');
        }}
      ]
    );
  };

  const handleCardPress = (card) => {
    setSelectedCard(card);
    setShowModal(true);
  };

  const handleSetDefault = () => {
    if (selectedCard) {
      setCards(prevCards => 
        prevCards.map(card => ({
          ...card,
          isDefault: card.id === selectedCard.id
        }))
      );
      setShowModal(false);
      setSelectedCard(null);
    }
  };

  const handleDeleteCard = () => {
    if (selectedCard) {
      Alert.alert(
        'Eliminar Tarjeta',
        `¿Estás seguro de que deseas eliminar la tarjeta ${selectedCard.cardName}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Eliminar', 
            style: 'destructive',
            onPress: () => {
              setCards(prevCards => prevCards.filter(card => card.id !== selectedCard.id));
              setShowModal(false);
              setSelectedCard(null);
            }
          }
        ]
      );
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCard(null);
  };

  const CardComponent = ({ card }) => {
    const isSelected = selectedCard && selectedCard.id === card.id;
    const isOtherSelected = selectedCard && selectedCard.id !== card.id;
    
    return (
      <TouchableOpacity 
        style={[
          styles.card,
          card.cardColor === 'blue' ? styles.blueCard : 
          card.cardColor === 'gray' ? styles.grayCard : 
          card.cardColor === 'orange' ? styles.orangeCard : styles.blueCard,
          card.isDefault && styles.defaultCard,
          isOtherSelected && styles.opaqueCard
        ]}
        onPress={() => handleCardPress(card)}
        activeOpacity={0.8}
      >
      {/* Chip EMV plateado */}
      <View style={styles.chipContainer}>
        <View style={styles.chip} />
      </View>

      {/* Logo de Capital One con swoosh rojo */}
      <View style={styles.bankLogo}>
        <View style={styles.logoContainer}>
          <Text style={styles.bankLogoText}>Capital One</Text>
          <View style={styles.swoosh} />
        </View>
      </View>

      {/* Nombre de la tarjeta debajo del chip */}
      <View style={styles.cardNameContainer}>
        <Text style={styles.cardName}>{card.cardName}</Text>
      </View>

      {/* Número de tarjeta */}
      <View style={styles.cardNumberContainer}>
        <Text style={styles.cardNumber}>{card.number}</Text>
      </View>

      {/* Información del titular y fecha */}
      <View style={styles.cardFooter}>
        <View style={styles.cardHolderInfo}>
          <Text style={styles.cardHolderLabel}>CARD HOLDER</Text>
          <Text style={styles.cardHolderName}>{card.name}</Text>
        </View>
        <View style={styles.expiryInfo}>
          <Text style={styles.expiryLabel}>EXPIRES</Text>
          <Text style={styles.expiryDate}>{card.expiry}</Text>
        </View>
      </View>

      {/* Indicador de tarjeta predeterminada */}
      {card.isDefault && (
        <View style={styles.defaultIndicator}>
          <Ionicons name="star" size={20} color="#FFD700" />
        </View>
      )}
    </TouchableOpacity>
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
          <Text style={styles.title}>Mi Billetera</Text>
          <Text style={styles.subtitle}>Gestiona tus métodos de pago</Text>
        </View>
      </LinearGradient>

      <View style={styles.addCardSection}>
        <TouchableOpacity style={styles.addCardButton} onPress={handleAddCard}>
          <Ionicons name="add-circle" size={24} color="#007AFF" />
          <Text style={styles.addCardText}>Agregar Tarjeta</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.cardsContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Mis Tarjetas</Text>
        
        {cards.map((card) => (
          <CardComponent key={card.id} card={card} />
        ))}

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={20} color="#007AFF" />
            <Text style={styles.infoText}>
              La tarjeta marcada con estrella es tu método de pago predeterminado
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Modal de opciones */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Opciones de Tarjeta</Text>
              <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#8E8E93" />
              </TouchableOpacity>
            </View>

            <View style={styles.cardPreview}>
              <Text style={styles.cardPreviewText}>
                {selectedCard?.cardName} •••• {selectedCard?.number.slice(-4)}
              </Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.setDefaultButton]} 
                onPress={handleSetDefault}
              >
                <Ionicons name="star" size={20} color="#FFD700" />
                <Text style={styles.setDefaultText}>Establecer como Predeterminada</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.deleteButton]} 
                onPress={handleDeleteCard}
              >
                <Ionicons name="trash" size={20} color="#FF3B30" />
                <Text style={styles.deleteText}>Eliminar Tarjeta</Text>
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
    paddingHorizontal: 24,
  },
  title: {
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
  addCardSection: {
    backgroundColor: '#FFFFFF',
    padding: 24,
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
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#1E40AF',
    borderStyle: 'dashed',
  },
  addCardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
    marginLeft: 8,
  },
  cardsContainer: {
    flex: 1,
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
  },
  card: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    aspectRatio: 1.6,
    position: 'relative',
    overflow: 'hidden',
  },
  blueCard: {
    backgroundColor: '#1E3A8A', // Azul oscuro como en las tarjetas reales
  },
  grayCard: {
    backgroundColor: '#374151', // Gris oscuro con gradiente sutil
  },
  orangeCard: {
    backgroundColor: '#DC2626', // Naranja rojizo como Savor
  },
  defaultCard: {
    borderColor: '#FFD700',
    borderWidth: 3,
    shadowColor: '#FFD700',
    shadowOpacity: 0.4,
  },
  chipContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  chip: {
    width: 35,
    height: 25,
    backgroundColor: '#C0C0C0', // Plateado como en las tarjetas reales
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#A0A0A0',
  },
  bankLogo: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  logoContainer: {
    alignItems: 'flex-end',
  },
  bankLogoText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  swoosh: {
    width: 30,
    height: 3,
    backgroundColor: '#EF4444', // Rojo como el swoosh de Capital One
    borderRadius: 2,
    marginTop: 2,
  },
  cardNameContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  cardName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  cardNumberContainer: {
    position: 'absolute',
    top: '50%',
    left: 20,
    right: 20,
    transform: [{ translateY: -15 }],
  },
  cardNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 3,
    textAlign: 'center',
  },
  cardFooter: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardHolderInfo: {
    flex: 1,
  },
  cardHolderLabel: {
    fontSize: 9,
    color: '#E5E7EB',
    letterSpacing: 1,
    marginBottom: 2,
  },
  cardHolderName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  expiryInfo: {
    alignItems: 'flex-end',
  },
  expiryLabel: {
    fontSize: 9,
    color: '#E5E7EB',
    letterSpacing: 1,
    marginBottom: 2,
  },
  expiryDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  defaultIndicator: {
    position: 'absolute',
    top: 20,
    left: '50%',
    transform: [{ translateX: -10 }],
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 15,
    padding: 4,
  },
  opaqueCard: {
    opacity: 0.3,
  },
  // Estilos del modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  closeButton: {
    padding: 4,
  },
  cardPreview: {
    backgroundColor: '#F2F2F7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  cardPreviewText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  modalActions: {
    gap: 12,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  setDefaultButton: {
    backgroundColor: '#FFF8DC',
    borderColor: '#FFD700',
  },
  deleteButton: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FF3B30',
  },
  setDefaultText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#B8860B',
    marginLeft: 8,
  },
  deleteText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
    marginLeft: 8,
  },
  infoSection: {
    marginTop: 20,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#1976D2',
    marginLeft: 8,
    flex: 1,
  },
});
