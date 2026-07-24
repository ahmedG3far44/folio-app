#!/usr/bin/env bash

set -euo pipefail

############################################################
# Load Node (NVM)
############################################################

export NVM_DIR="$HOME/.nvm"

if [ -s "$NVM_DIR/nvm.sh" ]; then
    . "$NVM_DIR/nvm.sh"
fi

############################################################
# Defaults
############################################################

MAIN_DIR="."
DEPLOY_ROOT="$HOME/apps"
BRANCH="main"

############################################################
# Parse Arguments
############################################################

while [[ $# -gt 0 ]]; do
    case "$1" in
        --port)
            PORT="$2"
            shift 2
            ;;
        --dir)
            MAIN_DIR="$2"
            shift 2
            ;;
        --subdomain)
            SUBDOMAIN="$2"
            shift 2
            ;;
        --domain)
            DOMAIN="$2"
            shift 2
            ;;
        --git)
            GIT_URL="$2"
            shift 2
            ;;
        --env)
            ENV_CONTENT="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

############################################################
# Validate
############################################################

if [[ -z "${PORT:-}" || \
      -z "${SUBDOMAIN:-}" || \
      -z "${DOMAIN:-}" || \
      -z "${GIT_URL:-}" || \
      -z "${ENV_CONTENT:-}" ]]; then
    echo "Missing required arguments."
    exit 1
fi

############################################################
# Check Dependencies
############################################################

for cmd in git node npm pm2 nginx certbot; do
    if ! command -v "$cmd" >/dev/null 2>&1; then
        echo "Missing dependency: $cmd"
        if [[ "$cmd" == "certbot" ]]; then
            echo "Tip: Install certbot via 'sudo apt install certbot python3-certbot-nginx'"
        fi
        exit 1
    fi
done

############################################################
# Variables
############################################################

SERVER_NAME="${SUBDOMAIN}.${DOMAIN}"
APP_NAME="${SUBDOMAIN}-${DOMAIN}"

REPO_NAME=$(basename "$GIT_URL" .git)

REPO_DIR="${DEPLOY_ROOT}/${REPO_NAME}"

mkdir -p "$DEPLOY_ROOT"

############################################################
# Clone Repository
############################################################

if [[ ! -d "$REPO_DIR/.git" ]]; then
    echo "Cloning repository..."

    git clone \
        --branch "$BRANCH" \
        "$GIT_URL" \
        "$REPO_DIR"
fi

############################################################
# Update Repository
############################################################

cd "$REPO_DIR"

echo "Fetching latest changes..."

git fetch origin "$BRANCH"

git checkout "$BRANCH"

git reset --hard "origin/$BRANCH"

git clean -fd

echo ""
echo "Current Commit:"
git rev-parse HEAD
git log --oneline -1
echo ""

############################################################
# Go To App Directory
############################################################

cd "$MAIN_DIR"

############################################################
# Write .env
############################################################

printf "%b\n" "$ENV_CONTENT" > .env

############################################################
# Install Dependencies
############################################################

echo "Installing dependencies..."

if [[ -f package-lock.json ]]; then
    npm ci
else
    npm install
fi

############################################################
# Build
############################################################

if npm pkg get scripts.build 2>/dev/null | grep -vq "null"; then
    echo "Building..."
    npm run build
fi

############################################################
# Detect Start File
############################################################

START_FILE=""

for file in \
dist/index.js \
dist/server.js \
build/index.js \
build/server.js \
index.js \
server.js \
app.js
do
    if [[ -f "$file" ]]; then
        START_FILE="$file"
        break
    fi
done

if [[ -z "$START_FILE" ]]; then
    echo "Unable to detect application entry file."
    exit 1
fi

############################################################
# PM2
############################################################

echo "Configuring PM2..."

if pm2 describe "$APP_NAME" >/dev/null 2>&1; then

    pm2 restart "$APP_NAME" --update-env

else

    pm2 start "$START_FILE" \
        --name "$APP_NAME"

fi

pm2 save

############################################################
# Nginx Configuration
############################################################

NGINX_FILE="/etc/nginx/sites-available/${SERVER_NAME}.conf"

if [[ ! -f "$NGINX_FILE" ]]; then

echo "Creating Nginx configuration for ${SERVER_NAME}..."

sudo tee "$NGINX_FILE" >/dev/null <<EOF
server {

    listen 80;

    server_name ${SERVER_NAME};

    location / {

        proxy_pass http://127.0.0.1:${PORT};

        proxy_http_version 1.1;

        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_set_header Host \$host;

        proxy_set_header X-Real-IP \$remote_addr;

        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;

        proxy_set_header X-Forwarded-Proto \$scheme;

    }

}
EOF

sudo ln -sf \
"$NGINX_FILE" \
"/etc/nginx/sites-enabled/${SERVER_NAME}.conf"

fi

############################################################
# Test & Reload Nginx
############################################################

echo "Testing nginx..."

sudo nginx -t

echo "Reloading nginx..."

sudo systemctl reload nginx

############################################################
# Certbot / SSL Configuration
############################################################

if sudo certbot certificates 2>/dev/null | grep -q "${SERVER_NAME}"; then
    echo "SSL Certificate for ${SERVER_NAME} already exists. Skipping issuance."
else
    echo "Provisioning SSL certificate for ${SERVER_NAME}..."
    sudo certbot --nginx \
        -d "${SERVER_NAME}" \
        --non-interactive \
        --agree-tos \
        --register-unsafely-without-email \
        --redirect
fi

############################################################
# Done
############################################################

echo ""
echo "==========================================="
echo "Deployment Completed Successfully"
echo "==========================================="
echo "Application : $APP_NAME"
echo "Repository  : $REPO_DIR"
echo "URL         : https://$SERVER_NAME"
echo "Port        : $PORT"
echo "Commit      : $(git rev-parse --short HEAD)"
echo "==========================================="