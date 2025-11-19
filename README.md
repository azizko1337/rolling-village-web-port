# Rolling Village web port

Port gry planszowej typu print&play na przeglądarkę. Stanowi on projekt zaliczeniowy na moduł PSAM.

## Todo:
- [ ] po uruchomieniu pierwszego buildingu czyszczenie nie bierze pod uwagę dwóch kolumn na raz
- [ ] sytuacja placu i pełnej kolumny
- [ ] rząd do zliczenia gdy jest 1, 1 (wybiera się samemu)
- [ ] pasek postępu gry
- [ ] podświetlenie wiersza do liczenia punktów
- [ ] zrób pojawianie się budynku który się zbuduje pod hover
- [ ] zawijanie z 6 do 1 kiedy kolumna jest pełna
- [ ] poprawa wyświetlania stanu kostki i implikując - pozostałych budynków, fixy gdy jest mało miejsc w kolumnach
- [ ] restylowanie
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
