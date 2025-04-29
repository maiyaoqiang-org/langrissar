#!/bin/sh
if [ -n "$VITE_APP_API_URL" ]; then
  sed -i '/^VITE_APP_API_URL=/d' .env.production
  echo "VITE_APP_API_URL=$VITE_APP_API_URL" >> .env.production
fi
exec "$@"