# Rolling Village web port

Port gry planszowej typu print&play na przeglądarkę. Stanowi on projekt zaliczeniowy na moduł PSAM.

## Todo:
- [ ] pasek postępu gry
- [ ] serwer, dodanie multiplayer (przy okazji implementacja zatwierdzania ruchów)

## Użyte technologie:
- React, Next.js (frontend i backend)
- Typescript
- Socket.io do komunikacji multiplayer w czasie rzeczywistym

## Uruchomienie projektu w trybie deweloperskim
- Wpisz `npm install` w katalogu projektu
- Wpisz `npm run dev`, aby uruchomić serwer deweloperski
- Aplikacja jest dostępna pod adresem `http://localhost:3000` z działającym hot reload

## Deployment projektu
- Wpisz `npm install` w katalogu projektu
- Wpisz `npm run build`, aby zbudować projekt
- Wpisz `npm run start`, aby uruchomić serwer produkcyjny

## Uruchomienie w Dockerze

### Tryb deweloperski
Aby uruchomić projekt w trybie deweloperskim przy użyciu Docker Compose:
```bash
docker-compose up
```
Aplikacja będzie dostępna pod adresem `http://localhost:3000`. Zmiany w kodzie będą automatycznie odświeżane (hot reload).

### Budowanie i uruchamianie wersji produkcyjnej
Aby zbudować i uruchomić obraz produkcyjny:

1. Zbuduj obraz:
```bash
docker build --target runner -t rolling-village-frontend .
```

2. Uruchom kontener:
```bash
docker run -p 3020:3020 rolling-village-frontend
```
Aplikacja będzie dostępna pod adresem `http://localhost:3020`.
