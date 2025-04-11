#!/bin/bash

set -e

echo "Belépés a frontend konténerbe (next-frontend)..."

docker exec -it next-frontend sh -c "
  echo 'ode_modules, lockfile, .next törlése...';
  rm -rf node_modules package-lock.json .next;

  echo 'npm cache törlés...';
  npm cache clean --force;

  echo 'Függőségek újratelepítése (legacy-peer-deps)...';
  npm install --legacy-peer-deps;

  echo 'lightningcss újrafordítása...';
  npm rebuild lightningcss;

  echo 'Okés → 3000!'
"