# 🚀 Despliegue en Google Cloud Platform (Compute Engine VM)

## 📋 Requisitos previos

1. ✅ Cuenta de Google Cloud (300 USD gratis por 90 días)
2. ✅ Proyecto creado en Google Cloud Console
3. ✅ Archivos del proyecto listos

---

## 🔧 Paso 1: Crear VM en Google Cloud

### 1.1 Ir a Google Cloud Console
- Ve a: https://console.cloud.google.com
- Selecciona tu proyecto o crea uno nuevo

### 1.2 Crear Compute Engine VM
1. En el menú lateral: **Compute Engine** → **VM instances**
2. Click en **CREATE INSTANCE**
3. Configurar:
   - **Nombre**: `facturacion-vm`
   - **Región**: `us-central1` (o la más cercana)
   - **Zona**: `us-central1-a`
   - **Tipo de máquina**: 
     - Serie: **E2**
     - Tipo: **e2-medium** (2 vCPU, 4 GB RAM)
   - **Sistema operativo**: 
     - Imagen: **Debian GNU/Linux 12 (bookworm)**
   - **Firewall**:
     - ✅ Permitir tráfico HTTP
     - ✅ Permitir tráfico HTTPS
   - **Disco de arranque**: 20 GB SSD

4. Click en **CREATE**

### 1.3 Configurar reglas de firewall
1. En el menú: **VPC Network** → **Firewall**
2. Click **CREATE FIREWALL RULE**
3. Configurar:
   - **Nombre**: `allow-http-80`
   - **Dirección del tráfico**: Ingress
   - **Destinos**: All instances in the network
   - **Rangos de IP de origen**: `0.0.0.0/0`
   - **Protocolos y puertos**: `tcp:80`
4. Click **CREATE**

---

## 💻 Paso 2: Conectarse a la VM

### Opción A: SSH desde Google Cloud Console
1. Ve a **Compute Engine** → **VM instances**
2. Click en **SSH** junto a tu VM

### Opción B: SSH desde terminal local
```bash
gcloud compute ssh facturacion-vm --zone=us-central1-a
```

---

## 📦 Paso 3: Instalar Docker en la VM

Ejecuta el script de instalación:

```bash
# Descargar el script
curl -o setup.sh https://raw.githubusercontent.com/tu-usuario/tu-repo/main/setup-gcp-vm.sh

# O copiar manualmente el contenido de setup-gcp-vm.sh y ejecutar:
chmod +x setup.sh
./setup.sh
```

**O ejecutar comandos manualmente:**

```bash
# Actualizar sistema
sudo apt-get update && sudo apt-get upgrade -y

# Instalar Docker
sudo apt-get install -y ca-certificates curl gnupg
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Agregar usuario a grupo docker
sudo usermod -aG docker $USER
newgrp docker
```

---

## 📤 Paso 4: Subir archivos a la VM

### Opción A: Usar gcloud scp (desde tu PC local)

```powershell
# Navegar a tu proyecto
cd C:\Users\user\Desktop\PROYECTO-DE-JS-PARCTICA-3

# Subir carpeta del frontend
gcloud compute scp --recurse sistema-facturacion facturacion-vm:~/ --zone=us-central1-a

# Subir carpeta del backend
gcloud compute scp --recurse demo facturacion-vm:~/ --zone=us-central1-a
```

### Opción B: Usar Git (recomendado)

En tu PC local:
```bash
# Crear repositorio (si no existe)
cd C:\Users\user\Desktop\PROYECTO-DE-JS-PARCTICA-3
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/tu-usuario/sistema-facturacion.git
git push -u origin main
```

En la VM:
```bash
cd ~
git clone https://github.com/tu-usuario/sistema-facturacion.git
cd sistema-facturacion
```

### Opción C: Copiar manualmente con el editor de GCP
1. En Cloud Console, abre **Cloud Shell** (icono >_ arriba a la derecha)
2. Click en **Upload file** y sube los archivos
3. Muévelos a la VM

