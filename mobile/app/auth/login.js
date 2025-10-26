import { StyleSheet, Text, View, TextInput, TouchableOpacity, Platform, Dimensions, Image } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';
import { API_URL } from "../../config";

export default function LoginPage() {
    const params = useLocalSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [groupCode, setGroupCode] = useState(null);
    const { toast, success, error, warning, hideToast } = useToast();

    useEffect(() => {
        // Detectar si viene de un link de invitación
        if (params.groupCode) {
            setGroupCode(params.groupCode);
        }
    }, [params]);

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
            error('Por favor completa todos los campos');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                error(data.detail || "Credenciales inválidas");
                return;
            }

            await AsyncStorage.setItem("user", JSON.stringify(data));
            
            // Si viene de un link de invitación, unirlo al grupo y redirigir
            if (groupCode) {
                try {
                    console.log('Intentando unirse al grupo con código:', groupCode, 'user_id:', data.id);
                    const joinResponse = await fetch(`${API_URL}/groups/join-by-code?code=${groupCode}&user_id=${data.id}`, {
                        method: 'POST'
                    });
                    
                    const joinData = await joinResponse.json();
                    console.log('Respuesta del servidor:', joinResponse.status, joinData);
                    
                    if (joinResponse.ok) {
                        success(`Te has unido al grupo exitosamente`);
                    } else {
                        console.error('Error al unirse:', joinData);
                        warning("Ya estás en este grupo o hubo un problema al unirte");
                    }
                    
                    // Redirigir SIEMPRE a waiting room si hay groupCode
                    setTimeout(() => {
                        router.replace(`/user/waiting-room?code=${groupCode}`);
                    }, 1500);
                    return;
                    
                } catch (err) {
                    console.error('Error al unirse al grupo:', err);
                    error("No se pudo conectar con el servidor del grupo");
                    // Aún así redirigir a waiting room
                    setTimeout(() => {
                        router.replace(`/user/waiting-room?code=${groupCode}`);
                    }, 1500);
                    return;
                }
            }
            
            success(`¡Bienvenido ${data.nombre}!`);
            setTimeout(() => {
                router.replace("/home");
            }, 1500);

        } catch (err) {
            console.error(err);
            error("No se pudo conectar con el servidor");
        }
    };

    const handleRegister = () => {
        // Si viene de una invitación, pasar el código al registro
        if (groupCode) {
            router.push(`/auth/register?groupCode=${groupCode}`);
        } else {
            router.push('/auth/register');
        }
    };

    return (
        <View style={styles.container}>
            <Toast
                visible={toast.visible}
                message={toast.message}
                type={toast.type}
                onHide={hideToast}
                duration={toast.duration}
            />
            {/* Header con gradiente bancario */}
            <LinearGradient
                colors={['#1e3c72', '#2a5298', '#3b82f6']}
                style={styles.headerGradient}
            >
                <View style={styles.header}>
                    <Image 
                        source={require('../../assets/LogoMarca.jpeg')} 
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.title}>ShareBill</Text>
                    <Text style={styles.subtitle}>Comparte gastos fácilmente</Text>
                </View>
            </LinearGradient>

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

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  
  // Header con gradiente
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 60,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
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
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 40,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 20,
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
  },
  passwordInput: {
    flex: 1,
    padding: 20,
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  eyeButton: {
    padding: 20,
  },
  loginButton: {
    backgroundColor: '#1E40AF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 30,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  registerLink: {
    alignItems: 'center',
    marginTop: 30,
  },
  registerText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
});
