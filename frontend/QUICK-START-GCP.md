# 🚀 Quick Start - Despliegue en Google Cloud

## 📝 Resumen de pasos

### 1️⃣ Crear VM en Google Cloud Console
- Tipo: **e2-medium** (2 vCPU, 4 GB RAM)
- OS: **Debian 12**
- Firewall: ✅ HTTP, ✅ HTTPS
- Región: **us-central1**

### 2️⃣ Conectar por SSH
```bash
gcloud compute ssh facturacion-vm --zone=us-central1-a
```

### 3️⃣ Instalar Docker (en la VM)
```bash
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y docker.io docker-compose
sudo usermod -aG docker $USER
newgrp docker
```

### 4️⃣ Subir archivos (desde tu PC)
```bash
cd C:\Users\user\Desktop\PROYECTO-DE-JS-PARCTICA-3

# Subir frontend
gcloud compute scp --recurse sistema-facturacion facturacion-vm:~/ --zone=us-central1-a

# Subir backend  
gcloud compute scp --recurse demo facturacion-vm:~/ --zone=us-central1-a
```

### 5️⃣ Desplegar (en la VM)
```bash
cd ~/sistema-facturacion
docker-compose up -d --build
docker-compose ps
```

### 6️⃣ Abrir en navegador
```
http://TU_IP_EXTERNA
```

---

## 📋 Comandos útiles

```bash
# Ver logs
docker-compose logs -f

# Reiniciar
docker-compose restart

# Detener
docker-compose down

# Ver IP de la VM
gcloud compute instances list
```

---

## 🔥 Si algo falla

1. **Verificar contenedores**: `docker-compose ps`
2. **Ver logs**: `docker-compose logs backend` o `docker-compose logs frontend`
3. **Verificar firewall**: Asegúrate que el puerto 80 esté abierto en GCP
4. **Reiniciar todo**: `docker-compose down && docker-compose up -d --build`

---

Ver **DEPLOY-GCP.md** para instrucciones completas y detalladas.
