class Ship {
  constructor(length = 0, hits = 0, rip = false) {
    if (length <= 0) {
      return new Error("Длинна корабля должна быть больше 0");
    }
    this.length = length;
    this.hits = hits;
    this.rip = rip;
  }

  hit() {
    if (!this.rip) {
      this.hits += 1;
    }
    if (this.isSunk()) {
      this.rip = true;
    }
  }

  isSunk() {
    return this.hits >= this.length;
  }
  //ДРБАВИТЬ ШАБЛОН КАРАБЛЕЙ ПО НАЗВАНИЯМ
}

class Gameboard {
  constructor(height = 10, width = 10, gameOver = false) {
    this.height = height;
    this.width = width;
    this.gameOver = gameOver;
  }
  // ДОБАВИТЬ ПРОВЕРКУ ЧТОБЫ ВСЕ КОРАБЛИ БЫЛИ ПОСТАВЛЕНЫ НА ПОЛЕ

  //ДОБАВТЬ ПРОВЕРКУ КОНЦА ИГРЫ

  createBoard() {
    const gameBoardObj = new Object();
    for (let i = 0; i < this.height; i++) {
      gameBoardObj[i] = Array(this.width).fill(0);
    }
    this.gameBoardObj = gameBoardObj;
  }

  createShip(length) {
    const newShip = new Ship(length);
    return newShip;
  }

  placeShip(key, startP, length) {
    if (this.width - (startP - 1) < length || startP < 0) {
      return new Error("часть карабля выходит за пределы поля");
    }
    if (!key || !startP || !length) {
      return new Error("введите данные для размещения корабля");
    }
    // проверка на расстояние от кораблей 1 клетка
    for (let i = startP; i < startP + length; i++) {
      this.gameBoardObj[key].splice(i, 1, 1);
    }
  }

  shot(y, x) {
    let miss;
    let get;
    if (x >= this.width || x < 0 || y >= this.height || y < 0) {
      return new Error("значения координат должны быть в пределах поля");
    }
    if (this.gameBoardObj[y][x] == 7 || this.gameBoardObj[y][x] == 2) {
      return new Error("это поле уже было атаковано");
    } else if (this.gameBoardObj[y][x] == 0) {
      this.gameBoardObj[y].splice(x, 1, 2);
      return (miss = [y, x]);
    } else if (this.gameBoardObj[y][x] == 1) {
      this.gameBoardObj[y].splice(x, 1, 7);
      return (get = [y, x]);
    }
  }
}

module.exports = { Ship, Gameboard };
