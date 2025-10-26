import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Animated, Platform, Dimensions, Alert, ActivityIndicator } from "react-native";
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { useState, useRef, useEffect } from "react";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import LoadingPayment from '../components/LoadingPayment';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProductosPage() {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [productQuantities, setProductQuantities] = useState({}); // Cantidades disponibles por producto
  const [userSelections, setUserSelections] = useState({}); // Cantidades seleccionadas por el usuario
  const [activeTab, setActiveTab] = useState('PRODUCTOS');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [receiptInfo, setReceiptInfo] = useState(null);
  const [ticketInfo, setTicketInfo] = useState(null);
  const [isLoadingTicket, setIsLoadingTicket] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadReceiptData();
  }, []);

  const loadReceiptData = async () => {
    try {
      console.log('📦 Cargando datos del recibo desde AsyncStorage...');
      const receiptJSON = await AsyncStorage.getItem('currentReceipt');
      
      if (receiptJSON) {
        const receipt = JSON.parse(receiptJSON);
        console.log('✅ Recibo encontrado:', receipt);
        
        setReceiptInfo(receipt);
        
        // También establecer ticketInfo con los mismos datos
        setTicketInfo(receipt);
        
        // Convertir los artículos del recibo al formato de productos
        const productsFromReceipt = receipt.articles.map((article, index) => ({
          id: index + 1,
          name: article.descripcion || article.nombre || article.name || `Producto ${index + 1}`,
          price: parseFloat(article.precio_unitario || article.precio || article.price || 0),
          quantity: article.cantidad || 1,
          lineTotal: parseFloat(article.monto_linea || 0)
        }));
        
        // Inicializar cantidades disponibles y selecciones del usuario
        const initialQuantities = {};
        const initialSelections = {};
        productsFromReceipt.forEach(product => {
          initialQuantities[product.id] = product.quantity;
          initialSelections[product.id] = 0;
        });
        
        setProductQuantities(initialQuantities);
        setUserSelections(initialSelections);
        
        console.log('🛍️ Productos cargados:', productsFromReceipt);
        console.log('📊 Cantidades iniciales:', initialQuantities);
        setProducts(productsFromReceipt);
      } else {
        console.log('⚠️ No se encontró recibo guardado');
        Alert.alert(
          'Sin productos',
          'No se encontraron productos del ticket. Por favor, escanea un ticket primero.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('❌ Error al cargar productos:', error);
      Alert.alert('Error', 'No se pudieron cargar los productos del ticket');
    } finally {
      setLoading(false);
    }
  };

  const toggleProductSelection = (productId) => {
    const currentAvailable = productQuantities[productId] || 0;
    const currentSelected = userSelections[productId] || 0;
    
    if (currentSelected > 0) {
      // Si ya tiene elementos seleccionados, deseleccionar todo
      setUserSelections(prev => ({
        ...prev,
        [productId]: 0
      }));
      setSelectedProducts(prev => {
        const newSelected = new Set(prev);
        newSelected.delete(productId);
        return newSelected;
      });
    } else if (currentAvailable > 0) {
      // Si hay disponibilidad, seleccionar 1 elemento
      setUserSelections(prev => ({
        ...prev,
        [productId]: 1
      }));
      setProductQuantities(prev => ({
        ...prev,
        [productId]: currentAvailable - 1
      }));
      setSelectedProducts(prev => {
        const newSelected = new Set(prev);
        newSelected.add(productId);
        return newSelected;
      });
    }
  };

  const adjustProductQuantity = (productId, delta) => {
    const currentAvailable = productQuantities[productId] || 0;
    const currentSelected = userSelections[productId] || 0;
    const newSelected = Math.max(0, currentSelected + delta);
    const maxSelectable = Math.min(newSelected, currentAvailable + currentSelected);
    
    if (newSelected <= maxSelectable && newSelected >= 0) {
      setUserSelections(prev => ({
        ...prev,
        [productId]: newSelected
      }));
      
      setProductQuantities(prev => ({
        ...prev,
        [productId]: currentAvailable - (newSelected - currentSelected)
      }));
      
      // Actualizar selección si no hay elementos seleccionados
      if (newSelected === 0) {
        setSelectedProducts(prev => {
          const newSelectedSet = new Set(prev);
          newSelectedSet.delete(productId);
          return newSelectedSet;
        });
      } else {
        setSelectedProducts(prev => {
          const newSelectedSet = new Set(prev);
          newSelectedSet.add(productId);
          return newSelectedSet;
        });
      }
    }
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
    return products
      .filter(product => selectedProducts.has(product.id))
      .map(product => ({
        ...product,
        selectedQuantity: userSelections[product.id] || 0
      }));
  };

  const getTotal = () => {
    return getSelectedItems().reduce((total, product) => 
      total + (product.price * product.selectedQuantity), 0);
  };

  const handlePayment = () => {
    setIsProcessingPayment(true);
  };

  const handlePaymentComplete = () => {
    setIsProcessingPayment(false);
    setIsPaymentCompleted(true);
  };

  // Función para refrescar datos del ticket
  const handleRefreshTicketData = async () => {
    console.log('🔄 Refrescando datos del ticket...');
    setIsLoadingTicket(true);
    
    try {
      const ticketDataString = await AsyncStorage.getItem('currentReceipt');
      console.log('📦 Datos encontrados al refrescar:', !!ticketDataString);
      
      if (ticketDataString) {
        const ticketData = JSON.parse(ticketDataString);
        setTicketInfo(ticketData);
        setReceiptInfo(ticketData);
        
        const ticketProducts = ticketData.articles?.map((articulo, index) => ({
          id: index + 1,
          name: articulo.descripcion,
          price: articulo.precio_unitario,
          quantity: articulo.cantidad,
          total: articulo.monto_linea
        })) || [];
        
        setProducts(ticketProducts);
        console.log('🎫 Datos del ticket cargados al refrescar:', ticketData);
        console.log('🛒 Productos cargados al refrescar:', ticketProducts);
      } else {
        console.log('📝 No hay datos del ticket al refrescar');
      }
    } catch (error) {
      console.error('Error refrescando datos del ticket:', error);
    } finally {
      setIsLoadingTicket(false);
    }
  };

  // Función de prueba para simular datos del ticket
  const handleTestTicketData = async () => {
    const testTicketData = {
      "receipt_id": 2,
      "store_name": "TERRAZA SALTILLO",
      "total": 2149,
      "articles": [
        {
          "descripcion": "PARRILLADA DOS PERSO",
          "cantidad": 1,
          "precio_unitario": 395,
          "monto_linea": 395
        },
        {
          "descripcion": "REFRESCO (A ELEGIR)",
          "cantidad": 3,
          "precio_unitario": 40,
          "monto_linea": 120
        },
        {
          "descripcion": "HMBURGUESA BAÑADA",
          "cantidad": 2,
          "precio_unitario": 190,
          "monto_linea": 380
        }
      ]
    };

    try {
      await AsyncStorage.setItem('currentReceipt', JSON.stringify(testTicketData));
      console.log('🧪 Datos de prueba guardados en AsyncStorage');
      // Recargar la página para simular la llegada de datos
      window.location.reload();
    } catch (error) {
      console.error('Error guardando datos de prueba:', error);
    }
  };

  const ProductosContent = () => (
    <View style={styles.tabContent}>
      {/* Botones de control - solo mostrar si no hay datos del ticket */}
      {!ticketInfo && (
        <View style={styles.testButtonContainer}>
          <TouchableOpacity 
            style={styles.testButton}
            onPress={handleTestTicketData}
          >
            <Ionicons name="flask" size={20} color="#FFFFFF" />
            <Text style={styles.testButtonText}>Probar con Datos del Ticket</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={handleRefreshTicketData}
          >
            <Ionicons name="refresh" size={20} color="#FFFFFF" />
            <Text style={styles.refreshButtonText}>Refrescar Datos</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <ScrollView style={styles.productsList}>
        <View style={styles.productsGrid}>
          {products.map((product) => {
            const isSelected = selectedProducts.has(product.id);
            const availableQuantity = productQuantities[product.id] || 0;
            const selectedQuantity = userSelections[product.id] || 0;
            const canSelect = availableQuantity > 0;
            
            return (
              <TouchableOpacity 
                key={product.id} 
                style={[
                  styles.productCard,
                  isSelected && styles.productCardSelected,
                  !canSelect && styles.productCardDisabled
                ]}
                onPress={() => canSelect && toggleProductSelection(product.id)}
                activeOpacity={canSelect ? 0.7 : 1}
                disabled={!canSelect}
              >
                <View style={[
                  styles.cardContent,
                  isSelected && styles.cardContentSelected
                ]}>
                  <Text style={[
                    styles.productName,
                    isSelected && styles.productNameSelected,
                    !canSelect && styles.productNameDisabled
                  ]}>
                    {product.name}
                  </Text>
                  <Text style={[
                    styles.productPrice,
                    isSelected && styles.productPriceSelected,
                    !canSelect && styles.productPriceDisabled
                  ]}>
                    ${product.price.toFixed(2)}
                  </Text>
                  <Text style={[
                    styles.productQuantity,
                    isSelected && styles.productQuantitySelected,
                    !canSelect && styles.productQuantityDisabled
                  ]}>
                    Disponibles: {availableQuantity}
                  </Text>
                  {selectedQuantity > 0 && (
                    <Text style={styles.selectedQuantity}>
                      Seleccionados: {selectedQuantity}
                    </Text>
                  )}
                  {isSelected && (
                    <View style={styles.selectedIndicator}>
                      <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
                    </View>
                  )}
                </View>
                
                {/* Controles de cantidad - solo mostrar si el producto está seleccionado Y hay más de 1 disponible */}
                {isSelected && product.quantity > 1 && (
                  <View style={styles.quantityControls}>
                    <TouchableOpacity 
                      style={[styles.quantityButton, selectedQuantity <= 0 && styles.quantityButtonDisabled]}
                      onPress={() => adjustProductQuantity(product.id, -1)}
                      disabled={selectedQuantity <= 0}
                    >
                      <Ionicons name="remove" size={16} color={selectedQuantity <= 0 ? "#C7C7CC" : "#007AFF"} />
                    </TouchableOpacity>
                    
                    <Text style={styles.quantityText}>{selectedQuantity}</Text>
                    
                    <TouchableOpacity 
                      style={[styles.quantityButton, availableQuantity <= 0 && styles.quantityButtonDisabled]}
                      onPress={() => adjustProductQuantity(product.id, 1)}
                      disabled={availableQuantity <= 0}
                    >
                      <Ionicons name="add" size={16} color={availableQuantity <= 0 ? "#C7C7CC" : "#007AFF"} />
                    </TouchableOpacity>
                  </View>
                )}
                
                {/* Espaciador invisible para mantener altura consistente */}
                {isSelected && product.quantity <= 1 && (
                  <View style={styles.quantityControlsInvisible} />
                )}
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
                    {item.selectedQuantity} x ${item.price.toFixed(2)} = ${(item.price * item.selectedQuantity).toFixed(2)}
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

  // Mostrar loading mientras se cargan los productos
  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#1e3c72', '#2a5298', '#3b82f6']}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Productos</Text>
          </View>
        </LinearGradient>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E40AF" />
          <Text style={styles.loadingText}>Cargando productos...</Text>
        </View>
      </View>
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
          {receiptInfo && (
            <Text style={styles.storeName}>
              {receiptInfo.store_name || 'Ticket'}
            </Text>
          )}
          <Text style={styles.subtitle}>
            {activeTab === 'PRODUCTOS' 
              ? 'Selecciona los productos que te corresponden' 
              : 'Revisa los productos seleccionados'
            }
          </Text>
          {ticketInfo && (
            <Text style={styles.ticketInfo}>
              Total del ticket: ${ticketInfo.total?.toFixed(2) || '0.00'}
            </Text>
          )}
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
    marginBottom: 4,
  },
  storeName: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  ticketInfo: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
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
  productQuantity: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
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
  productQuantitySelected: {
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
  // Estilos para el indicador de carga
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  // Estilos para el botón de prueba
  testButtonContainer: {
    padding: 20,
    backgroundColor: '#F8FAFC',
    gap: 12,
  },
  testButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  refreshButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  // Estilos para el sistema de cantidades
  productCardDisabled: {
    opacity: 0.5,
    backgroundColor: '#F5F5F5',
  },
  productNameDisabled: {
    color: '#C7C7CC',
  },
  productPriceDisabled: {
    color: '#C7C7CC',
  },
  productQuantityDisabled: {
    color: '#C7C7CC',
  },
  selectedQuantity: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  quantityControlsInvisible: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    opacity: 0,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quantityButtonDisabled: {
    backgroundColor: '#F5F5F5',
    shadowOpacity: 0,
    elevation: 0,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
});
