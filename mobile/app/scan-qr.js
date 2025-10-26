import { StyleSheet, Text, View, TouchableOpacity, Alert, Platform, Dimensions, TextInput, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect, useRef, useCallback } from 'react';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

export default function ScanQRPage() {
  const router = useRouter();
  const [manualCode, setManualCode] = useState('');
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const textInputRef = useRef(null);

  const hasPermission = permission?.granted;

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    setLoading(true);
    
    try {
      // Simular procesamiento del código QR
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Extraer código del grupo de los datos del QR
      // En una implementación real, aquí procesarías los datos del QR
      const groupCode = data; // Asumiendo que el QR contiene directamente el código
      
      // Redirigir a la sala de espera con el código del grupo
      router.push(`/user/waiting-room?code=${groupCode}`);
    } catch (error) {
      setLoading(false);
      setScanned(false);
      Alert.alert('Error', 'No se pudo procesar el código QR. Intenta de nuevo.');
    }
  };

  const handleManualSubmit = useCallback(async () => {
    if (!manualCode.trim()) {
      Alert.alert('Error', 'Por favor ingresa un código válido');
      return;
    }
    
    setLoading(true);
    
    try {
      // Simular validación del código y unirse al grupo
      // En una implementación real, aquí harías la llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirigir a la sala de espera con el código del grupo
      router.push(`/user/waiting-room?code=${manualCode}`);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'No se pudo unir al grupo. Verifica el código e intenta de nuevo.');
    }
  }, [manualCode, router]);

  const resetScanner = () => {
    setScanned(false);
    setCameraActive(false);
  };

  const toggleCamera = useCallback(() => {
    if (hasPermission) {
      if (cameraActive) {
        setCameraActive(false);
        setScanned(false);
      } else {
        setCameraActive(true);
        setScanned(false);
      }
    }
  }, [hasPermission, cameraActive]);

  const Content = () => {
    if (!permission) {
      return (
        <View style={styles.content}>
          <ActivityIndicator size="large" color="#1E40AF" />
          <Text style={styles.loadingText}>Solicitando permisos de cámara...</Text>
        </View>
      );
    }

    if (!hasPermission) {
      return (
        <View style={styles.content}>
          <View style={styles.permissionContainer}>
            <Ionicons name="camera-outline" size={64} color="#6B7280" />
            <Text style={styles.permissionTitle}>Permisos de cámara requeridos</Text>
            <Text style={styles.permissionText}>
              Necesitamos acceso a la cámara para escanear códigos QR
            </Text>
            <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
              <Text style={styles.permissionButtonText}>Conceder permisos</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.scannerContainer}>
          <TouchableOpacity 
            style={styles.scannerFrame} 
            onPress={toggleCamera}
            activeOpacity={0.8}
          >
            {cameraActive && !scanned ? (
              <CameraView
                style={styles.camera}
                facing="back"
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                  barcodeTypes: ['qr'],
                }}
              >
                <View style={styles.scannerOverlay}>
                  <View style={styles.scannerCorner} />
                  <View style={[styles.scannerCorner, styles.scannerCornerTopRight]} />
                  <View style={[styles.scannerCorner, styles.scannerCornerBottomLeft]} />
                  <View style={[styles.scannerCorner, styles.scannerCornerBottomRight]} />
                </View>
              </CameraView>
            ) : scanned ? (
              <View style={styles.scannerResult}>
                <ActivityIndicator size="large" color="#1E40AF" />
                <Text style={styles.scannerResultText}>Procesando código...</Text>
              </View>
            ) : (
              <View style={styles.scannerPlaceholder}>
                <Ionicons name="camera-outline" size={64} color="#1E40AF" />
                <Text style={styles.scannerPlaceholderText}>Toca para activar cámara</Text>
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.scannerLabel}>Escanea el código QR del grupo</Text>
          <Text style={styles.scannerSubtext}>
            {cameraActive ? 'Toca para desactivar la cámara' : 'Toca el área del escáner para activar la cámara'}
          </Text>
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>O</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.manualSection}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Código del grupo</Text>
            <TextInput
              ref={textInputRef}
              style={styles.textInput}
              value={manualCode}
              onChangeText={setManualCode}
              placeholder="Ingresa el código del grupo"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={20}
              selectTextOnFocus={true}
              blurOnSubmit={false}
              returnKeyType="done"
              keyboardType="default"
              autoFocus={false}
              onFocus={() => {
                // Asegurar que la cámara esté desactivada cuando se enfoca el input
                if (cameraActive) {
                  setCameraActive(false);
                }
              }}
            />
          </View>

          <TouchableOpacity 
            style={[styles.submitButton, !manualCode.trim() && styles.submitButtonDisabled]} 
            onPress={handleManualSubmit}
            disabled={!manualCode.trim() || loading}
          >
             {loading ? (
               <ActivityIndicator size="small" color="#FFFFFF" />
             ) : (
               <>
                 <View style={styles.buttonIconContainer}>
                   <Ionicons name="person-add" size={20} color="#FFFFFF" />
                 </View>
                 <Text style={styles.submitButtonText}>UNIRSE AL GRUPO</Text>
               </>
             )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header con gradiente bancario */}
      <LinearGradient
        colors={['#1e3c72', '#2a5298', '#3b82f6']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Unirse a Grupo</Text>
        </View>
      </LinearGradient>

      {/* Contenido */}
      <View style={styles.content}>
        <Content />
      </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  
  
  // Contenido
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  
  // Estilos para carga
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  
  // Estilos para permisos
  permissionContainer: {
    alignItems: 'center',
    padding: 24,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: '#1E40AF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Estilos para el contenido
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    alignItems: 'center',
    padding: 24,
  },
  scannerContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  scannerFrame: {
    width: 280,
    height: 280,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 3,
    borderColor: '#1E40AF',
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  scannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#1E40AF',
    borderWidth: 3,
  },
  scannerCornerTopRight: {
    top: 20,
    right: 20,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  scannerCornerBottomLeft: {
    bottom: 20,
    left: 20,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  scannerCornerBottomRight: {
    bottom: 20,
    right: 20,
    borderTopWidth: 0,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderLeftWidth: 0,
  },
  scannerResult: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  scannerResultText: {
    marginTop: 16,
    fontSize: 16,
    color: '#1E40AF',
    fontWeight: '600',
  },
  scannerPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  scannerPlaceholderText: {
    marginTop: 16,
    fontSize: 16,
    color: '#1E40AF',
    fontWeight: '600',
    textAlign: 'center',
  },
  scannerLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  scannerSubtext: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },
  
  // Estilos para sección manual
  manualSection: {
    width: '100%',
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  submitButton: {
    backgroundColor: '#1E40AF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 16,
    width: '100%',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  
  // Estilos comunes
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 20,
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  buttonIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
