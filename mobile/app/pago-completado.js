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
            <Ionicons name="terminal" size={20} color="#949494" />
            <Text style={styles.detailText}>TERMINAL</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="time" size={20} color="#949494" />
            <Text style={styles.detailText}>Espera al Admin</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="radio" size={20} color="#949494" />
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
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  successIcon: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#003049',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#949494',
    textAlign: 'center',
    marginBottom: 40,
  },
  details: {
    backgroundColor: '#f2f3f7',
    padding: 24,
    borderRadius: 15,
    marginBottom: 30,
    width: '100%',
    shadowColor: '#003049',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#949494',
    marginLeft: 12,
    fontWeight: '500',
  },
  summary: {
    backgroundColor: '#f2f3f7',
    padding: 24,
    borderRadius: 15,
    marginBottom: 30,
    width: '100%',
    shadowColor: '#003049',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#003049',
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
    color: '#949494',
    fontWeight: '500',
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#003049',
  },
  summaryMethod: {
    fontSize: 16,
    fontWeight: '700',
    color: '#669BBC',
  },
  summaryDate: {
    fontSize: 16,
    fontWeight: '700',
    color: '#003049',
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
});
