import { Tabs, useRouter, useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

export default function TabLayout() {
    const router = useRouter();
    const segments = useSegments();
    const [loading, setLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const verifySession = async () => {
            try {
                const user = await AsyncStorage.getItem('user');
                const inAuthGroup = segments[0] === 'auth';
                const inUserGroup = segments[0] === 'user';

                console.log('🔍 _layout verificando sesión:', { user: !!user, segments, inAuthGroup, inUserGroup });

                if (!user && !inAuthGroup && !inUserGroup) {
                    console.log('❌ Sin usuario y fuera de auth/user, redirigiendo a login');
                    router.replace('/auth/login');
                } else if (user && inAuthGroup) {
                    // NO redirigir si el usuario está en proceso de registro/login con groupCode
                    // Dejar que los componentes de auth manejen la redirección
                    console.log('✅ Usuario en auth, dejando que auth maneje la navegación');
                }

                setLoggedIn(!!user);
            } catch (error) {
                console.error('Error verificando sesión:', error);
                router.replace('/auth/login');
            } finally {
                setLoading(false);
            }
        };

        verifySession();
    }, [segments]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#8e09d5" />
            </View>
        );
    }

    if (!loggedIn && segments[0] !== 'auth') {
        return null;
    }

    // Ocultar la barra de tabs en pantallas de autenticación
    const inAuthGroup = segments[0] === 'auth';
    
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: '#1E40AF',
                    tabBarInactiveTintColor: '#6B7280',
                    tabBarShowLabel: false,
                    tabBarStyle: inAuthGroup ? { display: 'none' } : {
                        backgroundColor: '#FFFFFF',
                        borderTopWidth: 1,
                        borderTopColor: '#E5E7EB',
                        paddingBottom: 15,
                        paddingTop: 10,
                        height: 80,
                        marginBottom: 10,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: -2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 8,
                    },
                    headerShown: false,
                }}
                initialRouteName="home"
            >
                <Tabs.Screen
                    name="home"
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="home" size={size + 4} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen name="index" options={{ href: null }} />
                <Tabs.Screen name="bills" options={{ href: null }} />
                <Tabs.Screen name="groups" options={{ href: null }} />
                <Tabs.Screen
                    name="admin/qr"
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="add-circle" size={size + 4} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="scan-qr"
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="scan" size={size + 4} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="wallet"
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="wallet" size={size + 4} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="person" size={size + 4} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen name="auth/login" options={{ href: null }} />
                <Tabs.Screen name="auth/register" options={{ href: null }} />
                <Tabs.Screen name="user/waiting-room" options={{ href: null }} />
                <Tabs.Screen name="user/productos" options={{ href: null }} />
                <Tabs.Screen name="user/total" options={{ href: null }} />
                <Tabs.Screen name="admin/pago" options={{ href: null }} />
                <Tabs.Screen name="admin/integrantes" options={{ href: null }} />
                <Tabs.Screen name="admin/escanear-ticket" options={{ href: null }} />
                <Tabs.Screen name="pago-completado" options={{ href: null }} />
                <Tabs.Screen name="components/LoadingPayment" options={{ href: null }} />
            </Tabs>
        </GestureHandlerRootView>
    );
}
