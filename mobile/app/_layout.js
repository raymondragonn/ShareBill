import { Tabs, useRouter, useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

export default function TabLayout() {
    const router = useRouter();
    const segments = useSegments(); // útil para saber en qué "grupo" estamos
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifySession = async () => {
            try {
                const user = await AsyncStorage.getItem('user');
                const inAuthGroup = segments[0] === 'auth';

                if (!user && !inAuthGroup) {
                    // solo redirijo si NO estamos ya en /auth
                    router.replace('/auth/login');
                } else if (user && inAuthGroup) {
                    // si hay sesión y estamos en auth, mandamos al home
                    router.replace('/home');
                }
            } catch (error) {
                console.error('Error verificando sesión:', error);
                if (segments[0] !== 'auth') {
                    router.replace('/auth/login');
                }
            } finally {
                setLoading(false);
            }
        };

        verifySession();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [segments]); // re-ejecuta cuando cambien los segmentos

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#8e09d5" />
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: '#8e09d5',
                    tabBarInactiveTintColor: '#8E8E93',
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        backgroundColor: '#FFFFFF',
                        borderTopWidth: 1,
                        borderTopColor: '#E5E5EA',
                        paddingBottom: 15,
                        paddingTop: 10,
                        height: 80,
                        marginBottom: 10,
                    },
                    headerStyle: { backgroundColor: '#8e09d5' },
                    headerTintColor: '#FFFFFF',
                    headerTitleStyle: { fontWeight: 'bold' },
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
                    name="profile"
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="person" size={size + 4} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen name="pago-completado" options={{ href: null }} />
                <Tabs.Screen name="auth/login" options={{ href: null }} />
                <Tabs.Screen name="auth/register" options={{ href: null }} />
                <Tabs.Screen name="user/productos" options={{ href: null }} />
                <Tabs.Screen name="user/total" options={{ href: null }} />
                <Tabs.Screen name="admin/pago" options={{ href: null }} />
                <Tabs.Screen name="admin/integrantes" options={{ href: null }} />
                <Tabs.Screen name="admin/escanear-ticket" options={{ href: null }} />
            </Tabs>
        </GestureHandlerRootView>
    );
}
