#!/bin/bash

set -e

cd "$(dirname "$0")/../backend" || exit 1

sed -i 's/await app\.listen(process\.env\.PORT ?? 3000);/await app.listen(process.env.PORT ?? 3001);/' src/main.ts

echo "Okés → 3001!"
