import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, ActivityIndicator, Platform, Dimensions } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

// Configuración de API según la plataforma
const getApiUrl = () => {
  if (Platform.OS === 'web') {
    // En web, usar localhost directamente
    return 'http://localhost:8000';
  } else if (Platform.OS === 'android') {
    // Android Emulator usa 10.0.2.2 para acceder a localhost del host
    return 'http://10.0.2.2:8000';
  } else if (Platform.OS === 'ios') {
    // iOS Simulator puede usar localhost directamente
    return 'http://localhost:8000';
  } else {
    // Dispositivo físico - CAMBIA ESTA IP POR LA DE TU COMPUTADORA
    // Puedes obtenerla con: ipconfig (Windows) o ifconfig (Mac/Linux)
    return 'http://10.22.124.98:8000'; // Cambia esta IP
  }
};

export default function EscanearTicketPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraPermission.status !== 'granted' || mediaPermission.status !== 'granted') {
      Alert.alert('Permisos necesarios', 'Necesitamos permisos de cámara y galería para continuar');
      return false;
    }
    return true;
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo abrir la cámara');
    }
  };

  const handlePickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo abrir la galería');
    }
  };

  const handleScanTicket = async () => {
    if (!selectedImage) {
        Alert.alert('Sin imagen', 'Por favor, toma o selecciona una foto del ticket primero');
        return;
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎫 INICIANDO ESCANEO DE TICKET');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📸 Imagen seleccionada:', selectedImage);
    console.log('📱 Plataforma:', Platform.OS);

    // Activar el loading
    setIsLoading(true);

    try {
        // 1. Prepara el FormData
        const formData = new FormData();
        const imageUri = selectedImage;

        // 2. Manejar diferente según la plataforma
        if (Platform.OS === 'web') {
            console.log('🌐 Detectado: Plataforma WEB');
            
            // En web, necesitamos convertir el blob URI a un File
            const response = await fetch(imageUri);
            const blob = await response.blob();
            
            // Crear un archivo File desde el blob
            const fileName = `ticket_${Date.now()}.jpg`;
            const file = new File([blob], fileName, { type: blob.type || 'image/jpeg' });
            
            // Agregar el archivo al FormData
            formData.append('imagen', file);
            
            console.log('📦 File creado para web:', {
                name: fileName,
                type: file.type,
                size: file.size
            });
        } else {
            console.log('📱 Detectado: Plataforma MÓVIL');
            
            // En móvil nativo, usar el formato URI estándar
            const fileName = imageUri.split('/').pop() || `ticket_${Date.now()}.jpg`;
            const fileType = fileName.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';

            formData.append('imagen', {
                uri: imageUri,
                name: fileName,
                type: fileType,
            });

            console.log('📦 FormData preparado para móvil:', { 
              uri: imageUri, 
              name: fileName, 
              type: fileType 
            });
        }

        // 3. Configuración del Endpoint
        const BASE_URL = getApiUrl();
        const API_URL = `${BASE_URL}/tickets/procesar`;
        
        console.log('🌐 Enviando petición a:', API_URL);
        console.log('⏳ Esperando respuesta del servidor...');
        const startTime = Date.now();
        
        const response = await axios.post(
            API_URL,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 30000,
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    console.log(`📤 Progreso de subida: ${percentCompleted}%`);
                },
            }
        );

        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ RESPUESTA EXITOSA DEL SERVIDOR');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('⏱️  Tiempo de respuesta:', duration, 'segundos');
        console.log('📊 Status:', response.status);
        console.log('📄 Headers:', JSON.stringify(response.headers, null, 2));
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('💾 DATOS RECIBIDOS:');
        console.log(JSON.stringify(response.data, null, 2));
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        // Desactivar el loading
        setIsLoading(false);

        Alert.alert(
          '✅ Éxito', 
          `Ticket procesado correctamente\n\n` +
          `🏪 Negocio: ${response.data.nombre_negocio || 'N/A'}\n` +
          `🆔 ID: ${response.data.ticket_id || 'N/A'}\n` +
          `📝 Artículos: ${response.data.articulos?.length || 0}\n` +
          `💰 Total: $${response.data.total?.toFixed(2) || '0.00'}`
        );

    } catch (error) {
        // Desactivar el loading en caso de error
        setIsLoading(false);

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('❌ ERROR AL PROCESAR TICKET');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        let errorMessage = 'Error desconocido al procesar el ticket.';

        if (axios.isAxiosError(error) && error.response) {
            console.error("🔴 Error HTTP:", error.response.status);
            console.error("📄 Respuesta del Backend:", JSON.stringify(error.response.data, null, 2));
            console.error("📋 Headers:", JSON.stringify(error.response.headers, null, 2));

            if (error.response.status === 422) {
                errorMessage = "Error de validación (422): Verifica el formato de la imagen.";
            } else {
                errorMessage = `Error ${error.response.status}: ${JSON.stringify(error.response.data)}`;
            }
        } else if (axios.isAxiosError(error) && error.request) {
            console.error("🌐 Error de red - No se recibió respuesta");
            console.error("📡 Request:", error.request);
            errorMessage = "Error de conexión. Verifica que el backend esté corriendo.";
        } else {
            console.error("⚠️  Error:", error.message);
            errorMessage = error.message;
        }
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        Alert.alert('❌ Error', errorMessage);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  return (
    <View style={styles.container}>
      {/* Header con gradiente bancario */}
      <LinearGradient
        colors={['#1e3c72', '#2a5298', '#3b82f6']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Escanear Ticket</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.imageContainer}>
          {selectedImage ? (
            <View style={styles.imageWrapper}>
              <Image source={{ uri: selectedImage }} style={styles.ticketImage} />
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={handleRemoveImage}
              >
                <Ionicons name="close-circle" size={32} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.placeholderContainer}>
              <Ionicons name="receipt-outline" size={80} color="#C7C7CC" />
              <Text style={styles.placeholderText}>No hay imagen seleccionada</Text>
            </View>
          )}
        </View>

        {/* Loading Overlay */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Procesando ticket...</Text>
              <Text style={styles.loadingSubtext}>Esto puede tardar unos segundos</Text>
            </View>
          </View>
        )}

        <Text style={styles.instructionText}>
          Toma una foto o selecciona una imagen del ticket
        </Text>

        <View style={styles.buttonGroup}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleTakePhoto}
          >
            <Ionicons name="camera" size={28} color="#007AFF" />
            <Text style={styles.actionButtonText}>Tomar Foto</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handlePickImage}
          >
            <Ionicons name="images" size={28} color="#007AFF" />
            <Text style={styles.actionButtonText}>Subir Foto</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[
            styles.scanButton,
            (!selectedImage || isLoading) && styles.scanButtonDisabled
          ]}
          onPress={handleScanTicket}
          disabled={!selectedImage || isLoading}
        >
          {isLoading ? (
            <>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={styles.scanButtonText}>PROCESANDO...</Text>
            </>
          ) : (
            <>
              <Ionicons 
                name="scan" 
                size={24} 
                color="#FFFFFF" 
              />
              <Text style={styles.scanButtonText}>ESCANEAR TICKET</Text>
            </>
          )}
        </TouchableOpacity>
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
    paddingBottom: 20,
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
  content: {
    flex: 1,
    padding: 24,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  imageWrapper: {
    flex: 1,
    position: 'relative',
  },
  ticketImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 16,
  },
  instructionText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: '500',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
    marginTop: 12,
  },
  scanButton: {
    backgroundColor: '#1E40AF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  scanButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0.1,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingContainer: {
    backgroundColor: '#FFFFFF',
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
});
