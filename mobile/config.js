import { Platform } from "react-native";

const LOCAL_IP = "192.168.56.1"; //PONER TU IP LOCAL
const LOCAL_PORT = "8000";

// 🔍 Detectar en qué entorno se está ejecutando
let API_URL = "";

// ✅ Android real (Expo Go en tu celular)
if (Platform.OS === "android") {
    API_URL = `http://${LOCAL_IP}:${LOCAL_PORT}`;
}
// ✅ iOS (en simulador o Expo Go en iPhone)
else if (Platform.OS === "ios") {
    API_URL = `http://${LOCAL_IP}:${LOCAL_PORT}`;
}
// ✅ Web (cuando corres "npx expo start --web")
else {
    API_URL = "http://localhost:8000";
}

export { API_URL };
