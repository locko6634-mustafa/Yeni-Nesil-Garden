#!/usr/bin/env bash

# Bagimsiz statik frontend sunucusu baslaticisi (Linux)
PORT=8000
WAIT_MODE=false
OPEN_BROWSER=true

# Parametre ayrıştırma
while [[ $# -gt 0 ]]; do
  case "$1" in
    -p|--port)
      PORT="$2"
      shift 2
      ;;
    -w|--wait)
      WAIT_MODE=true
      shift
      ;;
    --no-browser)
      OPEN_BROWSER=false
      shift
      ;;
    *)
      if [[ "$1" =~ ^[0-9]+$ ]]; then
        PORT="$1"
      elif [[ "$1" == "--wait" || "$1" == "-w" ]]; then
        WAIT_MODE=true
      fi
      shift
      ;;
  esac
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Node.js kontrolü
if ! command -v node &> /dev/null; then
    echo -e "\033[0;31mHata: Statik sunucu icin Node.js gereklidir.\033[0m"
    exit 1
fi

# Port dinleme kontrolü
is_port_in_use() {
    local port="$1"
    if command -v ss &> /dev/null; then
        ss -tuln | grep -q ":${port} "
    elif command -v lsof &> /dev/null; then
        lsof -i ":${port}" &> /dev/null
    elif command -v netstat &> /dev/null; then
        netstat -tuln | grep -q ":${port} "
    else
        (echo > /dev/tcp/127.0.0.1/"$port") &>/dev/null
    fi
}

open_in_browser() {
    local url="$1"
    if command -v xdg-open &> /dev/null; then
        xdg-open "$url" &> /dev/null &
    elif command -v gio &> /dev/null; then
        gio open "$url" &> /dev/null &
    fi
}

if is_port_in_use "$PORT"; then
    echo -e "\033[0;33mSunucu zaten calisiyor: http://localhost:$PORT\033[0m"
    if [ "$OPEN_BROWSER" = true ]; then
        echo -e "\033[0;36m-> Tarayici aciliyor: http://localhost:$PORT\033[0m"
        open_in_browser "http://localhost:$PORT"
    fi
    exit 0
fi

SERVER_SCRIPT="$SCRIPT_DIR/tools/serve.mjs"

if [[ ! -f "$SERVER_SCRIPT" ]]; then
    echo -e "\033[0;31mHata: Sunucu dosyasi bulunamadi: $SERVER_SCRIPT\033[0m"
    exit 1
fi

echo -e "\033[0;36mStatik frontend sunucusu (Port $PORT) bagimsiz olarak baslatiliyor...\033[0m"

LOG_FILE="$SCRIPT_DIR/.server.log"

# Linux'ta terminal kapanmasından etkilenmeyen bağımsız arka plan süreci
if command -v setsid &> /dev/null; then
    setsid node "$SERVER_SCRIPT" "$PORT" 127.0.0.1 > "$LOG_FILE" 2>&1 &
    SERVER_PID=$!
else
    nohup node "$SERVER_SCRIPT" "$PORT" 127.0.0.1 </dev/null > "$LOG_FILE" 2>&1 &
    SERVER_PID=$!
    disown "$SERVER_PID" 2>/dev/null || true
fi

# Sunucunun dinlemeye başladığını doğrula (maksimum 3 saniye bekle)
for i in {1..30}; do
    if is_port_in_use "$PORT"; then
        break
    fi
    sleep 0.1
done

if ! is_port_in_use "$PORT"; then
    echo -e "\033[0;31mHata: Sunucu baslatilamadi veya port dinlenemedi. Log: $LOG_FILE\033[0m"
    if [[ -f "$LOG_FILE" ]]; then
        cat "$LOG_FILE"
    fi
    exit 1
fi

echo -e "\033[0;32m-> Sunucu basariyla baslatildi! (Port $PORT)\033[0m"
echo -e "\033[0;32m   URL: http://localhost:$PORT\033[0m"
echo -e "\033[0;90m   Log: $LOG_FILE\033[0m"

if [ "$OPEN_BROWSER" = true ]; then
    echo -e "\033[0;36m-> Tarayici aciliyor: http://localhost:$PORT\033[0m"
    open_in_browser "http://localhost:$PORT"
fi

if [ "$WAIT_MODE" = true ]; then
    wait "$SERVER_PID" 2>/dev/null
fi
