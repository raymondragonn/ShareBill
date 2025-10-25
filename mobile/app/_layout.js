import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#8e09d5',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: '#8e09d5',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
      initialRouteName="home"
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="bills"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="pago-completado"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="auth/login"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="auth/register"
        options={{
          href: '/auth/register',
        }}
      />
      <Tabs.Screen
        name="user/productos"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="user/total"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="admin/qr"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="admin/pago"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="admin/integrantes"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="admin/escanear-ticket"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
