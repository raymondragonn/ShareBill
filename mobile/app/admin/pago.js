import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function AdminPagoPage() {
  const handleNFC = () => {
    // Simular proceso de pago con NFC
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pago</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.paymentCard}>
          <View style={styles.iconContainer}>
            <Ionicons name="card" size={64} color="#007AFF" />
          </View>
          
          <Text style={styles.title}>¡Es momento de pagar!</Text>
          <Text style={styles.subtitle}>Acerca tu celular a la terminal</Text>
          
          <View style={styles.nfcContainer}>
            <Ionicons name="radio" size={40} color="#34C759" />
            <Text style={styles.nfcText}>NFC</Text>
          </View>
        </View>

        <View style={styles.instructions}>
          <Text style={styles.instructionTitle}>Instrucciones:</Text>
          <Text style={styles.instructionText}>• Asegúrate de que el NFC esté activado</Text>
          <Text style={styles.instructionText}>• Acerca tu teléfono a la terminal de pago</Text>
          <Text style={styles.instructionText}>• Mantén la posición hasta que aparezca la confirmación</Text>
        </View>

        <TouchableOpacity style={styles.nfcButton} onPress={handleNFC}>
          <Ionicons name="radio" size={24} color="#FFFFFF" />
          <Text style={styles.nfcButtonText}>Iniciar pago NFC</Text>
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
  paymentCard: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    padding: 40,
    borderRadius: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 20,
  },
  nfcContainer: {
    alignItems: 'center',
  },
  nfcText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34C759',
    marginTop: 8,
  },
  instructions: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    width: '100%',
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 5,
  },
  nfcButton: {
    backgroundColor: '#34C759',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    width: '100%',
  },
  nfcButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
