#!/bin/sh
if [ -n "$VITE_APP_API_URL" ]; then
  sed -i "s|VITE_APP_API_URL: \".*\"|VITE_APP_API_URL: \"$VITE_APP_API_URL\"|" /usr/share/nginx/html/config.js
fi
exec "$@"