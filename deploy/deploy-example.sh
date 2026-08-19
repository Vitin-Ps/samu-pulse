#!/bin/bash

# --- CONFIGURAÇÕES ---
# IP da VPS de exemplo
SERVER_USER="admin"
SERVER_IP="192.168.1.100"
REMOTE_DIR="/var/www/meu-projeto"

# Caminhos locais na sua máquina (Exemplos genéricos)
LOCAL_API_JAR="/c/Users/Usuario/Projetos/meu-app/backend/target/app-0.0.1-SNAPSHOT.jar"
LOCAL_WEB_DIST="/c/Users/Usuario/Projetos/meu-app/frontend/dist"
LOCAL_DEPLOY_DIR="/c/Users/Usuario/Projetos/meu-app/deploy"

echo "🚀 Iniciando deploy automatizado..."

# 1. Build Local (Frontend)
echo "📦 Buildando Frontend (Vite/React)..."
cd "/c/Users/Usuario/Projetos/meu-app/frontend"
npm run build
cd "/c/Users/Usuario/Projetos/meu-app"

# 2. Build Local (Backend - Maven/Spring Boot)
echo "☕ Buildando Backend (Maven/Spring Boot)..."
cd "/c/Users/Usuario/Projetos/meu-app/backend"
mvn clean package -DskipTests
cd "/c/Users/Usuario/Projetos/meu-app"

# 3. Enviar arquivos diretamente
echo "📤 Enviando arquivos para a VPS..."

# Garante a estrutura na VPS
ssh "$SERVER_USER@$SERVER_IP" "mkdir -p $REMOTE_DIR/api $REMOTE_DIR/web"

# Envia API
scp "$LOCAL_API_JAR" "$SERVER_USER@$SERVER_IP:$REMOTE_DIR/api/app.jar"
scp "$LOCAL_DEPLOY_DIR/api/Dockerfile" "$SERVER_USER@$SERVER_IP:$REMOTE_DIR/api/Dockerfile"

# Envia WEB (incluindo o nginx.conf)
scp -r "$LOCAL_WEB_DIST/"* "$SERVER_USER@$SERVER_IP:$REMOTE_DIR/web/"
scp "$LOCAL_DEPLOY_DIR/web/Dockerfile" "$SERVER_USER@$SERVER_IP:$REMOTE_DIR/web/Dockerfile"
scp "$LOCAL_DEPLOY_DIR/web/nginx.conf" "$SERVER_USER@$SERVER_IP:$REMOTE_DIR/web/nginx.conf"

# Envia Configs
scp "$LOCAL_DEPLOY_DIR/docker-compose.yml" "$SERVER_USER@$SERVER_IP:$REMOTE_DIR/docker-compose.yml"
scp "$LOCAL_DEPLOY_DIR/Caddyfile" "$SERVER_USER@$SERVER_IP:$REMOTE_DIR/Caddyfile"

# 4. Reiniciar os containers Docker na VPS
echo "🐳 Atualizando e reiniciando containers na VPS..."
ssh "$SERVER_USER@$SERVER_IP" "cd $REMOTE_DIR && docker compose down && docker compose up -d --build"

echo "✅ Deploy finalizado com sucesso! Acesse https://meu-dominio-exemplo.com"