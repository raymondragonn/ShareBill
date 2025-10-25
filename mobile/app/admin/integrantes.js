import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function AdminIntegrantesPage() {
  const members = [
    { id: 1, name: 'Juan', joined: true },
    { id: 2, name: 'Pepe', joined: true },
    { id: 3, name: 'Luis', joined: true },
    { id: 4, name: 'María', joined: false },
    { id: 5, name: 'Ana', joined: false },
  ];

  const getAvatarColor = (index) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
    return colors[index % colors.length];
  };

  const handleContinue = () => {
    // Navegar a la pantalla de productos
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.qrInfo}>
          <Text style={styles.qrLabel}>QR 1838</Text>
        </View>

        <View style={styles.membersSection}>
          <Text style={styles.sectionTitle}>Miembros del grupo</Text>
          <Text style={styles.memberCount}>{members.filter(m => m.joined).length} de {members.length} miembros</Text>
        </View>

        <ScrollView style={styles.membersList} showsVerticalScrollIndicator={false}>
          <View style={styles.membersGrid}>
            {members.map((member, index) => (
              <View key={member.id} style={styles.memberCard}>
                <View style={[styles.memberAvatar, { backgroundColor: getAvatarColor(index) }]}>
                  <Text style={styles.memberInitial}>{member.name[0]}</Text>
                </View>
                <Text style={styles.memberName}>{member.name}</Text>
                <View style={styles.memberStatusContainer}>
                  <View style={[styles.statusDot, { backgroundColor: member.joined ? "#4CAF50" : "#FF9800" }]} />
                  <Text style={styles.memberStatus}>
                    {member.joined ? 'Listo' : 'Esperando'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Sum:</Text>
            <Text style={styles.summaryValue}>$0.00</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total:</Text>
            <Text style={styles.summaryValue}>$0.00</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Falta:</Text>
            <Text style={styles.summaryValue}>$0.00</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>CONTINUAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  qrInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  qrLabel: {
    fontSize: 25,
    color: '#8E8E93',
  },
  membersSection: {
    backgroundColor: '#333333',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F8F8F8',
    marginBottom: 5,
  },
  memberCount: {
    fontSize: 14,
    color: '#F8F8F8',
    opacity: 0.8,
  },
  membersList: {
    flex: 1,
    marginBottom: 20,
  },
  membersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  memberCard: {
    width: '48%',
    backgroundColor: '#C2A2DA',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  memberAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  memberInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F5F5F5',
    marginBottom: 6,
    textAlign: 'center',
  },
  memberStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  memberStatus: {
    fontSize: 12,
    color: '#363636',
    fontWeight: '500',
  },
  summary: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#333333',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  continueButton: {
    backgroundColor: '#8A2BE2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#F8F8F8',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
