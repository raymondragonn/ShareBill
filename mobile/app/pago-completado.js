import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function PagoCompletadoPage() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={80} color="#34C759" />
        </View>
        
        <Text style={styles.title}>¡PAGO COMPLETADO!</Text>
        <Text style={styles.subtitle}>El pago se ha procesado exitosamente</Text>
        
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Ionicons name="terminal" size={20} color="#8E8E93" />
            <Text style={styles.detailText}>TERMINAL</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="time" size={20} color="#8E8E93" />
            <Text style={styles.detailText}>Espera al Admin</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="radio" size={20} color="#8E8E93" />
            <Text style={styles.detailText}>Pago con NFC</Text>
          </View>
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Resumen del pago</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total pagado:</Text>
            <Text style={styles.summaryAmount}>$45.50</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Método:</Text>
            <Text style={styles.summaryMethod}>NFC</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Fecha:</Text>
            <Text style={styles.summaryDate}>Hoy, 14:30</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.continueButton}>
          <Text style={styles.continueButtonText}>Continuar</Text>
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  successIcon: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 40,
  },
  details: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#8E8E93',
    marginLeft: 12,
  },
  summary: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 15,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#8E8E93',
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  summaryMethod: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34C759',
  },
  summaryDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
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
    fontWeight: '600',
  },
});
