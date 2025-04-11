#!/bin/bash

set -e

cd "$(dirname "$0")/.." || exit 1

echo "Projektstruktúra lenyomata ..."

# ami nem kell
find . \
  -type d \( -name "node_modules" -o -name ".git" -o -name ".idea" -o -name "dist" -o -name "build" -o -name ".next" -o -name "coverage" -o -name "database" \) -prune -false -o -print \
  > project-structure.txt

echo "Okés project-structure.txt fájlban. Mehetnek a konténerek: docker-compose up --build"