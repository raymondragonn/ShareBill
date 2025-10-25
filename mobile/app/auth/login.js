import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);


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
        backgroundColor: '#F2F2F7',
    },
    header: {
        alignItems: 'center',
        paddingTop: 80,
        paddingBottom: 40,
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
        marginBottom: 30,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 20,
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
    loginButton: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    registerLink: {
        alignItems: 'center',
        marginTop: 20,
    },
    registerText: {
        color: '#007AFF',
        fontSize: 16,
    },
});