---

## 🚀 Paso 5: Desplegar la aplicación

Una vez que los archivos estén en la VM:

```bash
# Navegar al directorio del proyecto
cd ~/sistema-facturacion

# Construir e iniciar contenedores
docker-compose up -d --build

# Verificar que todo esté corriendo
docker-compose ps

# Ver logs (opcional)
docker-compose logs -f
```

---

## 🌐 Paso 6: Acceder a la aplicación

1. Obtén la IP externa de tu VM:
   - Ve a **Compute Engine** → **VM instances**
   - Copia la **External IP** (ejemplo: `34.123.45.67`)

2. Abre en el navegador:
   ```
   http://34.123.45.67
   ```

---

## 🔍 Verificación

### Ver estado de contenedores:
```bash
docker-compose ps
```

### Ver logs:
```bash
# Todos los logs
docker-compose logs -f

# Solo backend
docker logs facturacion-backend -f

# Solo frontend
docker logs facturacion-frontend -f

# Solo base de datos
docker logs facturacion-db -f
```

### Probar backend directamente:
```bash
curl http://localhost:8080/api/clientes
```

---

## 🛠️ Comandos útiles

```bash
# Detener todo
docker-compose down

# Reiniciar todo
docker-compose restart

# Reconstruir y reiniciar
docker-compose up -d --build

# Ver uso de recursos
docker stats

# Limpiar contenedores viejos
docker system prune -a
```

---

## 🔐 Migrar datos desde PostgreSQL local

Si quieres migrar tus datos existentes:

### En tu PC local (Windows):
```powershell
# Exportar base de datos
pg_dump -U postgres -h localhost API_REST > backup.sql
```

### Subir backup a VM:
```powershell
gcloud compute scp backup.sql facturacion-vm:~/ --zone=us-central1-a
```

### En la VM, importar datos:
```bash
# Copiar backup al contenedor
docker cp ~/backup.sql facturacion-db:/backup.sql

# Importar en PostgreSQL
docker exec -it facturacion-db psql -U postgres -d API_REST -f /backup.sql
```

---

## ⚠️ Troubleshooting

### Puerto 80 no accesible
```bash
# Verificar firewall de GCP
gcloud compute firewall-rules list

# Verificar nginx está corriendo
docker logs facturacion-frontend
```

### Backend no se conecta a la base de datos
```bash
# Ver logs del backend
docker logs facturacion-backend

# Verificar que la DB esté corriendo
docker exec -it facturacion-db psql -U postgres -c "\l"
```

### Errores de permisos
```bash
# Asegurar que el usuario está en el grupo docker
sudo usermod -aG docker $USER
newgrp docker
```

---

## 💰 Costos estimados

**VM e2-medium (2 vCPU, 4 GB RAM):**
- ~$25-30 USD/mes si está corriendo 24/7
- Puedes usar los $300 USD gratis por 3 meses
- Opción: Apagar la VM cuando no la uses para ahorrar

**Detener VM cuando no la uses:**
```bash
# Desde tu PC local
gcloud compute instances stop facturacion-vm --zone=us-central1-a

# Iniciar de nuevo
gcloud compute instances start facturacion-vm --zone=us-central1-a
```

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs: `docker-compose logs -f`
2. Verifica el firewall de GCP
3. Asegúrate que todos los contenedores estén corriendo: `docker-compose ps`

---

## ✅ Checklist final

- [ ] VM creada en GCP
- [ ] Regla de firewall para puerto 80 configurada
- [ ] Docker y Docker Compose instalados
- [ ] Archivos del proyecto subidos
- [ ] `docker-compose up -d` ejecutado exitosamente
- [ ] Contenedores corriendo (`docker-compose ps`)
- [ ] Aplicación accesible desde IP externa
- [ ] Datos migrados (opcional)

---

¡Listo! Tu sistema de facturación debería estar corriendo en Google Cloud. 🎉
