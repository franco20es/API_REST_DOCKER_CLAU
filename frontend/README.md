# 🧾 Sistema de Facturación - Práctica 3

Sistema completo de facturación desarrollado en React con integración a APIs de RENIEC y SUNAT, conversión de divisas y soporte para Docker.

## ✨ Características

### 🎯 Funcionalidades Principales
- ✅ **CRUD Completo** de facturas (Create, Read, Update, Delete)
- 🔍 **Búsqueda de clientes** por DNI usando API de RENIEC
- 🏢 **Consulta de empresas** por RUC usando API de SUNAT
- 💱 **Conversión automática** de USD a Soles (PEN) con tipo de cambio en tiempo real
- 💾 **Persistencia de datos** con LocalStorage
- 🖨️ **Impresión de facturas**
- 🔎 **Búsqueda y filtrado** de facturas
- 📊 **Estadísticas** en tiempo real

### 🎨 Tecnologías Utilizadas
- **React 19.2** - Framework principal
- **React Hooks** - useState, useEffect, useReducer, useContext, custom hooks
- **Context API** - Manejo de estado global
- **Axios** - Peticiones HTTP
- **CSS3** - Estilos modernos con gradientes y animaciones
- **Docker** - Containerización
- **Nginx** - Servidor web en producción

### 🔌 APIs Integradas
1. **API RENIEC** (PeruDevs) - Consulta de DNI
2. **API SUNAT** (PeruDevs) - Consulta de RUC
3. **ExchangeRate API** - Tipo de cambio USD/PEN en tiempo real

## 📁 Estructura del Proyecto

```
sistema-facturacion/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── ClienteForm.jsx      # Formulario de búsqueda de clientes
│   │   ├── FacturaForm.jsx      # Formulario de facturas (CRUD)
│   │   └── FacturaList.jsx      # Listado y gestión de facturas
│   ├── context/
│   │   └── FacturaContext.jsx   # Context API con useReducer
│   ├── hooks/
│   │   ├── useClientes.js       # Hook para APIs de RENIEC y SUNAT
│   │   ├── useFacturas.js       # Hook para gestión de facturas
│   │   └── useTipoCambio.js     # Hook para conversión de divisas
│   ├── App.css                  # Estilos principales
│   ├── app.jsx                  # Componente principal
│   ├── index.css                # Estilos globales
│   └── index.js                 # Entry point
├── Dockerfile                   # Configuración Docker (multi-stage)
├── docker-compose.yml           # Orquestación de contenedores
├── nginx.conf                   # Configuración Nginx
├── .dockerignore               # Archivos excluidos del build
├── package.json                # Dependencias
└── README.md                   # Este archivo

```

## 🚀 Instalación y Uso

### Opción 1: Ejecución Local

```bash
# Clonar el repositorio
git clone <tu-repositorio>
cd sistema-facturacion

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm start

# El sistema estará disponible en http://localhost:3000
```

### Opción 2: Docker (Recomendado para producción)

```bash
# Construir la imagen
docker build -t sistema-facturacion .

# Ejecutar el contenedor
docker run -p 3000:80 sistema-facturacion

# O usar Docker Compose
docker-compose up -d

# Detener los contenedores
docker-compose down
```

### Opción 3: Deploy en VM

```bash
# En tu VM (Ubuntu/Debian)
# 1. Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 2. Clonar el proyecto
git clone <tu-repositorio>
cd sistema-facturacion

# 3. Build y ejecutar
docker-compose up -d

# 4. Acceder desde el navegador
# http://<IP_DE_TU_VM>:3000
```

## 📖 Guía de Uso

### 1. Buscar Cliente por DNI
1. Ve a la sección "👤 Buscar Cliente"
2. Ingresa un DNI de 8 dígitos
3. Haz clic en "Buscar"
4. El sistema consultará la API de RENIEC y mostrará los datos

### 2. Crear una Factura
1. Ve a "➕ Nueva Factura"
2. Busca la empresa por RUC (11 dígitos)
3. Busca el cliente por DNI (8 dígitos)
4. Ingresa la descripción de productos/servicios
5. Ingresa el monto
6. Selecciona la moneda (Soles o Dólares)
7. Si eliges dólares, el sistema convertirá automáticamente a soles
8. Selecciona el método de pago
9. Haz clic en "✅ Generar Factura"

