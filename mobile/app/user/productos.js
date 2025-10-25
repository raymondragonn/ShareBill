import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Animated, Platform, Dimensions } from "react-native";
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { useState, useRef } from "react";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import LoadingPayment from '../components/LoadingPayment';

export default function ProductosPage() {
  const [products, setProducts] = useState([
    { id: 1, name: 'Hamburguesa', price: 12.50 },
    { id: 2, name: 'Leche', price: 3.20 },
    { id: 3, name: 'Limón', price: 1.50 },
    { id: 4, name: 'Pan', price: 2.80 },
    { id: 5, name: 'Café', price: 4.50 },
  ]);
  
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [activeTab, setActiveTab] = useState('PRODUCTOS');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;

  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(productId)) {
        newSelected.delete(productId);
      } else {
        newSelected.add(productId);
      }
      return newSelected;
    });
  };

  const switchToTab = (tab) => {
    setActiveTab(tab);
    const toValue = tab === 'PRODUCTOS' ? 0 : -1;
    Animated.spring(translateX, {
      toValue,
      useNativeDriver: true,
    }).start();
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX, velocityX } = event.nativeEvent;
      
      if (Math.abs(translationX) > 50 || Math.abs(velocityX) > 500) {
        if (translationX > 0 && activeTab === 'TOTAL') {
          switchToTab('PRODUCTOS');
        } else if (translationX < 0 && activeTab === 'PRODUCTOS') {
          switchToTab('TOTAL');
        } else {
          Animated.spring(translateX, {
            toValue: activeTab === 'PRODUCTOS' ? 0 : -1,
            useNativeDriver: true,
          }).start();
        }
      } else {
        Animated.spring(translateX, {
          toValue: activeTab === 'PRODUCTOS' ? 0 : -1,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const getSelectedItems = () => {
    return products.filter(product => selectedProducts.has(product.id));
  };

  const getTotal = () => {
    return getSelectedItems().reduce((total, product) => total + product.price, 0);
  };

  const handlePayment = () => {
    setIsProcessingPayment(true);
  };

  const handlePaymentComplete = () => {
    setIsProcessingPayment(false);
    setIsPaymentCompleted(true);
  };

  const ProductosContent = () => (
    <View style={styles.tabContent}>
      <ScrollView style={styles.productsList}>
        <View style={styles.productsGrid}>
          {products.map((product) => {
            const isSelected = selectedProducts.has(product.id);
            return (
              <TouchableOpacity 
                key={product.id} 
                style={[
                  styles.productCard,
                  isSelected && styles.productCardSelected
                ]}
                onPress={() => toggleProductSelection(product.id)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.cardContent,
                  isSelected && styles.cardContentSelected
                ]}>
                  <Text style={[
                    styles.productName,
                    isSelected && styles.productNameSelected
                  ]}>
                    {product.name}
                  </Text>
                  <Text style={[
                    styles.productPrice,
                    isSelected && styles.productPriceSelected
                  ]}>
                    ${product.price.toFixed(2)}
                  </Text>
                  {isSelected && (
                    <View style={styles.selectedIndicator}>
                      <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );

  const TotalContent = () => {
    const selectedItems = getSelectedItems();
    
    return (
      <View style={styles.tabContent}>
        <ScrollView style={styles.itemsList}>
          {selectedItems.length > 0 ? (
            selectedItems.map((item, index) => (
              <View key={item.id} style={styles.itemRow}>
                <Text style={styles.itemNumber}>{index + 1}.</Text>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDetails}>
                    1 x ${item.price.toFixed(2)} = ${item.price.toFixed(2)}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="cart-outline" size={64} color="#8E8E93" />
              <Text style={styles.emptyTitle}>No hay productos seleccionados</Text>
              <Text style={styles.emptySubtitle}>Selecciona productos en la pestaña anterior</Text>
            </View>
          )}
        </ScrollView>

        {selectedItems.length > 0 && (
          <View style={styles.totalSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal:</Text>
              <Text style={styles.totalAmount}>${getTotal().toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Impuestos:</Text>
              <Text style={styles.totalAmount}>$0.00</Text>
            </View>
            <View style={[styles.totalRow, styles.finalTotal]}>
              <Text style={styles.finalTotalLabel}>Total:</Text>
              <Text style={styles.finalTotalAmount}>${getTotal().toFixed(2)}</Text>
            </View>
          </View>
        )}

        {selectedItems.length > 0 && (
          <View style={styles.footer}>
            <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
              <Ionicons name="card" size={24} color="#FFFFFF" />
              <Text style={styles.payButtonText}>PAGAR</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  // Mostrar componente de carga si está procesando o completado
  if (isProcessingPayment || isPaymentCompleted) {
    return (
      <LoadingPayment
        isProcessing={isProcessingPayment}
        isCompleted={isPaymentCompleted}
        onComplete={handlePaymentComplete}
        total={getTotal()}
        paymentMethod="NFC"
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Header con gradiente bancario */}
      <LinearGradient
        colors={['#1e3c72', '#2a5298', '#3b82f6']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Productos</Text>
          <Text style={styles.subtitle}>
            {activeTab === 'PRODUCTOS' 
              ? 'Selecciona los productos que te corresponden' 
              : 'Revisa los productos seleccionados'
            }
          </Text>
        </View>
      </LinearGradient>

      {/* Barra de navegación con pestañas */}
      <View style={styles.tabBar}>
              <TouchableOpacity 
          style={[styles.tab, activeTab === 'PRODUCTOS' && styles.activeTab]}
          onPress={() => switchToTab('PRODUCTOS')}
        >
          <Text style={[styles.tabText, activeTab === 'PRODUCTOS' && styles.activeTabText]}>PRODUCTOS</Text>
              </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'TOTAL' && styles.activeTab]}
          onPress={() => switchToTab('TOTAL')}
        >
          <Text style={[styles.tabText, activeTab === 'TOTAL' && styles.activeTabText]}>TOTAL</Text>
        </TouchableOpacity>
      </View>

      {/* Contenido con swipe */}
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        activeOffsetX={[-10, 10]}
        failOffsetY={[-5, 5]}
      >
        <Animated.View style={[styles.contentContainer, { transform: [{ translateX }] }]}>
          <View style={styles.content}>
            {activeTab === 'PRODUCTOS' ? <ProductosContent /> : <TotalContent />}
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  
  // Header con gradiente
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  // Estilos para la barra de navegación
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginTop: -20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 20,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#1E40AF',
    backgroundColor: '#F8FAFC',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#1E40AF',
    fontWeight: '700',
  },
  // Contenedor del contenido
  contentContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    width: '100%',
  },
  productsList: {
    flex: 1,
    padding: 20,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
  },
  productCardSelected: {
    opacity: 0.4,
    backgroundColor: '#F2F2F7',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  cardContentSelected: {
    opacity: 0.6,
  },
  productNameSelected: {
    color: '#8E8E93',
    textDecorationLine: 'line-through',
  },
  productPriceSelected: {
    color: '#8E8E93',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  // Estilos para la vista de total
  itemsList: {
    flex: 1,
    padding: 20,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
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
  itemNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginRight: 12,
    marginTop: 2,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 14,
    color: '#8E8E93',
  },
  totalSection: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: '#8E8E93',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  finalTotal: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingTop: 12,
    marginTop: 8,
  },
  finalTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  finalTotalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  payButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  // Estado vacío
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
  },
});
