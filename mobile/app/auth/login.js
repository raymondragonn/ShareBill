import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Tu contraseña"
              value={password}
              onChangeText={setPassword}
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

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                Alert.alert("Error", data.detail || "Credenciales inválidas");
                return;
            }

            await AsyncStorage.setItem("user", JSON.stringify(data));

            Alert.alert("Bienvenido", `Hola ${data.nombre}`);
            router.replace("/home"); // ✅ redirige al Home

        } catch (error) {
            console.error(error);
            Alert.alert("Error", "No se pudo conectar con el servidor");
        }
    };

    const handleRegister = () => {
        router.push('/auth/register');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>ShareBill</Text>
                <Text style={styles.subtitle}>Comparte gastos fácilmente</Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.formTitle}>Iniciar Sesión</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Correo electrónico</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="tu@email.com"
                        value={email}
                        onChangeText={setEmail}
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
                            value={password}
                            onChangeText={setPassword}
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

                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.registerLink} onPress={handleRegister}>
                    <Text style={styles.registerText}>¿No tienes cuenta? Regístrate</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF0D5',
  },
  header: {
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 50,
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
    marginBottom: 40,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 24,
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
  loginButton: {
    backgroundColor: '#C1121F',
    padding: 20,
    borderRadius: 28,
    alignItems: 'center',
    marginTop: 30,
    shadowColor: '#780000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  loginButtonText: {
    color: '#FDF0D5',
    fontSize: 20,
    fontWeight: '700',
  },
  registerLink: {
    alignItems: 'center',
    marginTop: 30,
  },
  registerText: {
    color: '#003049',
    fontSize: 18,
    fontWeight: '600',
  },
});