### 3. Ver y Gestionar Facturas
1. Ve a "📋 Ver Facturas"
2. Usa el buscador para filtrar por empresa, cliente, RUC o DNI
3. Ordena por fecha o monto
4. Acciones disponibles:
   - ✏️ **Editar**: Modificar una factura existente
   - 🗑️ **Eliminar**: Borrar una factura
   - 🖨️ **Imprimir**: Imprimir la factura

### 4. Conversión de Divisas
- El tipo de cambio se actualiza automáticamente cada 30 minutos
- Al ingresar un monto en dólares, verás la conversión en tiempo real
- La factura guardará tanto el monto original como el convertido

## 🎣 Hooks Personalizados

### `useFacturas()`
Gestiona el estado global de las facturas usando Context API.

```jsx
const { state, agregarFactura, actualizarFactura, eliminarFactura } = useFacturas();
```

### `useClientes()`
Maneja las consultas a APIs de RENIEC y SUNAT.

```jsx
const { buscarClientePorDNI, buscarEmpresaPorRUC, loading, error } = useClientes();
```

### `useTipoCambio()`
Obtiene y gestiona el tipo de cambio USD/PEN.

```jsx
const { tipoCambio, convertirUSDtoSoles, obtenerTipoCambio } = useTipoCambio();
```

## 🔧 Configuración

### Variables de Entorno (Opcional)
Puedes crear un archivo `.env` para personalizar:

```env
REACT_APP_API_TOKEN=tu_token_perudevs
REACT_APP_EXCHANGE_API=https://api.exchangerate-api.com/v4/latest/USD
```

## 🐳 Docker

### Build
```bash
docker build -t sistema-facturacion:latest .
```

### Run
```bash
docker run -d -p 3000:80 --name facturacion sistema-facturacion:latest
```

### Logs
```bash
docker logs facturacion
```

### Stop
```bash
docker stop facturacion
docker rm facturacion
```

## 📊 Características Técnicas

### Hooks de React Utilizados
- ✅ `useState` - Manejo de estado local
- ✅ `useEffect` - Efectos secundarios y ciclo de vida
- ✅ `useReducer` - Estado complejo en Context
- ✅ `useContext` - Consumo del contexto global
- ✅ Custom Hooks - `useFacturas`, `useClientes`, `useTipoCambio`

### Patrón de Diseño
- **Context API + Reducer Pattern** para estado global
- **Custom Hooks** para lógica reutilizable
- **Component Composition** para mejor mantenibilidad

### Optimizaciones
- Multi-stage Docker build para imágenes ligeras
- Nginx con compresión gzip
- Cache de assets estáticos
- LocalStorage para persistencia

## 🔒 Seguridad

- Headers de seguridad en Nginx
- Validación de entrada en el frontend
- Sanitización de datos
- HTTPS recomendado en producción

## 🌐 Deploy en la Nube

### Opción 1: AWS EC2
```bash
# Conectarse a la instancia
ssh -i tu-key.pem ubuntu@<IP_PUBLICA>

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Clonar y ejecutar
git clone <tu-repo>
cd sistema-facturacion
docker-compose up -d

# Acceder: http://<IP_PUBLICA>:3000
```

### Opción 2: Azure VM
Similar a AWS, usando una VM con Ubuntu

### Opción 3: Google Cloud VM
Similar a AWS, usando Compute Engine

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Con coverage
npm test -- --coverage
```

## 📝 API Tokens

Para usar las APIs de RENIEC y SUNAT, necesitas un token de PeruDevs:
- Visita: https://www.perudevs.com/
- Regístrate y obtén tu API key
- Reemplaza el token en los archivos de hooks

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es para fines educativos - Práctica 3 de JavaScript

## 👨‍💻 Autor

Desarrollado para la Práctica 3 del curso de JavaScript

## 📞 Soporte

Si tienes problemas o preguntas:
- Abre un issue en GitHub
- Contacta al profesor del curso

---

⭐ Si te gustó este proyecto, dale una estrella en GitHub!

