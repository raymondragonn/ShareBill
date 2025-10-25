import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView, Animated } from "react-native";
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef } from 'react';

export default function AdminQRPage() {
  const [activeTab, setActiveTab] = useState('QR');
  const translateX = useRef(new Animated.Value(0)).current;
  const [groupCode] = useState("MDVL");
  const [qrCode] = useState("1838");

  const handleShare = () => {
    Alert.alert('Compartir', 'Código compartido por WhatsApp');
  };

  const handleContinue = () => {
    Alert.alert('Continuar', 'Navegando a integrantes');
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

  const GroupsContent = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.emptyState}>
        <Ionicons name="people-outline" size={64} color="#8E8E93" />
        <Text style={styles.emptyTitle}>No hay grupos aún</Text>
        <Text style={styles.emptySubtitle}>Crea tu primer grupo para compartir gastos</Text>
        <TouchableOpacity style={styles.createButton}>
          <Text style={styles.createButtonText}>Crear grupo</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crear Grupo</Text>
        <View style={styles.placeholder} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  // Estilos para la barra de navegación
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
  },
  activeTabText: {
    color: '#007AFF',
  },
  // Contenedor del contenido
  contentContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  qrLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  codeLabel: {
    fontSize: 16,
    color: '#8E8E93',
    marginRight: 10,
  },
  codeValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  qrInfo: {
    marginBottom: 40,
  },
  qrInfoLabel: {
    fontSize: 16,
    color: '#8E8E93',
  },
  shareButton: {
    backgroundColor: '#25D366',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    width: '100%',
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  continueButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Estilos para el contenido de grupos
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
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#669BBC',
    paddingHorizontal: 24,
    paddingVertical: 12,
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
  createButtonText: {
    color: '#FDF0D5',
    fontSize: 16,
    fontWeight: '700',
  },
});
