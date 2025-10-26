import React, { useState } from "react";
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

export default function WalletPage() {
    const [cards, setCards] = useState([
        {
            id: 1,
            type: "credit",
            bank: "Capital One",
            number: "**** **** **** 1234",
            name: "Juan Pérez",
            expiry: "12/26",
            cvv: "***",
            isDefault: true,
            cardName: "VENTURE",
            cardColor: "blue",
            pattern: "waves",
        },
    ]);

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

    const handleAddCard = () => setShowAddModal(true);

    const handleSaveCard = () => {
        if (
            !newCard.bank ||
            !newCard.cardName ||
            !newCard.number ||
            !newCard.name ||
            !newCard.expiry ||
            !newCard.cvv
        ) {
            Alert.alert("Error", "Por favor completa todos los campos");
            return;
        }

        const formattedNumber = "**** **** **** " + newCard.number.slice(-4);

        const newCardData = {
            id: cards.length + 1,
            ...newCard,
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

                        <Text style={styles.cardPreviewText}>
                            {selectedCard?.cardName} •••• {selectedCard?.number.slice(-4)}
                        </Text>

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
                        <Text style={styles.modalTitle}>Agregar Nueva Tarjeta</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Banco"
                            value={newCard.bank}
                            onChangeText={(text) => setNewCard({ ...newCard, bank: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre de la tarjeta"
                            value={newCard.cardName}
                            onChangeText={(text) => setNewCard({ ...newCard, cardName: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Número de tarjeta"
                            value={newCard.number}
                            onChangeText={(text) => setNewCard({ ...newCard, number: text })}
                            keyboardType="numeric"
                            maxLength={16}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Titular"
                            value={newCard.name}
                            onChangeText={(text) => setNewCard({ ...newCard, name: text })}
                        />

                        <View style={{ flexDirection: "row", gap: 10 }}>
                            <TextInput
                                style={[styles.input, { flex: 1 }]}
                                placeholder="Expiración (MM/AA)"
                                value={newCard.expiry}
                                onChangeText={(text) => setNewCard({ ...newCard, expiry: text })}
                                keyboardType="numeric"
                                maxLength={5}
                            />
                            <TextInput
                                style={[styles.input, { flex: 1 }]}
                                placeholder="CVV"
                                value={newCard.cvv}
                                onChangeText={(text) => setNewCard({ ...newCard, cvv: text })}
                                keyboardType="numeric"
                                secureTextEntry
                                maxLength={3}
                            />
                        </View>

                        <View style={{ flexDirection: "row", marginTop: 10 }}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={handleSaveCard}
                            >
                                <Ionicons name="save" size={20} color="#fff" />
                                <Text style={styles.saveText}>Guardar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setShowAddModal(false)}
                            >
                                <Ionicons name="close" size={20} color="#fff" />
                                <Text style={styles.cancelText}>Cancelar</Text>
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
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", padding: 20 },
    modalContent: { backgroundColor: "#fff", borderRadius: 16, padding: 20, width: "100%", maxWidth: 400 },
    addModalContent: { backgroundColor: "#fff", borderRadius: 16, padding: 20, width: "100%", maxWidth: 400 },
    modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
    input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 12, marginBottom: 12, fontSize: 16 },
    modalButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", flex: 1, padding: 14, borderRadius: 10, marginHorizontal: 5 },
    saveButton: { backgroundColor: "#1E40AF" },
    cancelButton: { backgroundColor: "#9CA3AF" },
    saveText: { color: "#fff", fontWeight: "bold", marginLeft: 8 },
    cancelText: { color: "#fff", fontWeight: "bold", marginLeft: 8 },
    setDefaultButton: { backgroundColor: "#FFF8DC", marginBottom: 10 },
    deleteButton: { backgroundColor: "#FFEBEE" },
    setDefaultText: { color: "#B8860B", fontWeight: "600", marginLeft: 8 },
    deleteText: { color: "#FF3B30", fontWeight: "600", marginLeft: 8 },
    infoSection: { marginTop: 20 },
    infoCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#E3F2FD", padding: 16, borderRadius: 12 },
    infoText: { fontSize: 14, color: "#1976D2", marginLeft: 8, flex: 1 },
});
