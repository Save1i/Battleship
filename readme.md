# [Battle ship Live](https://save1i.github.io/Battleship/)

# Документация

## Описание проекта

Это игра на основе классической морской битвы, где игрок сражается с ботом, размещая корабли на игровой доске и пытаясь поразить корабли противника.

## Классы

### 1. Ship Class

**Описание:** Представляет каждое судно.

- **Свойства:**

  - `length` - длина корабля.

- **Методы:**
  - Нет методов.

---

### 2. Gameboard Class

**Описание:** Представляет доски игрока и бота.

- **Состояния ячеек:**

  - `0` - пусто
  - `2` - промах
  - `1` - корабль
  - `7` - попадание

- **Свойства:**

  - `height` - высота доски.
  - `width` - ширина доски.
  - `startGame` - состояние начала игры.
  - `gameOver` - состояние окончания игры.
  - `active` - активный игрок.
  - `sound` - звук.
  - `mode` - уровень сложности.
  - `coordinatesShip` - координаты кораблей.
  - `coordinateShot` - координаты выстрела.

- **Методы:**
  - `createBoard()`: Создает доску, состоящую из объекта с ключами от 0 до 9 и значением каждого ключа — массив длиной 10.
  - `checkPlacement(key, startP, length)`: Проверяет, чтобы вокруг размещенного корабля в радиусе 1 клетки со всех сторон не было других кораблей.
  - `placeShip(key, startP, length)`: Размещает корабли на доске согласно заданным координатам и размеру корабля, с проверкой на правильность размещения.
  - `shot(y, x)`: Изменяет данные в объекте согласно координатам (если значение в объекте равно 0, заменяется на 2; если 1, заменяется на 7). Также есть проверка на правильность координат.
  - `endGame()`: Проверка на наличие значений "1" в объекте. Если "1" нет, игра окончена.

---

### 3. Player Class

**Описание:** Представляет способности игрока и бота.

- **Свойства:**
  - `isCpu` - является ли игрок ботом.
  - `name` - имя игрока.
  - `gameBoard` - вызывает класс `Gameboard()`.

---

## Процессы

1. Инициализация `p1` - игрок, `p2` - бот.
2. Получение элементов доски из HTML.
3. Игрок выбирает уровень сложности, изменяя свойство `mode` в `p2.Gameboard`.
4. Для бота функция `randomShip()` вызывается автоматически. Игроку нужно нажать на кнопку.
   - `randomShip(p1, randKey, startP)`: в этой функции в массиве `arrShip` прописаны все корабли (их длина). Методом перебираются все корабли из массива, с помощью рандома каждому кораблю задаются координаты, проверяется на размещение. Если количество ошибок при размещении кораблей превысило 100, функция вызывается заново.
5. Игрок выбирает уровень сложности, что меняет свойство `mode` в `p2.Gameboard`.
6. Запуска игры доступны функции `click(p1)`, в функции определяется `noactive = p2`, определяется, по какой доске происходит клик, запуская функции `gameOver(activePlayer, noActive)` и `shotOnBoard(activePlayer, value)`.
7. `shotOnBoard(p1)` -- async: в функции определяется `noactive = p2`, есть проверка на активного игрока и конец игры. В HTML происходит поиск элементов по значению от 1 до 100, нужен конвертер из значения в ключ. Запускается метод `shot` для `p2`. Если метод `shot()` вернет 2, происходит смена хода и запускается `botShot(p1)` через 1 секунду, `displayShot(p1)` отображает выстрел на доске, далее запускается звук.

## функции

1. `delayedShot` - выполнение выстрела с задержкой
2. `findShip` - поиск и передача координат корабля по которому попал bot в `delayedShot`.
3. `identifyShip` - закрашивает поля вокруг потопленного корабля, идентифицируя его по данным из объекта.
