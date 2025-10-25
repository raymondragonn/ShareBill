import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function ProfilePage() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>U</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Usuario</Text>
            <Text style={styles.userEmail}>usuario@ejemplo.com</Text>
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
        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#FDF0D5" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#949494',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#669BBC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#003049',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FDF0D5',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#003049',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#949494',
  },
  menuSection: {
    backgroundColor: '#f2f3f7',
    marginTop: 24,
    borderRadius: 15,
    marginHorizontal: 24,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#949494',
  },
  menuText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#003049',
    marginLeft: 12,
  },
  logoutSection: {
    margin: 24,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C1121F',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#C1121F',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FDF0D5',
    marginLeft: 8,
  },
});
