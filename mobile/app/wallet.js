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
    KeyboardAvoidingView,
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

    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem("user");
                if (storedUser) {
                    const userData = JSON.parse(storedUser);
                    setUser(userData);
                    const userName =
                        userData.nombre && userData.apellido
                            ? `${userData.nombre} ${userData.apellido}`
                            : userData.nombre || userData.name || "Usuario";
                    setCards([
                        {
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
                        },
                    ]);
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
        const cardHolderName = user
            ? user.nombre && user.apellido
                ? `${user.nombre} ${user.apellido}`
                : user.nombre || user.name || "Usuario"
            : newCard.name || "Usuario";

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
            Alert.alert("Eliminar Tarjeta", `¿Eliminar ${selectedCard.cardName}?`, [
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
            ]);
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
                <View>
                    <Text style={styles.cardHolderLabel}>CARD HOLDER</Text>
                    <Text style={styles.cardHolderName}>{card.name}</Text>
                </View>
                <View>
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
                <TouchableOpacity style={styles.addCardButton} onPress={handleAddCard}>
                    <Ionicons name="add-circle" size={24} color="#007AFF" />
                    <Text style={styles.addCardText}>Agregar Tarjeta</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.cardsContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionTitle}>Mis Tarjetas</Text>
                {cards.map((card) => (
                    <CardComponent key={card.id} card={card} />
                ))}
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
                            {selectedCard ? (
                                <View
                                    style={[
                                        styles.cardPreview,
                                        selectedCard.cardColor === "blue"
                                            ? styles.blueCardPreview
                                            : selectedCard.cardColor === "gray"
                                                ? styles.grayCardPreview
                                                : styles.orangeCardPreview,
                                    ]}
                                >
                                    <View style={styles.cardPreviewContent}>
                                        <Text style={styles.cardPreviewBank}>
                                            {selectedCard.bank}
                                        </Text>
                                        <Text style={styles.cardPreviewCardName}>
                                            {selectedCard.cardName}
                                        </Text>
                                        <Text style={styles.cardPreviewNumber}>
                                            {selectedCard.number}
                                        </Text>
                                        <Text style={styles.cardPreviewHolderName}>
                                            {selectedCard.name}
                                        </Text>
                                        <Text style={styles.cardPreviewExpiry}>
                                            {selectedCard.expiry}
                                        </Text>
                                    </View>
                                </View>
                            ) : (
                                <Text style={{ color: "#6B7280" }}>Cargando tarjeta...</Text>
                            )}
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
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.addModalContent}>
                            <LinearGradient
                                colors={["#1e3c72", "#2a5298"]}
                                style={styles.modalHeaderGradient}
                            >
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>Agregar Nueva Tarjeta</Text>
                                    <TouchableOpacity
                                        onPress={() => setShowAddModal(false)}
                                        style={styles.closeButton}
                                    >
                                        <Ionicons name="close" size={24} color="#FFFFFF" />
                                    </TouchableOpacity>
                                </View>
                            </LinearGradient>

                            <ScrollView
                                style={styles.modalBody}
                                contentContainerStyle={{ paddingBottom: 40 }}
                            >
                                <TextInput
                                    style={styles.modalInput}
                                    placeholder="Nombre del banco"
                                    value={newCard.bank}
                                    onChangeText={(text) => setNewCard({ ...newCard, bank: text })}
                                />
                                <TextInput
                                    style={styles.modalInput}
                                    placeholder="Nombre de la tarjeta"
                                    value={newCard.cardName}
                                    onChangeText={(text) =>
                                        setNewCard({ ...newCard, cardName: text })
                                    }
                                />
                                <TextInput
                                    style={styles.modalInput}
                                    placeholder="Número de tarjeta"
                                    keyboardType="numeric"
                                    value={newCard.number}
                                    onChangeText={(text) =>
                                        setNewCard({ ...newCard, number: text })
                                    }
                                />
                                <TextInput
                                    style={styles.modalInput}
                                    placeholder="MM/AA"
                                    keyboardType="numeric"
                                    value={newCard.expiry}
                                    onChangeText={(text) =>
                                        setNewCard({ ...newCard, expiry: text })
                                    }
                                />
                                <TextInput
                                    style={styles.modalInput}
                                    placeholder="CVV"
                                    keyboardType="numeric"
                                    secureTextEntry
                                    value={newCard.cvv}
                                    onChangeText={(text) => setNewCard({ ...newCard, cvv: text })}
                                />
                            </ScrollView>

                            <View style={styles.modalFooter}>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowAddModal(false)}
                                >
                                    <Text style={styles.cancelText}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.saveButton]}
                                    onPress={handleSaveCard}
                                >
                                    <Text style={styles.saveText}>Guardar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F8FAFC" },
    headerGradient: { paddingTop: 50, paddingBottom: 30 },
    header: { paddingHorizontal: 24 },
    title: { fontSize: 28, fontWeight: "700", color: "#FFFFFF", marginBottom: 8 },
    subtitle: { fontSize: 16, color: "rgba(255,255,255,0.8)" },
    addCardSection: {
        backgroundColor: "#FFFFFF",
        padding: 24,
        marginHorizontal: 24,
        marginTop: -20,
        borderRadius: 16,
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
    sectionTitle: { fontSize: 20, fontWeight: "700", marginBottom: 20 },
    card: {
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
        aspectRatio: 1.6,
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
    swoosh: { width: 30, height: 3, backgroundColor: "#EF4444", marginTop: 2 },
    cardNameContainer: { position: "absolute", top: 50, left: 20 },
    cardName: { fontSize: 16, color: "#FFFFFF", fontWeight: "bold" },
    cardNumberContainer: { position: "absolute", top: "50%", left: 20, right: 20 },
    cardNumber: { fontSize: 22, color: "#FFFFFF", textAlign: "center" },
    cardFooter: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    cardHolderLabel: { fontSize: 9, color: "#E5E7EB" },
    cardHolderName: { fontSize: 14, fontWeight: "bold", color: "#FFFFFF" },
    expiryLabel: { fontSize: 9, color: "#E5E7EB" },
    expiryDate: { fontSize: 14, fontWeight: "bold", color: "#FFFFFF" },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 10,
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,
        width: "90%",
        maxWidth: 400,
        elevation: 15,
    },
    addModalContent: {
        backgroundColor: "#fff",
        borderRadius: 24,
        width: "95%",
        maxHeight: "92%",
        overflow: "hidden",
    },
    modalHeaderGradient: { paddingTop: 40, paddingBottom: 18, paddingHorizontal: 20 },
    modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    modalTitle: { fontSize: 18, fontWeight: "700", color: "#FFFFFF" },
    closeButton: { padding: 6 },
    modalBody: { flex: 1, padding: 20 },
    modalInput: {
        borderWidth: 1.5,
        borderColor: "#E5E7EB",
        borderRadius: 10,
        padding: 14,
        marginBottom: 12,
        fontSize: 15,
    },
    modalFooter: { flexDirection: "row", justifyContent: "space-around", padding: 16 },
    modalButton: {
        flex: 1,
        alignItems: "center",
        padding: 14,
        borderRadius: 10,
        marginHorizontal: 8,
    },
    cancelButton: { backgroundColor: "#6B7280" },
    saveButton: { backgroundColor: "#1E40AF" },
    cancelText: { color: "#FFFFFF", fontWeight: "700" },
    saveText: { color: "#FFFFFF", fontWeight: "700" },
    cardPreviewContainer: { marginBottom: 24 },
    cardPreview: {
        borderRadius: 12,
        padding: 16,
        aspectRatio: 1.6,
    },
    blueCardPreview: { backgroundColor: "#1E3A8A" },
    grayCardPreview: { backgroundColor: "#374151" },
    orangeCardPreview: { backgroundColor: "#DC2626" },
    cardPreviewContent: { flex: 1, justifyContent: "center", alignItems: "center" },
    cardPreviewBank: { color: "#fff", fontWeight: "bold" },
    cardPreviewCardName: { color: "#fff", marginVertical: 4 },
    cardPreviewNumber: { color: "#fff", fontWeight: "bold" },
    cardPreviewHolderName: { color: "#fff", marginTop: 4 },
    cardPreviewExpiry: { color: "#fff" },
    setDefaultButton: { backgroundColor: "#FFF8DC", marginBottom: 10 },
    deleteButton: { backgroundColor: "#FFEBEE" },
    setDefaultText: { color: "#B8860B", fontWeight: "600" },
    deleteText: { color: "#FF3B30", fontWeight: "600" },
});
