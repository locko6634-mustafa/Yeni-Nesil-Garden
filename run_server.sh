#!/usr/bin/env bash

# Yesil Nesil Statik Sunucu Calistirici (Linux)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Bagimsiz statik frontend sunucusu baslatiliyor..."
bash "$SCRIPT_DIR/sunucu_baslat.sh" "$@"
