# Rolling Village web port

Port gry planszowej typu print&play na przeglądarkę. Stanowi on projekt zaliczeniowy na moduł PSAM.

## Todo:
- [ ] obsługa rundy 0, dowolne ale różne budynki w wylosowanych kolumnach
- [ ] poprawa wyświetlania stanu kostki i implikując - pozostałych budynków
- [ ] dodatek (fabryki)
- [ ] końcowe podliczanie punktów (place i fabryki)
- [ ] serwer, dodanie multiplayer (przy okazji implementacja zatwierdzania ruchów)
- [ ] stylowanie

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
