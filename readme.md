# Beléptető rendszer tesztfeladat
docker compose up --build behúzza az init.sql-t a postgres db-konténerbe (remélem)
## login ('tran.lam.ph@budapest.hu', '1234')

## Frontend (Next.js 14)

- Figma alapján készült login UI:
    - Modal ablak, logó, háttér, árnyék
    - E-mail és jelszó mező
    - „Emlékezzen rám” checkbox
    - Bejelentkezés gomb
- `useState` + `useEffect` alapú állapotkezelés
- Valós POST kérés a backendhez
- Válaszüzenet (`sikeres` / `sikertelen`) megjelenítése Tailwind alert sávban
- Checkbox alapján menti/törli az adatokat `localStorage`-ben
- Frissítéssel visszatölti az adatokat, ha a checkbox be van jelölve
- Legfrissebb technológiák:
    - **Next.js 14**
    - **Node.js 22**

## Backend (NestJS 11)

- `POST /auth/login` végpont
- Valós felhasználóellenőrzés:
    - E-mail és jelszó alapján PostgreSQL adatbázisból
- Kísérletek naplózása (`Logger`) (docker logs nest-backend)
- CORS (`localhost:3000` → `localhost:3001`)
- `Prisma 6.6.0` ORM

## Adatbázis

- **PostgreSQL** – legfrissebb stable image
- Prisma migrációk és seed használata
- `User` tábla létezik, benne valós tesztadatok

## Docker / Setup

- Teljesen konténerizált rendszer:
    - `bp_teszt-frontend`
    - `bp_teszt-backend`
    - `postgres`
- `docker-compose.yml` a szolgáltatások indítására
- Konténerek külön `Dockerfile` alapján, non-root userrel (akali)
- `.env` fájlokkal paraméterezhető
- `setup.sh` létrehozza a teljes ALAP projektstruktúra klónját
- Fejlesztői és production környezet elkülönítve (csak a devet alkalmaztam)

## Tesztelés

- Backend tesztelés `Jest` segítségével (docker exec -it nest-backend npm run test)
- auth.http post

## Amit nem tettem meg (mert nem tudom milyen struktúrákat preferáltok)
- feature brencs szerinti kommitok
- DDD backend
- rétegelt, mikorszervíz design frontend