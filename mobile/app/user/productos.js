import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import { Ionicons } from '@expo/vector-icons';

export default function ProductosPage() {
  const [products, setProducts] = useState([
    { id: 1, name: 'Hamburguesa', price: 12.50, quantity: 0 },
    { id: 2, name: 'Leche', price: 3.20, quantity: 0 },
    { id: 3, name: 'Limón', price: 1.50, quantity: 0 },
    { id: 4, name: 'Pan', price: 2.80, quantity: 0 },
    { id: 5, name: 'Café', price: 4.50, quantity: 0 },
  ]);

  const updateQuantity = (id, change) => {
    setProducts(products.map(product => 
      product.id === id 
        ? { ...product, quantity: Math.max(0, product.quantity + change) }
        : product
    ));
  };

  const getTotal = () => {
    return products.reduce((total, product) => total + (product.price * product.quantity), 0);
  };

  const getSelectedItems = () => {
    return products.filter(product => product.quantity > 0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Productos</Text>
        <Text style={styles.subtitle}>Selecciona los productos que te corresponden</Text>
      </View>

      <ScrollView style={styles.productsList}>
        {products.map((product) => (
          <View key={product.id} style={styles.productItem}>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
            </View>
            
            <View style={styles.quantityControls}>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => updateQuantity(product.id, -1)}
                disabled={product.quantity === 0}
              >
                <Ionicons name="remove" size={20} color={product.quantity === 0 ? "#C7C7CC" : "#007AFF"} />
              </TouchableOpacity>
              
              <Text style={styles.quantityText}>{product.quantity}</Text>
              
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => updateQuantity(product.id, 1)}
              >
                <Ionicons name="add" size={20} color="#007AFF" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total seleccionado:</Text>
          <Text style={styles.totalAmount}>${getTotal().toFixed(2)}</Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.continueButton, getSelectedItems().length === 0 && styles.continueButtonDisabled]}
          disabled={getSelectedItems().length === 0}
        >
          <Text style={styles.continueButtonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
  productsList: {
    flex: 1,
    padding: 20,
  },
  productItem: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#8E8E93',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    minWidth: 30,
    textAlign: 'center',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  continueButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#C7C7CC',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
