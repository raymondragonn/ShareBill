import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

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
      router.push('/home');
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
              size={24} 
              color="#669BBC" 
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
    backgroundColor: '#FDF0D5',
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#003049',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#669BBC',
    fontWeight: '500',
  },
  form: {
    flex: 1,
    padding: 24,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#003049',
    marginBottom: 16,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 18,
    color: '#669BBC',
    textAlign: 'center',
    marginBottom: 40,
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 24,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  halfInput: {
    flex: 1,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003049',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#FDF0D5',
    borderWidth: 3,
    borderColor: '#669BBC',
    borderRadius: 20,
    padding: 20,
    fontSize: 18,
    color: '#003049',
    fontWeight: '500',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF0D5',
    borderWidth: 3,
    borderColor: '#669BBC',
    borderRadius: 20,
  },
  passwordInput: {
    flex: 1,
    padding: 20,
    fontSize: 18,
    color: '#003049',
    fontWeight: '500',
  },
  eyeButton: {
    padding: 20,
  },
  buttonContainer: {
    padding: 24,
  },
  nextButton: {
    backgroundColor: '#C1121F',
    padding: 20,
    borderRadius: 28,
    alignItems: 'center',
    shadowColor: '#780000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  nextButtonText: {
    color: '#FDF0D5',
    fontSize: 20,
    fontWeight: '700',
  },
  backButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    color: '#669BBC',
    fontSize: 18,
    fontWeight: '600',
  },
});
