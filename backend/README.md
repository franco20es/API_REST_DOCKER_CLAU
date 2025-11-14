# Sistema de Facturación - Backend Spring Boot

Sistema de facturación con Spring Boot, PostgreSQL y Docker.

## 🚀 Características

- ✅ API REST con Spring Boot 3.5.7
- ✅ Base de datos PostgreSQL 17
- ✅ JPA/Hibernate para persistencia
- ✅ CORS configurado para frontend React
- ✅ Integración con RENIEC/SUNAT
- ✅ Dockerizado y listo para producción

## 📋 Requisitos

- Docker Desktop instalado
- Docker Compose instalado
- Puerto 8080 y 5432 disponibles

## 🔧 Instalación y Ejecución

### Opción 1: Docker Compose (Recomendado)

```bash
# Construir y levantar todos los servicios
docker-compose up -d --build

# Ver logs
docker-compose logs -f backend

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v
```

### Opción 2: Solo Backend (con PostgreSQL local)

```bash
# Construir imagen
docker build -t facturacion-backend .

# Ejecutar contenedor
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/API_REST \
  -e SPRING_DATASOURCE_USERNAME=postgres \
  -e SPRING_DATASOURCE_PASSWORD=Jfrc11$$ \
  facturacion-backend
```

## 🌐 Endpoints Disponibles

### Clientes
- `GET /api/clientes` - Listar todos
- `POST /api/clientes` - Crear cliente
- `GET /api/clientes/{id}` - Obtener por ID
- `GET /api/clientes/buscar/dni/{dni}` - Buscar por DNI

### Productos
- `GET /api/productos` - Listar todos
- `POST /api/productos` - Crear producto
- `GET /api/productos/{id}` - Obtener por ID
- `GET /api/productos/buscar/nombre/{nombre}` - Buscar por nombre

### Empresas
- `GET /api/empresas` - Listar todas
- `POST /api/empresas` - Crear empresa
- `GET /api/empresas/buscar/ruc/{ruc}` - Buscar por RUC

### Facturas
- `GET /api/facturas` - Listar todas
- `POST /api/facturas` - Crear factura/boleta
- `GET /api/facturas/{id}` - Obtener por ID
- `GET /api/facturas/cliente/{idCliente}` - Por cliente

### Usuarios
- `GET /api/usuarios` - Listar todos
- `POST /api/usuarios` - Crear usuario
- `POST /api/usuarios/login` - Login
- `GET /api/usuarios/buscar/dni/{dni}` - Buscar por DNI

## 📊 Base de Datos

La base de datos se crea automáticamente con las siguientes tablas:

- `usuarios`
- `clientes`
- `empresas`
- `productos`
- `facturas`
- `detalle_factura`

## 🔒 Variables de Entorno

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/facturacion_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
SPRING_JPA_HIBERNATE_DDL_AUTO=update
```

## 📝 Notas

- El backend se ejecuta en el puerto **8080**
- PostgreSQL se ejecuta en el puerto **5432**
- Los datos persisten en un volumen Docker

## 🐳 Comandos Docker Útiles

```bash
# Ver contenedores corriendo
docker ps

# Ver logs del backend
docker logs facturacion-backend

# Ver logs de PostgreSQL
docker logs facturacion-postgres

# Reiniciar solo el backend
docker-compose restart backend

# Ejecutar bash en el contenedor
docker exec -it facturacion-backend sh

# Conectar a PostgreSQL
docker exec -it facturacion-postgres psql -U postgres -d facturacion_db
```

## 🚀 Deploy a Producción

1. Cambiar credenciales de PostgreSQL
2. Configurar CORS con tu dominio
3. Usar variables de entorno seguras
4. Configurar reverse proxy (Nginx)

## 📄 Licencia

Proyecto educativo - 2025
