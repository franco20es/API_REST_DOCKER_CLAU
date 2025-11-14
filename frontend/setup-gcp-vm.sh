#!/bin/bash
# Script de instalación para Google Compute Engine VM
# Sistema de Facturación - Deploy automatizado

echo "================================================"
echo "  Instalando Sistema de Facturación en GCP VM"
echo "================================================"

# 1. Actualizar sistema
echo "[1/6] Actualizando sistema..."
sudo apt-get update
sudo apt-get upgrade -y

# 2. Instalar Docker
echo "[2/6] Instalando Docker..."
sudo apt-get install -y ca-certificates curl gnupg lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 3. Instalar Docker Compose standalone
echo "[3/6] Instalando Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 4. Configurar usuario para Docker (sin sudo)
echo "[4/6] Configurando permisos Docker..."
sudo usermod -aG docker $USER

# 5. Habilitar Docker al inicio
echo "[5/6] Habilitando Docker al inicio..."
sudo systemctl enable docker
sudo systemctl start docker

# 6. Crear directorio del proyecto
echo "[6/6] Creando directorio del proyecto..."
mkdir -p ~/sistema-facturacion
cd ~/sistema-facturacion

echo ""
echo " Instalación completada!"
echo ""
echo "Próximos pasos:"
echo "1. Sube los archivos del proyecto a ~/sistema-facturacion"
echo "2. Ejecuta: docker-compose up -d"
echo "3. Abre el puerto 80 en el firewall de GCP"
echo ""
echo "Comandos útiles:"
echo "  docker-compose ps          # Ver contenedores"
echo "  docker-compose logs -f     # Ver logs"
echo "  docker-compose down        # Detener todo"
echo "  docker-compose up -d       # Iniciar todo"
echo ""
