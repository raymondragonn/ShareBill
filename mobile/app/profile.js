import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function ProfilePage() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem("user");
                if (storedUser) setUser(JSON.parse(storedUser));
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
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.profileInfo}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {user.name?.[0]?.toUpperCase() || "U"}
                        </Text>
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{user.name}</Text>
                        <Text style={styles.userEmail}>{user.email}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.menuSection}>
                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="person-outline" size={24} color="#669BBC" />
                    <Text style={styles.menuText}>Información personal</Text>
                    <Ionicons name="chevron-forward" size={20} color="#949494" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="notifications-outline" size={24} color="#669BBC" />
                    <Text style={styles.menuText}>Notificaciones</Text>
                    <Ionicons name="chevron-forward" size={20} color="#949494" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="shield-outline" size={24} color="#669BBC" />
                    <Text style={styles.menuText}>Privacidad</Text>
                    <Ionicons name="chevron-forward" size={20} color="#949494" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="help-circle-outline" size={24} color="#669BBC" />
                    <Text style={styles.menuText}>Ayuda</Text>
                    <Ionicons name="chevron-forward" size={20} color="#949494" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="information-circle-outline" size={24} color="#669BBC" />
                    <Text style={styles.menuText}>Acerca de</Text>
                    <Ionicons name="chevron-forward" size={20} color="#949494" />
                </TouchableOpacity>
            </View>

            <View style={styles.logoutSection}>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                    activeOpacity={0.7}
                >
                    <Ionicons name="log-out-outline" size={24} color="#FDF0D5" />
                    <Text style={styles.logoutText}>Cerrar sesión</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF" },
    header: {
        backgroundColor: "#FFFFFF",
        padding: 24,
        paddingTop: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#949494",
    },
    profileInfo: { flexDirection: "row", alignItems: "center" },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#669BBC",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
        shadowColor: "#003049",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
    },
    avatarText: { fontSize: 24, fontWeight: "bold", color: "#FDF0D5" },
    userInfo: { flex: 1 },
    userName: { fontSize: 25, fontWeight: "bold", color: "#003049", marginBottom: 4 },
    userEmail: { fontSize: 16, color: "#949494" },
    menuSection: {
        backgroundColor: "#f2f3f7",
        marginTop: 24,
        borderRadius: 15,
        marginHorizontal: 24,
        overflow: "hidden",
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#949494",
    },
    menuText: { flex: 1, fontSize: 18, fontWeight: "700", color: "#003049", marginLeft: 12 },
    logoutSection: { margin: 24 },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#C1121F",
        padding: 20,
        borderRadius: 15,
        shadowColor: "#C1121F",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    logoutText: { fontSize: 18, fontWeight: "700", color: "#FDF0D5", marginLeft: 8 },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
    },
    loadingText: { fontSize: 18, color: "#003049" },
});
