import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Alert,
    Modal,
    Platform,
    Dimensions,
    TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function WalletPage() {
    const [user, setUser] = useState(null);
    const [cards, setCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCard, setNewCard] = useState({
        bank: "",
        cardName: "",
        number: "",
        name: "",
        expiry: "",
        cvv: "",
        type: "credit",
    });

    // Cargar datos del usuario al montar el componente
    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem("user");
                if (storedUser) {
                    const userData = JSON.parse(storedUser);
                    setUser(userData);
                    console.log("Usuario cargado:", userData);
                    
                    // Agregar una tarjeta de ejemplo con el nombre del usuario
                    const userName = userData.nombre && userData.apellido 
                        ? `${userData.nombre} ${userData.apellido}` 
                        : userData.nombre || userData.name || 'Usuario';
                    
                    setCards([{
                        id: 1,
                        type: "credit",
                        bank: "Capital One",
                        number: "**** **** **** 1234",
                        name: userName,
                        expiry: "12/26",
                        cvv: "***",
                        isDefault: true,
                        cardName: "VENTURE",
                        cardColor: "blue",
                        pattern: "waves",
                    }]);
                }
            } catch (error) {
                console.error("Error cargando usuario:", error);
            }
        };
        loadUser();
    }, []);

    const handleAddCard = () => setShowAddModal(true);

    const handleSaveCard = () => {
        if (
            !newCard.bank ||
            !newCard.cardName ||
            !newCard.number ||
            !newCard.expiry ||
            !newCard.cvv
        ) {
            Alert.alert("Error", "Por favor completa todos los campos");
            return;
        }

        const formattedNumber = "**** **** **** " + newCard.number.slice(-4);
        
        // Usar el nombre del usuario actual si está disponible
        const cardHolderName = user 
            ? (user.nombre && user.apellido 
                ? `${user.nombre} ${user.apellido}` 
                : user.nombre || user.name || 'Usuario')
            : newCard.name || 'Usuario';

        const newCardData = {
            id: cards.length + 1,
            ...newCard,
            name: cardHolderName,
            number: formattedNumber,
            isDefault: false,
            cardColor: "blue",
            pattern: "waves",
            cvv: "***",
        };

        setCards((prev) => [...prev, newCardData]);
        setNewCard({
            bank: "",
            cardName: "",
            number: "",
            name: "",
            expiry: "",
            cvv: "",
            type: "credit",
        });
        setShowAddModal(false);
        Alert.alert("Éxito", "Tarjeta agregada correctamente");
    };

    const handleCardPress = (card) => {
        setSelectedCard(card);
        setShowModal(true);
    };

    const handleSetDefault = () => {
        if (selectedCard) {
            setCards((prevCards) =>
                prevCards.map((card) => ({
                    ...card,
                    isDefault: card.id === selectedCard.id,
                }))
            );
            setShowModal(false);
            setSelectedCard(null);
        }
    };

    const handleDeleteCard = () => {
        if (selectedCard) {
            Alert.alert(
                "Eliminar Tarjeta",
                `¿Eliminar la tarjeta ${selectedCard.cardName}?`,
                [
                    { text: "Cancelar", style: "cancel" },
                    {
                        text: "Eliminar",
                        style: "destructive",
                        onPress: () => {
                            setCards((prev) =>
                                prev.filter((card) => card.id !== selectedCard.id)
                            );
                            setShowModal(false);
                            setSelectedCard(null);
                        },
                    },
                ]
            );
        }
    };

    const CardComponent = ({ card }) => (
        <TouchableOpacity
            style={[
                styles.card,
                card.cardColor === "blue"
                    ? styles.blueCard
                    : card.cardColor === "gray"
                        ? styles.grayCard
                        : styles.orangeCard,
                card.isDefault && styles.defaultCard,
            ]}
            onPress={() => handleCardPress(card)}
            activeOpacity={0.8}
        >
            <View style={styles.chipContainer}>
                <View style={styles.chip} />
            </View>

            <View style={styles.bankLogo}>
                <View style={styles.logoContainer}>
                    <Text style={styles.bankLogoText}>{card.bank}</Text>
                    <View style={styles.swoosh} />
                </View>
            </View>

            <View style={styles.cardNameContainer}>
                <Text style={styles.cardName}>{card.cardName}</Text>
            </View>

            <View style={styles.cardNumberContainer}>
                <Text style={styles.cardNumber}>{card.number}</Text>
            </View>

            <View style={styles.cardFooter}>
                <View style={styles.cardHolderInfo}>
                    <Text style={styles.cardHolderLabel}>CARD HOLDER</Text>
                    <Text style={styles.cardHolderName}>{card.name}</Text>
                </View>
                <View style={styles.expiryInfo}>
                    <Text style={styles.expiryLabel}>EXPIRES</Text>
                    <Text style={styles.expiryDate}>{card.expiry}</Text>
                </View>
            </View>

            {card.isDefault && (
                <View style={styles.defaultIndicator}>
                    <Ionicons name="star" size={20} color="#FFD700" />
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={["#1e3c72", "#2a5298", "#3b82f6"]}
                style={styles.headerGradient}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Mi Billetera</Text>
                    <Text style={styles.subtitle}>Gestiona tus métodos de pago</Text>
                </View>
            </LinearGradient>

            <View style={styles.addCardSection}>
                <TouchableOpacity
                    style={styles.addCardButton}
                    onPress={handleAddCard}
                >
                    <Ionicons name="add-circle" size={24} color="#007AFF" />
                    <Text style={styles.addCardText}>Agregar Tarjeta</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.cardsContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionTitle}>Mis Tarjetas</Text>

                {cards.map((card) => (
                    <CardComponent key={card.id} card={card} />
                ))}

                <View style={styles.infoSection}>
                    <View style={styles.infoCard}>
                        <Ionicons name="information-circle" size={20} color="#007AFF" />
                        <Text style={styles.infoText}>
                            La tarjeta marcada con estrella es tu método de pago
                            predeterminado
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Modal de opciones de tarjeta */}
            <Modal visible={showModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Opciones de Tarjeta</Text>
                            <TouchableOpacity onPress={() => setShowModal(false)}>
                                <Ionicons name="close" size={24} color="#8E8E93" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.cardPreviewContainer}>
                            <View style={styles.cardPreviewHeader}>
                                <Ionicons name="card" size={20} color="#1E40AF" />
                                <Text style={styles.cardPreviewTitle}>Vista Previa</Text>
                            </View>
                            <View style={[
                                styles.cardPreview,
                                selectedCard?.cardColor === "blue" ? styles.blueCardPreview :
                                selectedCard?.cardColor === "gray" ? styles.grayCardPreview :
                                styles.orangeCardPreview
                            ]}>
                                <View style={styles.cardPreviewContent}>
                                    <View style={styles.cardPreviewTop}>
                                        <View style={styles.cardPreviewChip} />
                                        <Text style={styles.cardPreviewBank}>{selectedCard?.bank}</Text>
                                    </View>
                                    <View style={styles.cardPreviewMiddle}>
                                        <Text style={styles.cardPreviewCardName}>{selectedCard?.cardName}</Text>
                                        <Text style={styles.cardPreviewNumber}>{selectedCard?.number}</Text>
                                    </View>
                                    <View style={styles.cardPreviewBottom}>
                                        <View style={styles.cardPreviewHolder}>
                                            <Text style={styles.cardPreviewHolderLabel}>CARD HOLDER</Text>
                                            <Text style={styles.cardPreviewHolderName}>{selectedCard?.name}</Text>
                                        </View>
                                        <View style={styles.cardPreviewExpiry}>
                                            <Text style={styles.cardPreviewExpiryLabel}>EXPIRES</Text>
                                            <Text style={styles.cardPreviewExpiryDate}>{selectedCard?.expiry}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.modalButton, styles.setDefaultButton]}
                            onPress={handleSetDefault}
                        >
                            <Ionicons name="star" size={20} color="#FFD700" />
                            <Text style={styles.setDefaultText}>Predeterminada</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.modalButton, styles.deleteButton]}
                            onPress={handleDeleteCard}
                        >
                            <Ionicons name="trash" size={20} color="#FF3B30" />
                            <Text style={styles.deleteText}>Eliminar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal para agregar tarjeta nueva */}
            <Modal visible={showAddModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.addModalContent}>
                        <LinearGradient
                            colors={['#1e3c72', '#2a5298']}
                            style={styles.modalHeaderGradient}
                        >
                            <View style={styles.modalHeader}>
                                <View style={styles.modalHeaderLeft}>
                                    <View style={styles.modalIconContainer}>
                                        <Ionicons name="card" size={24} color="#FFFFFF" />
                                    </View>
                                    <Text style={styles.modalTitle}>Agregar Nueva Tarjeta</Text>
                                </View>
                                <TouchableOpacity 
                                    style={styles.closeButton}
                                    onPress={() => setShowAddModal(false)}
                                >
                                    <Ionicons name="close" size={24} color="#FFFFFF" />
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>

                        <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputGroupTitle}>Información del Banco</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="business" size={20} color="#6B7280" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.modalInput}
                                        placeholder="Nombre del banco"
                                        value={newCard.bank}
                                        onChangeText={(text) => setNewCard({ ...newCard, bank: text })}
                                        placeholderTextColor="#9CA3AF"
                                    />
                                </View>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="card" size={20} color="#6B7280" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.modalInput}
                                        placeholder="Nombre de la tarjeta"
                                        value={newCard.cardName}
                                        onChangeText={(text) => setNewCard({ ...newCard, cardName: text })}
                                        placeholderTextColor="#9CA3AF"
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputGroupTitle}>Datos de la Tarjeta</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="card-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.modalInput}
                                        placeholder="Número de tarjeta"
                                        value={newCard.number}
                                        onChangeText={(text) => setNewCard({ ...newCard, number: text })}
                                        keyboardType="numeric"
                                        maxLength={16}
                                        placeholderTextColor="#9CA3AF"
                                    />
                                </View>
                                
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Titular de la Tarjeta</Text>
                                    <View style={styles.userNameContainer}>
                                        <Ionicons name="person" size={20} color="#6B7280" style={styles.inputIcon} />
                                        <Text style={styles.userNameDisplay}>
                                            {user 
                                                ? (user.nombre && user.apellido 
                                                    ? `${user.nombre} ${user.apellido}` 
                                                    : user.nombre || user.name || 'Usuario')
                                                : 'Cargando...'
                                            }
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.rowInputs}>
                                    <View style={[styles.inputWrapper, { flex: 1 }]}>
                                        <Ionicons name="calendar" size={20} color="#6B7280" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.modalInput}
                                            placeholder="MM/AA"
                                            value={newCard.expiry}
                                            onChangeText={(text) => setNewCard({ ...newCard, expiry: text })}
                                            keyboardType="numeric"
                                            maxLength={5}
                                            placeholderTextColor="#9CA3AF"
                                        />
                                    </View>
                                    <View style={[styles.inputWrapper, { flex: 1 }]}>
                                        <Ionicons name="shield-checkmark" size={20} color="#6B7280" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.modalInput}
                                            placeholder="CVV"
                                            value={newCard.cvv}
                                            onChangeText={(text) => setNewCard({ ...newCard, cvv: text })}
                                            keyboardType="numeric"
                                            secureTextEntry
                                            maxLength={3}
                                            placeholderTextColor="#9CA3AF"
                                        />
                                    </View>
                                </View>
                            </View>
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setShowAddModal(false)}
                            >
                                <Ionicons name="close" size={20} color="#FFFFFF" />
                                <Text style={styles.cancelText}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={handleSaveCard}
                            >
                                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                                <Text style={styles.saveText}>Agregar Tarjeta</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    // mismos estilos que ya tenías arriba ↓
    container: { flex: 1, backgroundColor: "#F8FAFC" },
    headerGradient: { paddingTop: 50, paddingBottom: 30 },
    header: { paddingHorizontal: 24 },
    title: { fontSize: 28, fontWeight: "700", color: "#FFFFFF", marginBottom: 8 },
    subtitle: { fontSize: 16, color: "rgba(255,255,255,0.8)", fontWeight: "500" },
    addCardSection: {
        backgroundColor: "#FFFFFF",
        padding: 24,
        marginHorizontal: 24,
        marginTop: -20,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        elevation: 6,
    },
    addCardButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderStyle: "dashed",
        borderWidth: 2,
        borderColor: "#1E40AF",
        padding: 20,
        borderRadius: 16,
    },
    addCardText: { fontSize: 16, fontWeight: "600", color: "#1E40AF", marginLeft: 8 },
    cardsContainer: { flex: 1, padding: 24 },
    sectionTitle: { fontSize: 20, fontWeight: "700", color: "#1F2937", marginBottom: 20 },
    card: {
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
        aspectRatio: 1.6,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        elevation: 8,
    },
    blueCard: { backgroundColor: "#1E3A8A" },
    grayCard: { backgroundColor: "#374151" },
    orangeCard: { backgroundColor: "#DC2626" },
    defaultCard: { borderColor: "#FFD700", borderWidth: 3 },
    chipContainer: { position: "absolute", top: 20, left: 20 },
    chip: { width: 35, height: 25, backgroundColor: "#C0C0C0", borderRadius: 4 },
    bankLogo: { position: "absolute", top: 20, right: 20 },
    logoContainer: { alignItems: "flex-end" },
    bankLogoText: { fontSize: 14, fontWeight: "bold", color: "#FFFFFF" },
    swoosh: { width: 30, height: 3, backgroundColor: "#EF4444", borderRadius: 2, marginTop: 2 },
    cardNameContainer: { position: "absolute", top: 50, left: 20 },
    cardName: { fontSize: 16, color: "#FFFFFF", fontWeight: "bold" },
    cardNumberContainer: { position: "absolute", top: "50%", left: 20, right: 20 },
    cardNumber: { fontSize: 22, color: "#FFFFFF", fontWeight: "bold", textAlign: "center" },
    cardFooter: { position: "absolute", bottom: 20, left: 20, right: 20, flexDirection: "row", justifyContent: "space-between" },
    cardHolderLabel: { fontSize: 9, color: "#E5E7EB" },
    cardHolderName: { fontSize: 14, fontWeight: "bold", color: "#FFFFFF" },
    expiryLabel: { fontSize: 9, color: "#E5E7EB" },
    expiryDate: { fontSize: 14, fontWeight: "bold", color: "#FFFFFF" },
    modalOverlay: { 
        flex: 1, 
        backgroundColor: "rgba(0,0,0,0.6)", 
        justifyContent: "flex-end", 
        alignItems: "center",
    },
    modalContent: { 
        backgroundColor: "#fff", 
        borderRadius: 20, 
        padding: 20, 
        width: "100%", 
        maxWidth: 400,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 15,
    },
    addModalContent: { 
        backgroundColor: "#fff", 
        borderTopLeftRadius: 24, 
        borderTopRightRadius: 24,
        width: "100%",
        maxHeight: Platform.OS === 'ios' ? "92%" : "95%",
        paddingBottom: Platform.OS === 'ios' ? 20 : 0,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 25,
        elevation: 20,
        overflow: 'hidden',
    },
    modalHeaderGradient: {
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        paddingBottom: 18,
        paddingHorizontal: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    modalHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    modalIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    modalTitle: { 
        fontSize: 18, 
        fontWeight: "700", 
        color: "#FFFFFF",
        flex: 1,
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalBody: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 12,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputGroupTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 12,
        marginTop: 4,
        paddingLeft: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        marginBottom: 10,
        paddingHorizontal: 14,
        paddingVertical: 4,
    },
    inputIcon: {
        marginRight: 12,
    },
    modalInput: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 15,
        color: '#1F2937',
        fontWeight: '500',
    },
    userNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderWidth: 1.5,
        borderColor: '#D1D5DB',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 14,
    },
    rowInputs: {
        flexDirection: 'row',
        marginTop: 4,
        gap: 12,
    },
    modalFooter: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: Platform.OS === 'ios' ? 24 : 16,
        backgroundColor: '#F9FAFB',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 12, marginBottom: 12, fontSize: 16 },
    inputContainer: { marginBottom: 12 },
    inputLabel: { fontSize: 13, fontWeight: "600", color: "#6B7280", marginBottom: 8, paddingLeft: 4 },
    userNameDisplay: { 
        fontSize: 15, 
        color: "#1F2937",
        fontWeight: "600",
        flex: 1,
    },
    modalButton: { 
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "center", 
        flex: 1, 
        paddingVertical: 14, 
        paddingHorizontal: 16, 
        borderRadius: 12, 
        marginHorizontal: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
        gap: 6,
    },
    saveButton: { 
        backgroundColor: "#1E40AF",
        shadowColor: "#1E40AF",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    cancelButton: { 
        backgroundColor: "#6B7280",
        shadowColor: "#6B7280",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    saveText: { 
        color: "#FFFFFF", 
        fontWeight: "700", 
        fontSize: 15,
    },
    cancelText: { 
        color: "#FFFFFF", 
        fontWeight: "700", 
        fontSize: 15,
    },
    setDefaultButton: { backgroundColor: "#FFF8DC", marginBottom: 10 },
    deleteButton: { backgroundColor: "#FFEBEE" },
    setDefaultText: { color: "#B8860B", fontWeight: "600", marginLeft: 8 },
    deleteText: { color: "#FF3B30", fontWeight: "600", marginLeft: 8 },
    
    // Estilos para el preview de tarjeta
    cardPreviewContainer: {
        marginBottom: 24,
    },
    cardPreviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardPreviewTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginLeft: 8,
    },
    cardPreview: {
        borderRadius: 12,
        padding: 16,
        aspectRatio: 1.6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
    },
    blueCardPreview: { backgroundColor: "#1E3A8A" },
    grayCardPreview: { backgroundColor: "#374151" },
    orangeCardPreview: { backgroundColor: "#DC2626" },
    cardPreviewContent: {
        flex: 1,
        justifyContent: 'space-between',
    },
    cardPreviewTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    cardPreviewChip: {
        width: 24,
        height: 18,
        backgroundColor: "#C0C0C0",
        borderRadius: 3,
    },
    cardPreviewBank: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    cardPreviewMiddle: {
        alignItems: 'center',
        marginVertical: 8,
    },
    cardPreviewCardName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    cardPreviewNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        letterSpacing: 1,
    },
    cardPreviewBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    cardPreviewHolder: {
        flex: 1,
    },
    cardPreviewHolderLabel: {
        fontSize: 8,
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: 2,
    },
    cardPreviewHolderName: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    cardPreviewExpiry: {
        alignItems: 'flex-end',
    },
    cardPreviewExpiryLabel: {
        fontSize: 8,
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: 2,
    },
    cardPreviewExpiryDate: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    infoSection: { marginTop: 20 },
    infoCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#E3F2FD", padding: 16, borderRadius: 12 },
    infoText: { fontSize: 14, color: "#1976D2", marginLeft: 8, flex: 1 },
});
