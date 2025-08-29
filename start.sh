#!/bin/bash

echo "🔄 Limpiando procesos conflictivos..."

# Matar procesos en puerto 5055
lsof -ti :5055 | xargs kill -9 2>/dev/null || true

# Matar procesos npm y node relacionados
pkill -f "npm.*dev" 2>/dev/null || true
pkill -f "nodemon" 2>/dev/null || true
pkill -f "concurrently" 2>/dev/null || true

echo "⏳ Esperando 3 segundos..."
sleep 3

echo "🚀 Iniciando aplicación..."
npm run dev:all
