#!/bin/bash
set -e
# Example deploy steps (run as root or sudo)
# 1) install node, nginx, certbot
# sudo apt update && sudo apt install -y nginx nodejs npm certbot

# 2) place project at /var/www/autoshiftpay
# rsync -av . /var/www/autoshiftpay

# 3) install server deps
cd /var/www/autoshiftpay/server
npm ci

# 4) build frontend
cd /var/www/autoshiftpay/frontend
npm ci
npm run build

# 5) configure nginx (copy nginx_autoshiftpay.conf to /etc/nginx/sites-available/)
# sudo cp ../deploy/nginx_autoshiftpay.conf /etc/nginx/sites-available/autoshiftpay
# sudo ln -s /etc/nginx/sites-available/autoshiftpay /etc/nginx/sites-enabled/

# 6) enable systemd service
# sudo cp ../deploy/shiftpay-server.service /etc/systemd/system/
# sudo systemctl daemon-reload
# sudo systemctl enable shiftpay-server
# sudo systemctl start shiftpay-server

# 7) obtain TLS cert (Let's Encrypt)
# sudo certbot --nginx -d autoshiftpay.coinsspor.com

echo "Deploy steps written. Edit /var/www/autoshiftpay/server/.env with SIDESHIFT_SECRET and AFFILIATE_ID then start services."
