import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useState } from "react";
import { Ionicons } from '@expo/vector-icons';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    postalCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleNext = () => {
    if (step === 1) {
      if (!formData.nombre || !formData.apellido || !formData.email || !formData.password) {
        Alert.alert('Error', 'Por favor completa todos los campos');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Las contraseñas no coinciden');
        return;
      }
      setStep(2);
    } else {
      if (!formData.cardNumber || !formData.expiryDate || !formData.cvc || !formData.postalCode) {
        Alert.alert('Error', 'Por favor completa todos los campos de pago');
        return;
      }
      Alert.alert('Éxito', 'Registro completado');
    }
  };

  const renderStep1 = () => (
    <View style={styles.form}>
      <Text style={styles.formTitle}>Crear Cuenta</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Tu nombre"
          value={formData.nombre}
          onChangeText={(text) => setFormData({...formData, nombre: text})}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Apellido</Text>
        <TextInput
          style={styles.input}
          placeholder="Tu apellido"
          value={formData.apellido}
          onChangeText={(text) => setFormData({...formData, apellido: text})}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Correo</Text>
        <TextInput
          style={styles.input}
          placeholder="tu@email.com"
          value={formData.email}
          onChangeText={(text) => setFormData({...formData, email: text})}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contraseña</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Tu contraseña"
            value={formData.password}
            onChangeText={(text) => setFormData({...formData, password: text})}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity 
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons 
              name={showPassword ? "eye-off" : "eye"} 
              size={20} 
              color="#8E8E93" 
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirmar Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirma tu contraseña"
          value={formData.confirmPassword}
          onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
          secureTextEntry={true}
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.form}>
      <Text style={styles.formTitle}>Información de Pago</Text>
      <Text style={styles.stepDescription}>Agrega tu método de pago para completar el registro</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>No. Tarjeta</Text>
        <TextInput
          style={styles.input}
          placeholder="1234 5678 9012 3456"
          value={formData.cardNumber}
          onChangeText={(text) => setFormData({...formData, cardNumber: text})}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.rowContainer}>
        <View style={styles.halfInput}>
          <Text style={styles.label}>Fecha vencimiento</Text>
          <TextInput
            style={styles.input}
            placeholder="MM/AA"
            value={formData.expiryDate}
            onChangeText={(text) => setFormData({...formData, expiryDate: text})}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.halfInput}>
          <Text style={styles.label}>CVC</Text>
          <TextInput
            style={styles.input}
            placeholder="123"
            value={formData.cvc}
            onChangeText={(text) => setFormData({...formData, cvc: text})}
            keyboardType="numeric"
            secureTextEntry={true}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>CP</Text>
        <TextInput
          style={styles.input}
          placeholder="12345"
          value={formData.postalCode}
          onChangeText={(text) => setFormData({...formData, postalCode: text})}
          keyboardType="numeric"
        />
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ShareBill</Text>
        <Text style={styles.subtitle}>Comparte gastos fácilmente</Text>
      </View>

      {step === 1 ? renderStep1() : renderStep2()}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {step === 1 ? 'Continuar' : 'Registrarse'}
          </Text>
        </TouchableOpacity>

        {step === 2 && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setStep(1)}
          >
            <Text style={styles.backButtonText}>Atrás</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
  form: {
    flex: 1,
    padding: 20,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 10,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  halfInput: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
  },
  eyeButton: {
    padding: 16,
  },
  buttonContainer: {
    padding: 20,
  },
  nextButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    alignItems: 'center',
    marginTop: 15,
  },
  backButtonText: {
    color: '#8E8E93',
    fontSize: 16,
  },
});
