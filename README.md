# 💰 ShareBill

**ShareBill** es una aplicación móvil para dividir gastos y facturas de manera fácil y justa. Permite a grupos de personas compartir cuentas, escanear tickets y distribuir costos automáticamente mediante inteligencia artificial.

![ShareBill Logo](./mobile/assets/LogoEmpresa2.png)

---

## 📱 Características Principales

- ✅ **Autenticación de Usuarios** - Registro e inicio de sesión seguros
- 🎫 **Escaneo de Tickets** - Análisis automático de facturas con IA (Google Gemini)
- 👥 **Gestión de Grupos** - Crear y unirse a grupos por código QR
- 💳 **Distribución Inteligente** - Cálculo automático de gastos compartidos
- 📊 **Dashboard de Gastos** - Visualización de gastos y pagos por grupo
- 💰 **Monedero Virtual** - Sistema de pagos integrado
- 👤 **Perfil de Usuario** - Gestión de información personal

---

## 🛠️ Tecnologías Utilizadas

### Frontend (Móvil)
- **React Native** - Framework móvil multiplataforma
- **Expo** - SDK para desarrollo rápido
- **Expo Router** - Sistema de navegación
- **AsyncStorage** - Almacenamiento local
- **Axios** - Cliente HTTP
- **Expo Camera** - Escaneo de QR y captura de imágenes
- **Linear Gradient** - Interfaces con gradientes

### Backend
- **FastAPI** - Framework web asíncrono de Python
- **SQLAlchemy** - ORM para base de datos
- **PostgreSQL** - Base de datos relacional
- **Google Gemini AI** - Análisis inteligente de tickets
- **Pillow** - Procesamiento de imágenes
- **QRCode** - Generación de códigos QR

### DevOps
- **Docker** - Contenedores para backend y base de datos
- **Docker Compose** - Orquestación de servicios

---

