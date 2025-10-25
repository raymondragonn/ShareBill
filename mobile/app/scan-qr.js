import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  SafeAreaView,
  StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { router } from 'expo-router';

export default function ScanQRPage() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    Alert.alert(
      'Código QR Escaneado',
      `Código: ${data}`,
      [
        {
          text: 'Escanear de nuevo',
          onPress: () => setScanned(false),
          style: 'cancel',
        },
        {
          text: 'Continuar',
          onPress: () => {
            // Aquí puedes procesar el código escaneado
            console.log('Código escaneado:', data);
            router.back();
          },
        },
      ]
    );
  };

  const handleManualSubmit = () => {
    if (!manualCode.trim()) {
      Alert.alert('Error', 'Por favor ingresa un código válido');
      return;
    }
    
    Alert.alert(
      'Código Ingresado',
      `Código: ${manualCode}`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Continuar',
          onPress: () => {
            // Aquí puedes procesar el código ingresado manualmente
            console.log('Código manual:', manualCode);
            router.back();
          },
        },
      ]
    );
  };

  const toggleManualInput = () => {
    setShowManualInput(!showManualInput);
    if (!showManualInput) {
      setScanned(true); // Pausar el escáner cuando se muestra la entrada manual
    } else {
      setScanned(false); // Reanudar el escáner cuando se oculta la entrada manual
    }
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#003049" />
        <View style={styles.loadingContainer}>
          <Ionicons name="camera" size={48} color="#669BBC" />
          <Text style={styles.loadingText}>Solicitando permiso para acceder a la cámara...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#003049" />
        <View style={styles.errorContainer}>
          <Ionicons name="camera-off" size={48} color="#C1121F" />
          <Text style={styles.errorTitle}>Acceso a la cámara denegado</Text>
          <Text style={styles.errorText}>
            Para escanear códigos QR, necesitamos acceso a tu cámara. 
            Por favor, habilita los permisos en la configuración de la aplicación.
          </Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#003049" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FDF0D5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Escanear QR</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Scanner */}
      {!showManualInput && (
        <View style={styles.scannerContainer}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={styles.scanner}
          />
          <View style={styles.scannerOverlay}>
            <View style={styles.scannerFrame} />
            <Text style={styles.scannerText}>
              Apunta la cámara al código QR
            </Text>
          </View>
        </View>
      )}

      {/* Manual Input */}
      {showManualInput && (
        <View style={styles.manualContainer}>
          <View style={styles.manualHeader}>
            <Ionicons name="keypad" size={32} color="#003049" />
            <Text style={styles.manualTitle}>Ingresar código manualmente</Text>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Código del grupo</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa el código aquí"
              value={manualCode}
              onChangeText={setManualCode}
              autoCapitalize="characters"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleManualSubmit}>
            <Text style={styles.submitButtonText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Controls */}
      <View style={styles.controlsContainer}>
        {!showManualInput && (
          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={() => setScanned(false)}
          >
            <Ionicons name="refresh" size={24} color="#FDF0D5" />
            <Text style={styles.controlButtonText}>Escanear de nuevo</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={[styles.controlButton, showManualInput && styles.controlButtonActive]} 
          onPress={toggleManualInput}
        >
          <Ionicons 
            name={showManualInput ? "camera" : "keypad"} 
            size={24} 
            color={showManualInput ? "#003049" : "#FDF0D5"} 
          />
          <Text style={[
            styles.controlButtonText, 
            showManualInput && styles.controlButtonTextActive
          ]}>
            {showManualInput ? 'Usar cámara' : 'Ingresar manualmente'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003049',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    fontSize: 18,
    color: '#669BBC',
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#C1121F',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#669BBC',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FDF0D5',
  },
  placeholder: {
    width: 40,
  },
  scannerContainer: {
    flex: 1,
    position: 'relative',
  },
  scanner: {
    flex: 1,
  },
  scannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  scannerFrame: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: '#C1121F',
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  scannerText: {
    fontSize: 18,
    color: '#FDF0D5',
    textAlign: 'center',
    marginTop: 32,
    fontWeight: '600',
  },
  manualContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  manualHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  manualTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003049',
    textAlign: 'center',
    marginTop: 16,
  },
  inputContainer: {
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003049',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#FDF0D5',
    borderWidth: 3,
    borderColor: '#669BBC',
    borderRadius: 20,
    padding: 20,
    fontSize: 18,
    color: '#003049',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#C1121F',
    padding: 20,
    borderRadius: 28,
    alignItems: 'center',
    shadowColor: '#780000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  submitButtonText: {
    color: '#FDF0D5',
    fontSize: 20,
    fontWeight: '700',
  },
  controlsContainer: {
    padding: 24,
    gap: 16,
  },
  controlButton: {
    backgroundColor: '#669BBC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 28,
    shadowColor: '#003049',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  controlButtonActive: {
    backgroundColor: '#FDF0D5',
    borderWidth: 3,
    borderColor: '#003049',
  },
  controlButtonText: {
    color: '#FDF0D5',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 12,
  },
  controlButtonTextActive: {
    color: '#003049',
  },
});
