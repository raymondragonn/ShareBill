import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView, Platform, Dimensions } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RegisterPage() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [step, setStep] = useState(1);
    const [groupCode, setGroupCode] = useState(null);

    useEffect(() => {
        // Detectar si viene de un link de invitación
        console.log('🔍 Params recibidos:', params);
        console.log('🔍 GroupCode en params:', params.groupCode);
        if (params.groupCode) {
            console.log('✅ GroupCode detectado:', params.groupCode);
            setGroupCode(params.groupCode);
        } else {
            console.log('❌ No se detectó groupCode en params');
        }
    }, [params]);
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

    const handleNext = async () => {
        if (step === 1) {
            if (!formData.nombre || !formData.apellido || !formData.email || !formData.password) {
                Alert.alert('Error', 'Por favor completa todos los campos');
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                Alert.alert('Error', 'Las contraseñas no coinciden');
                return;
            }

            try {
                const response = await fetch("http://localhost:8000/users/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        nombre: formData.nombre,
                        apellido: formData.apellido,
                        email: formData.email,
                        password: formData.password,
                    }),
                });

                if (!response.ok) {
                    const data = await response.json();
                    Alert.alert("Error", data.detail || "Error al registrarse");
                    return;
                }

                const data = await response.json();
                console.log('👤 Usuario registrado:', data);
                
                // Guardar usuario en AsyncStorage
                await AsyncStorage.setItem("user", JSON.stringify(data));
                
                // Si viene de un link de invitación, unirlo al grupo y redirigir
                console.log('🔑 GroupCode actual:', groupCode);
                if (groupCode) {
                    console.log('🎯 Entrando en lógica de grupo...');
                    try {
                        console.log('Intentando unirse al grupo con código:', groupCode, 'user_id:', data.id);
                        const joinResponse = await fetch(`http://localhost:8000/groups/join-by-code?code=${groupCode}&user_id=${data.id}`, {
                            method: 'POST'
                        });
                        
                        const joinData = await joinResponse.json();
                        console.log('Respuesta del servidor:', joinResponse.status, joinData);
                        
                        if (joinResponse.ok) {
                            Alert.alert("¡Bienvenido!", `Te has unido al grupo exitosamente`);
                        } else {
                            console.error('Error al unirse:', joinData);
                            Alert.alert("Aviso", "Ya estás en este grupo o hubo un problema al unirte");
                        }
                        
                        // Redirigir SIEMPRE a waiting room si hay groupCode
                        console.log('🚀 Redirigiendo a waiting room con código:', groupCode);
                        router.replace(`/user/waiting-room?code=${groupCode}`);
                        return;
                        
                    } catch (error) {
                        console.error('Error al unirse al grupo:', error);
                        Alert.alert("Error", "No se pudo conectar con el servidor del grupo");
                        // Aún así redirigir a waiting room
                        console.log('🚀 Redirigiendo a waiting room (con error) con código:', groupCode);
                        router.replace(`/user/waiting-room?code=${groupCode}`);
                        return;
                    }
                }
                
                console.log('⚠️ No hay groupCode, redirigiendo a home');
                Alert.alert("Éxito", `Usuario ${data.nombre} registrado`);
                router.replace("/home");

            } catch (error) {
                Alert.alert("Error", "No se pudo conectar con el servidor");
            }

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
                    onChangeText={(text) => setFormData({ ...formData, nombre: text })}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Apellido</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Tu apellido"
                    value={formData.apellido}
                    onChangeText={(text) => setFormData({ ...formData, apellido: text })}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Correo</Text>
                <TextInput
                    style={styles.input}
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
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
                        onChangeText={(text) => setFormData({ ...formData, password: text })}
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
                    onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                    secureTextEntry={true}
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                    <Text style={styles.nextButtonText}>
                        {step === 1 ? "Continuar" : "Registrarse"}
                    </Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.loginRedirect}
                onPress={() => router.replace("/auth/login")}
            >
                <Text style={styles.loginRedirectText}>
                    ¿Ya tienes una cuenta?{" "}
                    <Text style={styles.loginRedirectLink}>Inicia sesión</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );

    const renderStep2 = () => {
        const handleRegisterPayment = async () => {
            if (!formData.cardNumber || !formData.expiryDate || !formData.cvc || !formData.postalCode) {
                Alert.alert('Error', 'Por favor completa todos los campos de pago');
                return;
            }

            try {
                const response = await fetch("http://localhost:8000/payments/add", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        card_number: formData.cardNumber,
                        expiry_date: formData.expiryDate,
                        cvc: formData.cvc,
                        postal_code: formData.postalCode,
                        user_id: 1,
                    }),
                });

                if (!response.ok) {
                    const data = await response.json();
                    Alert.alert("Error", data.detail || "No se pudo registrar el método de pago");
                    return;
                }

                const data = await response.json();
                Alert.alert("Éxito", "Método de pago registrado correctamente");
                router.replace("/home");

            } catch (error) {
                console.error("Error al conectar con el servidor:", error);
                Alert.alert("Error", "No se pudo conectar con el servidor");
            }
        };

        return (
            <View style={styles.form}>
                <Text style={styles.formTitle}>Información de Pago</Text>
                <Text style={styles.stepDescription}>
                    Agrega tu método de pago para completar el registro
                </Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>No. Tarjeta</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChangeText={(text) => setFormData({ ...formData, cardNumber: text })}
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
                            onChangeText={(text) => setFormData({ ...formData, expiryDate: text })}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.halfInput}>
                        <Text style={styles.label}>CVC</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="123"
                            value={formData.cvc}
                            onChangeText={(text) => setFormData({ ...formData, cvc: text })}
                            keyboardType="numeric"
                            secureTextEntry={true}
                        />
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Código Postal</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="12345"
                        value={formData.postalCode}
                        onChangeText={(text) => setFormData({ ...formData, postalCode: text })}
                        keyboardType="numeric"
                    />
                </View>

                <TouchableOpacity style={styles.nextButton} onPress={handleRegisterPayment}>
                    <Text style={styles.nextButtonText}>Registrar Pago</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
                    <Text style={styles.backButtonText}>Atrás</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header con gradiente bancario */}
            <LinearGradient
                colors={['#1e3c72', '#2a5298', '#3b82f6']}
                style={styles.headerGradient}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>ShareBill</Text>
                    <Text style={styles.subtitle}>Comparte gastos fácilmente</Text>
                </View>
            </LinearGradient>

            {step === 1 ? renderStep1() : renderStep2()}
        </ScrollView>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F8FAFC" },
    
    // Header con gradiente
    headerGradient: {
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 60,
    },
    header: { 
        alignItems: "center", 
        paddingHorizontal: 24,
    },
    title: { 
        fontSize: 36, 
        fontWeight: "700", 
        color: "#FFFFFF", 
        marginBottom: 12 
    },
    subtitle: { 
        fontSize: 18, 
        color: "rgba(255, 255, 255, 0.9)", 
        fontWeight: "500" 
    },
    form: { 
        flex: 1, 
        padding: 24,
        marginTop: -30,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    formTitle: {
        fontSize: 28,
        fontWeight: "700",
        color: "#1F2937",
        marginBottom: 16,
        textAlign: "center",
    },
    stepDescription: {
        fontSize: 16,
        color: "#6B7280",
        textAlign: "center",
        marginBottom: 40,
        fontWeight: "500",
    },
    inputContainer: { marginBottom: 24 },
    rowContainer: { flexDirection: "row", gap: 20 },
    halfInput: { flex: 1 },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 12,
    },
    input: {
        backgroundColor: "#F9FAFB",
        borderWidth: 2,
        borderColor: "#E5E7EB",
        borderRadius: 16,
        padding: 20,
        fontSize: 16,
        color: "#1F2937",
        fontWeight: "500",
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F9FAFB",
        borderWidth: 2,
        borderColor: "#E5E7EB",
        borderRadius: 16,
    },
    passwordInput: {
        flex: 1,
        padding: 20,
        fontSize: 16,
        color: "#1F2937",
        fontWeight: "500",
    },
    eyeButton: { padding: 20 },
    buttonContainer: { padding: 24 },
    nextButton: {
        backgroundColor: "#1E40AF",
        padding: 20,
        borderRadius: 16,
        alignItems: "center",
        shadowColor: "#1E40AF",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    nextButtonText: { color: "#FFFFFF", fontSize: 18, fontWeight: "700" },
    backButton: { alignItems: "center", marginTop: 20 },
    backButtonText: { color: "#6B7280", fontSize: 16, fontWeight: "500" },
    loginRedirect: { alignItems: "center", marginTop: 20 },
    loginRedirectText: { color: "#6B7280", fontSize: 16 },
    loginRedirectLink: { color: "#1E40AF", fontWeight: "700" },
});
