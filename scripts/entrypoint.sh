#!/bin/sh

cat <<EOF > /usr/share/nginx/html/env.js
window.ENV = {
  VITE_ENV: "${VITE_ENV}",
  VITE_API_URL: "${VITE_API_URL}",
  VITE_API_KEY: "${VITE_API_KEY}",
  VITE_AUTH_DOMAIN: "${VITE_AUTH_DOMAIN}",
  VITE_PROJECT_ID: "${VITE_PROJECT_ID}",
  VITE_STORAGE_BUCKET: "${VITE_STORAGE_BUCKET}",
  VITE_MESSAGING_SENDER_ID: "${VITE_MESSAGING_SENDER_ID}",
  VITE_APP_ID: "${VITE_APP_ID}",
  VITE_MEASUREMENT_ID: "${VITE_MEASUREMENT_ID}",
};
EOF

cat /usr/share/nginx/html/env.js  # Log result


exec "$@"
