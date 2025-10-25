import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function AdminQRPage() {
  const groupCode = "MDVL";
  const qrCode = "1838";

  const handleShare = () => {
    Alert.alert('Compartir', 'Código compartido por WhatsApp');
  };

  const handleContinue = () => {
    Alert.alert('Continuar', 'Navegando a integrantes');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crear Grupo</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
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
});
