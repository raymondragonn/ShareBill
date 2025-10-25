import { StyleSheet, Text, View, TouchableOpacity, Alert, Platform, Dimensions } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function ScanQRPage() {
  const router = useRouter();

  const handleScan = () => {
    Alert.alert('Escanear', 'Funcionalidad de escaneo de QR en desarrollo');
  };

  const handleManualCode = () => {
    Alert.alert('Código Manual', 'Ingresar código de grupo manualmente');
  };

  return (
    <View style={styles.container}>
      {/* Header con gradiente bancario */}
      <LinearGradient
        colors={['#1e3c72', '#2a5298', '#3b82f6']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Unirse a Grupo</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.scannerContainer}>
          <View style={styles.scannerFrame}>
            <View style={styles.qrIconContainer}>
              <Ionicons name="qr-code" size={80} color="#1E40AF" />
            </View>
          </View>
          <Text style={styles.scannerLabel}>Escanea el código QR del grupo</Text>
          <Text style={styles.scannerSubtext}>
            Coloca el código QR dentro del marco para unirte al grupo
          </Text>
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>O</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.manualButton} onPress={handleManualCode}>
          <View style={styles.buttonIconContainer}>
            <Ionicons name="keypad" size={20} color="#1E40AF" />
          </View>
          <Text style={styles.manualButtonText}>Ingresar código manualmente</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
          <View style={styles.buttonIconContainer}>
            <Ionicons name="camera" size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.scanButtonText}>ESCANEAR CÓDIGO QR</Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom: 20,
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
  
  // Contenido
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  scannerContainer: {
    alignItems: 'center',
    marginBottom: 48,
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
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
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
  manualButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  buttonIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  manualButtonText: {
    color: '#1E40AF',
    fontSize: 16,
    fontWeight: '600',
  },
  scanButton: {
    backgroundColor: '#1E40AF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 16,
    width: '100%',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
