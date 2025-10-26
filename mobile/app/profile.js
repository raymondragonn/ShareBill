import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfilePage() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem("user");
                if (storedUser) {
                    const userData = JSON.parse(storedUser);
                    console.log("Datos del usuario:", userData);
                    setUser(userData);
                }
            } catch (error) {
                console.error("Error cargando usuario:", error);
            }
        };
        loadUser();
    }, []);

    const handleLogout = async () => {
        // Evitamos el Alert en web (no siempre funciona)
        if (Platform.OS === "web") {
            await AsyncStorage.removeItem("user");
            router.replace("/auth/login");
            return;
        }

        // En móvil sí mostramos confirmación
        import("react-native").then(({ Alert }) => {
            Alert.alert(
                "Cerrar sesión",
                "¿Estás seguro de que quieres cerrar sesión?",
                [
                    { text: "Cancelar", style: "cancel" },
                    {
                        text: "Cerrar sesión",
                        style: "destructive",
                        onPress: async () => {
                            await AsyncStorage.removeItem("user");
                            router.replace("/auth/login");
                        },
                    },
                ],
                { cancelable: true }
            );
        });
    };

    if (!user) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Cargando perfil...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header con gradiente bancario */}
            <LinearGradient
                colors={['#1e3c72', '#2a5298', '#3b82f6']}
                style={styles.headerGradient}
            >
                <View style={styles.header}>
                    <View style={styles.profileCard}>
                        <View style={styles.profileInfo}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>
                                    {user.nombre && user.apellido 
                                        ? `${user.nombre[0]}${user.apellido[0]}`.toUpperCase()
                                        : (user.nombre || user.name || 'Usuario')[0]?.toUpperCase() || "U"
                                    }
                                </Text>
                            </View>
                            <View style={styles.userInfo}>
                                <Text style={styles.userName}>
                                    {user.nombre && user.apellido 
                                        ? `${user.nombre} ${user.apellido}` 
                                        : user.nombre || user.name || 'Usuario'
                                    }
                                </Text>
                                <Text style={styles.userEmail}>{user.email}</Text>
                                <View style={styles.statusBadge}>
                                    <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                                    <Text style={styles.statusText}>Cuenta verificada</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </LinearGradient>


            {/* Menú de opciones bancarias */}
            <View style={styles.menuSection}>
                <Text style={styles.sectionTitle}>Servicios bancarios</Text>
                
                <View style={styles.menuGroup}>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <Ionicons name="card" size={24} color="#1E40AF" />
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={styles.menuText}>Tarjetas</Text>
                            <Text style={styles.menuSubtext}>Gestionar tarjetas y pagos</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>


                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <Ionicons name="analytics" size={24} color="#DC2626" />
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={styles.menuText}>Estadísticas</Text>
                            <Text style={styles.menuSubtext}>Ver análisis de gastos</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Configuración</Text>
                
                <View style={styles.menuGroup}>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <Ionicons name="person" size={24} color="#7C3AED" />
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={styles.menuText}>Perfil</Text>
                            <Text style={styles.menuSubtext}>Información personal</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <Ionicons name="shield-checkmark" size={24} color="#059669" />
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={styles.menuText}>Seguridad</Text>
                            <Text style={styles.menuSubtext}>Contraseñas y autenticación</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <Ionicons name="notifications" size={24} color="#F59E0B" />
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={styles.menuText}>Notificaciones</Text>
                            <Text style={styles.menuSubtext}>Configurar alertas</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <Ionicons name="help-circle" size={24} color="#6366F1" />
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={styles.menuText}>Soporte</Text>
                            <Text style={styles.menuSubtext}>Ayuda y contacto</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Botón de cerrar sesión */}
            <View style={styles.logoutSection}>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                    activeOpacity={0.7}
                >
                    <Ionicons name="log-out" size={24} color="#FFFFFF" />
                    <Text style={styles.logoutText}>Cerrar sesión</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: "#F8FAFC" 
    },
    
    // Header con gradiente
    headerGradient: {
        paddingTop: Platform.OS === 'ios' ? 50 : 30,
        paddingBottom: 30,
    },
    header: {
        paddingHorizontal: 24,
    },
    profileCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    profileInfo: { 
        flexDirection: "row", 
        alignItems: "center" 
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "#1E40AF",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
        shadowColor: "#1E40AF",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    avatarText: { 
        fontSize: 28, 
        fontWeight: "bold", 
        color: "#FFFFFF" 
    },
    userInfo: { 
        flex: 1 
    },
    userName: { 
        fontSize: 24, 
        fontWeight: "700", 
        color: "#1F2937", 
        marginBottom: 4 
    },
    userEmail: { 
        fontSize: 16, 
        color: "#6B7280",
        marginBottom: 8
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'flex-start'
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#059669',
        marginLeft: 4
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 16,
    },

    // Menú
    menuSection: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 20,
    },
    menuGroup: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    menuIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F8FAFC',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    menuContent: {
        flex: 1,
    },
    menuText: { 
        fontSize: 16, 
        fontWeight: "600", 
        color: "#1F2937",
        marginBottom: 2,
    },
    menuSubtext: {
        fontSize: 14,
        color: '#6B7280',
    },

    // Logout
    logoutSection: { 
        padding: 24,
        paddingTop: 0,
    },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#EF4444",
        padding: 18,
        borderRadius: 16,
        shadowColor: "#EF4444",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    logoutText: { 
        fontSize: 16, 
        fontWeight: "600", 
        color: "#FFFFFF", 
        marginLeft: 8 
    },
    
    // Loading
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F8FAFC",
    },
    loadingText: { 
        fontSize: 18, 
        color: "#6B7280",
        fontWeight: '500',
    },
});
