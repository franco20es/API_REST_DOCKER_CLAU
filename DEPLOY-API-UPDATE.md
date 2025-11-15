# 🔄 Actualización de API - De PeruDevs a api.apis.net.pe

## ✅ Cambios Realizados

### 1. API de DNI/RENIEC
**Antes (PeruDevs):**
```javascript
const url = `https://api.perudevs.com/api/v1/dni/simple?document=${dni}&key=${token}`;
```

**Ahora (api.apis.net.pe - GRATIS):**
```javascript
const url = `https://api.apis.net.pe/v2/reniec/dni?numero=${dni}`;
```

### 2. API de RUC/SUNAT
**Antes (PeruDevs):**
```javascript
const url = `https://api.perudevs.com/api/v1/ruc/simple?document=${ruc}&key=${token}`;
```

**Ahora (api.apis.net.pe - GRATIS):**
```javascript
const url = `https://api.apis.net.pe/v2/sunat/ruc?numero=${ruc}`;
```

## 🚀 Pasos para Desplegar en GCP

### Paso 1: Subir cambios a GitHub
```bash
# En tu máquina local (Windows PowerShell)
cd C:\Users\user\Desktop\PROYECTO-DE-JS-PARCTICA-3\sistema-facturacion
git add src/hooks/useClientes.js
git commit -m "Migrar de PeruDevs a api.apis.net.pe (API gratuita)"
git push origin main
```

### Paso 2: Actualizar código en el servidor GCP
```bash
# SSH a tu VM
# Luego ejecutar:

cd ~/API_REST_DOCKER_CLAU
git pull origin main
```

### Paso 3: Reconstruir y redesplegar el frontend
```bash
# Detener el contenedor del frontend
docker-compose stop frontend

# Eliminar el contenedor antiguo
docker-compose rm -f frontend

# Eliminar la imagen antigua para forzar rebuild
docker rmi facturacion-frontend

# Reconstruir y levantar el frontend
docker-compose up -d --build frontend
```

### Paso 4: Verificar que todo funcione
```bash
# Ver logs del frontend
docker-compose logs -f frontend

# Verificar que el contenedor esté corriendo
docker ps | grep frontend
```

## 🧪 Pruebas

### Probar API de DNI (desde el navegador o curl)
```bash
# Probar la nueva API directamente
curl -X GET "https://api.apis.net.pe/v2/reniec/dni?numero=61556046"
```

**Respuesta esperada:**
```json
{
  "nombres": "LUIS ABEL",
  "apellidoPaterno": "PUMAYAURI",
  "apellidoMaterno": "ROCA",
  "tipoDocumento": "1",
  "numeroDocumento": "61556046"
}
```

### Probar en la aplicación web
1. Ir a: http://34.28.54.252
2. Navegar a sección **Clientes**
3. Buscar DNI: `61556046`
4. Debería mostrar: **LUIS ABEL PUMAYAURI ROCA**
5. Hacer clic en "✓ Registrar en BD"

### Probar API de RUC
```bash
# Probar la nueva API de RUC
curl -X GET "https://api.apis.net.pe/v2/sunat/ruc?numero=20123456789"
```

## 📊 Ventajas de api.apis.net.pe

✅ **100% Gratuito** - No requiere tokens ni créditos
✅ **Sin límites de uso** - No hay cuotas diarias
✅ **Formato simple** - Respuesta JSON directa
✅ **Soporte DNI y RUC** - Ambas APIs disponibles
✅ **Sin autenticación** - No necesita API keys

## ⚠️ Notas Importantes

- La API gratuita puede tener **latencia más alta** que las APIs de pago
- No hay garantía de **disponibilidad 24/7** (es un servicio gratuito)
- Si falla, considera alternativas como:
  - https://dniruc.apisperu.com/
  - https://api.peruapis.com/

## 🔍 Troubleshooting

### Error: "Cannot GET /api/clientes"
- Verificar que el backend esté corriendo: `docker ps`
- Ver logs: `docker-compose logs backend`

### Error: CORS en el navegador
- Ya está configurado en `CorsConfig.java` con la IP `34.28.54.252`

### Frontend no actualiza
- Limpiar caché del navegador: `Ctrl + Shift + R`
- Verificar que la imagen se reconstruyó: `docker images | grep facturacion-frontend`

---
**Autor:** GitHub Copilot  
**Fecha:** 15 de noviembre de 2025  
**VM:** instance-20251114-212454 (GCP)
