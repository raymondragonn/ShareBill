import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Animated, ActivityIndicator } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function LoadingPayment({ 
  isProcessing = false, 
  isCompleted = false, 
  onComplete = () => {},
  total = 0,
  paymentMethod = 'NFC'
}) {
  const [animationValue] = useState(new Animated.Value(0));
  const [pulseValue] = useState(new Animated.Value(1));
  const [dots, setDots] = useState('');

  // Animación de pulso para el ícono de carga
  useEffect(() => {
    if (isProcessing) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();

      return () => pulseAnimation.stop();
    }
  }, [isProcessing, pulseValue]);

  // Animación de entrada para el estado completado
  useEffect(() => {
    if (isCompleted) {
      Animated.spring(animationValue, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }
  }, [isCompleted, animationValue]);

  // Animación de puntos de carga
  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setDots(prev => {
          if (prev === '...') return '';
          return prev + '.';
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isProcessing]);

  // Simular proceso de pago
  useEffect(() => {
    if (isProcessing) {
      const timer = setTimeout(() => {
        onComplete();
      }, 3000); // Simula 3 segundos de procesamiento

      return () => clearTimeout(timer);
    }
  }, [isProcessing, onComplete]);

  if (isCompleted) {
    return (
      <Animated.View 
        style={[
          styles.container,
          {
            opacity: animationValue,
            transform: [{
              scale: animationValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              })
            }]
          }
        ]}
      >
        <View style={styles.content}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={80} color="#34C759" />
          </View>
          
          <Text style={styles.title}>¡PAGO COMPLETADO!</Text>
          <Text style={styles.subtitle}>El pago se ha procesado exitosamente</Text>
          
          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Ionicons name="terminal" size={20} color="#949494" />
              <Text style={styles.detailText}>TERMINAL</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="time" size={20} color="#949494" />
              <Text style={styles.detailText}>Procesado</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="radio" size={20} color="#949494" />
              <Text style={styles.detailText}>Pago con {paymentMethod}</Text>
            </View>
          </View>

          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>Resumen del pago</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total pagado:</Text>
              <Text style={styles.summaryAmount}>${total.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Método:</Text>
              <Text style={styles.summaryMethod}>{paymentMethod}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Fecha:</Text>
              <Text style={styles.summaryDate}>
                {new Date().toLocaleDateString('es-ES', { 
                  day: 'numeric', 
                  month: 'short', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  }

  if (isProcessing) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Animated.View 
            style={[
              styles.loadingIcon,
              {
                transform: [{ scale: pulseValue }]
              }
            ]}
          >
            <ActivityIndicator size="large" color="#007AFF" />
            <Ionicons 
              name="card" 
              size={40} 
              color="#007AFF" 
              style={styles.cardIcon}
            />
          </Animated.View>
          
          <Text style={styles.loadingTitle}>Procesando pago{dots}</Text>
          <Text style={styles.loadingSubtitle}>
            Por favor espera mientras procesamos tu pago
          </Text>
          
          <View style={styles.processingDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="radio" size={20} color="#007AFF" />
              <Text style={styles.detailText}>Conectando con {paymentMethod}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="shield-checkmark" size={20} color="#007AFF" />
              <Text style={styles.detailText}>Verificando seguridad</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="time" size={20} color="#007AFF" />
              <Text style={styles.detailText}>Procesando transacción</Text>
            </View>
          </View>

          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Total a pagar:</Text>
            <Text style={styles.amountValue}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  // Estilos para el estado de carga
  loadingIcon: {
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIcon: {
    position: 'absolute',
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 10,
  },
  loadingSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 40,
  },
  processingDetails: {
    backgroundColor: '#F2F2F7',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    width: '100%',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#1C1C1E',
    marginLeft: 12,
    fontWeight: '500',
  },
  amountContainer: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  amountValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  // Estilos para el estado completado
  successIcon: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 40,
  },
  details: {
    backgroundColor: '#F2F2F7',
    padding: 24,
    borderRadius: 15,
    marginBottom: 30,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summary: {
    backgroundColor: '#F2F2F7',
    padding: 24,
    borderRadius: 15,
    marginBottom: 30,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 15,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  summaryMethod: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
  },
  summaryDate: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
  },
});