## 📋 Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (v20.10+)
- [Node.js](https://nodejs.org/) (v18 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Git](https://git-scm.com/)

Para verificar las instalaciones:

```bash
docker --version
node -v
npm -v
npx expo --version
```

---

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/ShareBill.git
cd ShareBill
```

### 2. Configurar Variables de Entorno

#### Backend
Crea un archivo `.env` en la raíz del proyecto:

```bash
# Base de datos
POSTGRES_USER=sharebill
POSTGRES_PASSWORD=tu_password_segura
POSTGRES_DB=sharebill_db

# API Keys
GEMINI_API_KEY=tu_api_key_de_google
```

#### Mobile
Edita `mobile/config.js` y actualiza tu IP local:

```javascript
const LOCAL_IP = "TU_IP_LOCAL"; // Ejemplo: "192.168.1.100"
```

**Cómo obtener tu IP local:**
- **Windows:** `ipconfig` en CMD
- **Mac/Linux:** `ifconfig` o `ip addr`

### 3. Instalar Dependencias

```bash
# Instalar dependencias del móvil
cd mobile
npm install

# Volver a la raíz
cd ..
```

### 4. Iniciar el Backend (Docker)

```bash
# Desde la raíz del proyecto
docker-compose up -d

# Verificar que los contenedores estén corriendo
docker ps
```

Esto iniciará:
- **PostgreSQL** en `localhost:5432`
- **Backend API** en `localhost:8000`
- **API Docs** en `http://localhost:8000/docs`

### 5. Iniciar la Aplicación Móvil

```bash
cd mobile

# Iniciar Expo
npx expo start

# Opciones adicionales
npx expo start --ios      # Abrir en simulador iOS
npx expo start --android  # Abrir en emulador Android
npx expo start --web      # Abrir en navegador web
```

### 6. Probar en tu Dispositivo

1. Escanea el código QR con **Expo Go** (iOS o Android)
2. La app se descargará y abrirá automáticamente

---

## 📁 Estructura del Proyecto

```
ShareBill/
├── 📂 backend/               # Backend API (FastAPI)
│   ├── app/
│   │   ├── models/           # Modelos de base de datos
│   │   ├── routes/           # Endpoints de la API
│   │   ├── services/         # Lógica de negocio
│   │   └── main.py           # Aplicación principal
│   ├── Dockerfile
│   └── requirements.txt
│
├── 📂 mobile/                 # App móvil (React Native)
│   ├── app/
│   │   ├── auth/            # Login y registro
│   │   ├── admin/           # Pantallas de administrador
│   │   ├── user/            # Pantallas de usuario
│   │   ├── components/      # Componentes reutilizables
│   │   └── _layout.js       # Layout principal
│   ├── assets/              # Imágenes y recursos
│   ├── config.js            # Configuración de API
│   └── package.json
│
├── 📄 docker-compose.yml    # Configuración de Docker
└── 📄 README.md            # Este archivo
```

---

## 🔧 Endpoints de la API

### Usuarios
- `POST /users` - Registrar nuevo usuario
- `POST /users/login` - Iniciar sesión
- `GET /users/{id}` - Obtener usuario
- `PUT /users/{id}` - Actualizar usuario

### Grupos
- `POST /groups` - Crear nuevo grupo
- `GET /groups/{id}` - Obtener grupo
- `GET /groups` - Listar grupos del usuario
- `POST /groups/{id}/members` - Agregar miembro

### Tickets (Facturas)
- `POST /tickets` - Crear ticket y procesar con IA
- `GET /tickets/{id}` - Obtener ticket
- `GET /tickets/group/{group_id}` - Listar tickets del grupo

### Pagos
- `POST /payments` - Registrar pago
- `GET /payments/group/{group_id}` - Obtener pagos del grupo
- `PUT /payments/{id}` - Actualizar estado de pago

**Documentación completa:** `http://localhost:8000/docs`

---

## 🎯 Uso de la Aplicación

### 1. Crear Cuenta
- Registra tu nombre, email y contraseña
- Confirma tu contraseña

### 2. Crear un Grupo
- Presiona "Nuevo grupo"
- Asigna un nombre y código
- Invita miembros escaneando el QR

### 3. Escanear Ticket
- Crea un nuevo ticket en tu grupo
- Toma foto de la factura o escanea el QR
- La IA identificará los ítems y precios

### 4. Distribuir Gastos
- Selecciona qué ítems quiere cada persona
- El sistema calcula automáticamente quién debe pagar
- Visualiza el total por persona

### 5. Gestión de Pagos
- Marca los pagos como completados
- Visualiza el estado de cuentas en tiempo real

---

## 🐳 Comandos Docker Útiles

```bash
# Iniciar servicios
docker-compose up -d

# Detener servicios
docker-compose down

# Ver logs del backend
docker-compose logs -f fastapi_app

# Ver logs de la base de datos
docker-compose logs -f postgres_db

# Reiniciar servicios
docker-compose restart

# Eliminar todo (incluyendo volúmenes)
docker-compose down -v
```

---

## 🧪 Testing

```bash
# Backend (dentro del contenedor)
docker-compose exec fastapi_app pytest

# Mobile
cd mobile
npm test
```

---

## 🐛 Solución de Problemas

### El backend no se conecta a la base de datos
```bash
# Reinicia los contenedores
docker-compose down
docker-compose up -d
```

### Error de conexión desde el móvil
- Verifica que tu IP local en `mobile/config.js` sea correcta
- Asegúrate de que el backend esté corriendo: `docker ps`
- Verifica que estés en la misma red Wi-Fi

### Error al escanear QR
- Verifica los permisos de cámara en tu dispositivo
- Recarga la app en Expo Go

---

## 📝 Licencia

Este proyecto fue desarrollado para un hackathon/evento. Todos los derechos reservados.

---

## 👥 Autores

- Tu equipo de desarrollo

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📧 Contacto

¿Preguntas o sugerencias? Contacta al equipo a través de: [email@ejemplo.com](mailto:email@ejemplo.com)

---

## 🙏 Agradecimientos

- **Google Gemini** - Por la API de inteligencia artificial
- **Expo** - Por el excelente SDK de React Native
- **FastAPI** - Por el framework de backend moderno
- **Comunidad open source** - Por todas las librerías utilizadas

---

<div align="center">
  <p>Hecho con ❤️ para simplificar el reparto de gastos</p>
  <p>ShareBill - Divide, escanea, comparte</p>
</div>
