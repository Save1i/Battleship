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
}

class Gameboard {
  constructor(height = 10, width = 10, startGame = false, gameOver = false, active = false) {
    this.height = height;
    this.width = width;
    this.gameOver = gameOver;
    this.startGame = startGame;

    this.active = active;

    this.coordinatesShip = new Array();
    this.coordinateShot = new Array();

    this.createBoard();
  }

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

  checkPlacement(key, startP, length) {
    let error = false;

    for (let i = startP - 1; i <= startP + length; i++) {
      if (i >= 0 && i < this.width) {
        if (
          this.gameBoardObj[key][i] === 1 ||
          (key - 1 >= 0 && this.gameBoardObj[key - 1][i] === 1) ||
          (key + 1 < this.height && this.gameBoardObj[key + 1][i] === 1)
        ) {
          return (error = true);
        }
      }
    }

    return error;
  }

  placeShip(key, startP, length) {
    if (key < 0 || startP < 0 || !length) {
      return new Error("введите данные для размещения корабля");
    }
    if (this.checkPlacement(key, startP, length)) {
      // displayInfo("сюда нельзя поставить корабль");
      return new Error("сюда нельзя поставить корабль");
    }
    if (this.startGame == true) {
      return new Error("игра уже началась, нельзя переставлять корабли");
    }
    if (this.width - (startP - 1) <= length || startP < 0) {
      return new Error("часть карабля выходит за пределы поля");
    }

    this.coordinatesShip.push(key, startP, length);

    for (let i = startP; i < startP + length; i++) {
      this.gameBoardObj[key].splice(i, 1, 1); // исправь 1 !!!!!
    }
  }

  shot(y, x) {
    // Ensure x and y are valid numbers within the board's bounds
    if (isNaN(x) || isNaN(y)) {
      throw new Error("Координаты не введены");
    }

    if (x < 0 || y < 0) {
      throw new Error("x = -1 and y = -1 ");
    }
    if (x >= this.width || x < 0 || y >= this.height || y < 0) {
      throw new Error("Значения координат должны быть в пределах поля");
    }

    let numOnObj = this.gameBoardObj[y]?.[x]; // Safe access with optional chaining

    // Check if the coordinates are valid
    if (numOnObj === undefined) {
      throw new Error("Неправильные координаты");
    }

    if (this.gameOver) {
      throw new Error("Игра окончена! Все корабли уничтожены.");
    }
    if (numOnObj === 7 || numOnObj === 2) {
      return new Error("Это поле уже было атаковано");
    }
    if (numOnObj === 0) {
      this.gameBoardObj[y].splice(x, 1, 2);
      this.coordinateShot.push([y, x]);
      return [y, x, 2];
    } else if (numOnObj === 1) {
      this.gameBoardObj[y].splice(x, 1, 7);
      this.coordinateShot.push([y, x]);
      this.endGame();
      return [y, x, 7];
    }
  }

  endGame() {
    // Преобразуем gameBoardObj в одномерный массив и проверяем на наличие 1
    const isGameOver = !Object.values(this.gameBoardObj).some((row) => row.includes(1));

    if (isGameOver) {
      this.gameOver = true; // Устанавливаем окончание игры
    }
  }
}

class Player {
  constructor(isCpu) {
    this.isCpu = isCpu;
    this.name = this.isCpu ? "Computer" : "Player ";
    this.gameBoard = new Gameboard();
  }
}

const p1 = new Player(false); // player
const p2 = new Player(true); // computer

const prSections = document.querySelectorAll(".sect");
const rSections = document.querySelectorAll(".section");
// const rSections = document.querySelectorAll(".rSections");

function gameOver(player1, player2) {
  if (player1.gameBoard.gameOver || player2.gameBoard.gameOver) {
    throw new Error("Game Over");
  }
}

function click(activePlayer, value) {
  let noActive = activePlayer === p1 ? p2 : p1;
  rSections.forEach((section) => {
    section.addEventListener("click", (e) => {
      value = e.currentTarget.getAttribute("value");

      if (
        e.currentTarget.attributes.id.value === "r" &&
        activePlayer.gameBoard.active &&
        activePlayer.gameBoard.startGame &&
        noActive.gameBoard.startGame
      ) {
        gameOver(activePlayer, noActive);
        shotOnBoard(activePlayer, value);
      } else if (
        e.currentTarget.attributes.id.value === "p" &&
        !activePlayer.gameBoard.active &&
        activePlayer.gameBoard.startGame &&
        noActive.gameBoard.startGame
      ) {
        gameOver(activePlayer, noActive);
        shotOnBoard(activePlayer, value);
      }
    });
  });
}

function convertInXY(value) {
  let columns = 10;
  const index = value - 1; // Преобразуем value в индекс (начиная с 0)
  const y = Math.floor(index / columns); // Определяем строку (y)
  const x = index % columns; // Определяем столбец (x)
  return [y, x];
}

function convertInValue(y, x) {
  let columns = 10;
  const value = y * columns + (x + 1);
  return value;
}

async function shotOnBoard(activePlayer, value, y, x) {
  let noActive = activePlayer === p1 ? p2 : p1;

  try {
    if (activePlayer.gameBoard.active) {
      noActive.gameBoard.endGame();
      // Если value передан, преобразуем его в координаты, иначе используем переданные y и x
      if (value !== undefined) {
        const yx = convertInXY(value);
        y = yx[0];
        x = yx[1];
      }

      let coords = noActive.gameBoard.shot(y, x);
      console.log(
        "Shot Result: player",
        coords,
        activePlayer.gameBoard.active,
        noActive.gameBoard.active
      );
      identifyShip(activePlayer, y, x);

      const audio = document.querySelector(`audio[data-key="${coords[2]}"]`);
      console.log(audio);
      if (coords[2] == 2) {
        activePlayer.gameBoard.active = !activePlayer.gameBoard.active;
        setTimeout(() => {
          botShot(p1);
        }, 1000);
      }

      displayShot(activePlayer, coords, value);
      console.log(noActive.gameBoard.gameBoardObj);

      if (!audio) return;
      audio.currentTime = 0;
      audio.play();
    } else if (!noActive.gameBoard.active) {
      activePlayer.gameBoard.endGame();

      // Если value передан, преобразуем его в координаты, иначе используем переданные y и x
      if (value !== undefined) {
        const yx = convertInXY(value);
        y = yx[0];
        x = yx[1];
      }

      coords = activePlayer.gameBoard.shot(y, x); // если выдаст ошибку о том что это поле уже занято, нужно заново вызвать Botshot(p1)

      if (coords instanceof Error) {
        // Если coords это объект ошибки
        console.log(coords.message); // Вывод сообщения об ошибке
        botShot(p1); // Повторная попытка
        return;
      }
      console.log(activePlayer.gameBoard.gameBoardObj);
      console.log("Shot Result:", coords, activePlayer.gameBoard.active, noActive.gameBoard.active);
      identifyShip(noActive, y, x);

      const audio = document.querySelector(`audio[data-key="${coords[2]}"]`);

      displayShot(noActive, coords, value);

      if (!audio) return;
      audio.currentTime = 0;
      audio.play();

      if (coords[2] == 2) {
        console.log("СМЕНА ХОДА!!!!!!!");
        activePlayer.gameBoard.active = !activePlayer.gameBoard.active;
      }
      // if (coords[2] == 7) {
      //   console.log(coords[2] + " ddd");
      //   findShip(noActive, y, x);
      // }
    } else {
      console.log("hhhhh");
    }
    if (noActive.gameBoard.gameOver == true) {
      throw new Error("Ты победил ИИ!");
    } else if (activePlayer.gameBoard.gameOver == true) {
      throw new Error("Ты проиграл ИИ!");
    }
  } catch (error) {
    displayInfo(error.message);
    console.error(error);
  }
}

function displayShot(activePlayer, coords, value) {
  activePlayer == p1 ? (id = "r") : (id = "p");
  if (coords[2] == 2) {
    const targetSection = document.querySelector(`#${id}[value='${value}']`);
    const shipPart = document.querySelector(`#${id}[value='${value}'] .ship-part`);
    if (targetSection) {
      const targetSection = document.querySelector(`#${id}[value='${value}']`);
      shipPart !== null ? targetSection.removeChild(shipPart) : console.log("no");
      const boom = document.createElement("div");
      boom.classList.add("boom");
      targetSection.append(boom);
    }
  } else if (coords[2] == 7) {
    const targetSection = document.querySelector(`#${id}[value='${value}']`);
    const shipPart = document.querySelector(`#${id}[value='${value}'] .ship-part`);
    if (targetSection) {
      shipPart !== null ? targetSection.removeChild(shipPart) : console.log("no");
      const boom = document.createElement("div");
      boom.classList.add("destroy");
      targetSection.append(boom);
      console.log("destr");
    }
  } else {
    console.log("nothing");
  }
}

function drawShip(section) {
  const shipPart = document.createElement("div");
  shipPart.classList.add("ship-part");
  section.appendChild(shipPart);
}

function shipdisplay(activePlayer) {
  let arrShip = activePlayer.gameBoard.coordinatesShip;
  activePlayer == p1 ? (id = "p") : (id = "r");

  for (let i = 0; i < arrShip.length; i += 3) {
    const x = arrShip[i]; // Column position
    const y = arrShip[i + 1]; // Row position
    const length = arrShip[i + 2]; // Length of the ship

    switch (x) {
      case 0: // x from 0 to 9
        for (let i = 1; i < length + 1; i++) {
          const targetSection = document.querySelector(`#${id}[value='${y + i}']`);
          if (targetSection) {
            drawShip(targetSection);
          }
        }
        break;

      case 1: // x from 10 to 19
        for (let i = 1; i < length + 1; i++) {
          const targetSection = document.querySelector(`#${id}[value='${y + 10 + i}']`);
          if (targetSection) {
            drawShip(targetSection);
          }
        }
        break;

      case 2: // x from 20 to 29
        for (let i = 1; i < length + 1; i++) {
          const targetSection = document.querySelector(`#${id}[value='${y + 20 + i}']`);
          if (targetSection) {
            drawShip(targetSection);
          }
        }
        break;

      case 3: // x from 30 to 39
        for (let i = 1; i < length + 1; i++) {
          const targetSection = document.querySelector(`#${id}[value='${y + 30 + i}']`);
          if (targetSection) {
            drawShip(targetSection);
          }
        }
        break;

      case 4: // x from 40 to 49
        for (let i = 1; i < length + 1; i++) {
          const targetSection = document.querySelector(`#${id}[value='${y + 40 + i}']`);
          if (targetSection) {
            drawShip(targetSection);
          }
        }
        break;

      case 5: // x from 50 to 59
        for (let i = 1; i < length + 1; i++) {
          const targetSection = document.querySelector(`#${id}[value='${y + 50 + i}']`);
          if (targetSection) {
            drawShip(targetSection);
          }
        }
        break;

      case 6: // x from 60 to 69
        for (let i = 1; i < length + 1; i++) {
          const targetSection = document.querySelector(`#${id}[value='${y + 60 + i}']`);
          if (targetSection) {
            drawShip(targetSection);
          }
        }
        break;

      case 7: // x from 70 to 79
        for (let i = 1; i < length + 1; i++) {
          const targetSection = document.querySelector(`#${id}[value='${y + 70 + i}']`);
          if (targetSection) {
            drawShip(targetSection);
          }
        }
        break;

      case 8: // x from 80 to 89
        for (let i = 1; i < length + 1; i++) {
          const targetSection = document.querySelector(`#${id}[value='${y + 80 + i}']`);
          if (targetSection) {
            drawShip(targetSection);
          }
        }
        break;

      case 9: // x from 90 to 99
        for (let i = 1; i < length + 1; i++) {
          const targetSection = document.querySelector(`#${id}[value='${y + 90 + i}']`);
          if (targetSection) {
            drawShip(targetSection);
          }
        }
        break;

      default:
        console.error(`Value of x (${x}) is out of expected range.`);
        break;
    }
  }
  console.log(arrShip);
}

function clearBoard(activePlayer) {
  let object = activePlayer.gameBoard.gameBoardObj;
  for (const key in object) {
    if (object[key].includes(1)) {
      object[key] = Array(10).fill(0);
    }
  }

  const allSection = document.querySelectorAll(".sect");
  allSection.forEach((element) => {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  });

  console.log(activePlayer.gameBoard.gameBoardObj);

  activePlayer.gameBoard.coordinatesShip = [];
}

function randomShip(activePlayer, randKey, startP) {
  const arrShip = [1, 1, 1, 1, 2, 2, 2, 3, 3, 4];
  // const arrShip = [3, 3, 4, 4, 4, 3, 3];
  clearBoard(activePlayer);

  arrShip.forEach((element) => {
    let isPlaced = false;
    let attempts = 0; // Счётчик попыток
    const maxAttempts = 100; // Максимальное количество попыток

    while (!isPlaced && attempts < maxAttempts) {
      let randKey = Math.floor(Math.random() * 10);
      let startP = Math.floor(Math.random() * 10); // убрать коммит для рандома !!!!!1
      const result = activePlayer.gameBoard.placeShip(randKey, startP, element);

      if (!(result instanceof Error)) {
        isPlaced = true;
      } else {
        attempts++; // Увеличиваем количество попыток
      }
    }

    if (attempts >= maxAttempts) {
      console.error(
        `Не удалось разместить корабль длиной ${element} после ${maxAttempts} попыток.`
      );
      randomShip(activePlayer);
    }
  });
}

function botShot(activePlayer) {
  const randValue = Math.floor(Math.random() * 100 + 1); // 1-100

  const yx = convertInXY(randValue);
  let y = yx[0];
  let x = yx[1];
  console.log(y, x);
  console.log(activePlayer.gameBoard.gameBoardObj[y]);
  console.log(activePlayer.gameBoard.gameBoardObj[y].slice(x, x + 1));
  if (activePlayer.gameBoard.gameBoardObj[y].slice(x, x + 1).includes(1)) {
    findShip(activePlayer, y, x);
    console.log("GGGGGGGGGGGGGGGGGGGGG");
  } else {
    shotOnBoard(activePlayer, randValue);
  }
}

function bot() {
  randomShip(p2);
  shipdisplay(p2);
}

// setInterval(() => {
//   let activePlayer = p1;
//   let noActive = activePlayer === p1 ? p2 : p1;
//   if (
//     !noActive.gameBoard.gameOver &&
//     !activePlayer.gameBoard.gameOver &&
//     !activePlayer.gameBoard.active &&
//     activePlayer.gameBoard.startGame &&
//     noActive.gameBoard.startGame
//   ) {
//     botShot(p1);
//   }
// }, 2500);

bot();

function startGame() {
  p1.gameBoard.startGame = true;
  p2.gameBoard.startGame = true;
  p1.gameBoard.active = true;

  prSections.forEach((section) => {
    if (p1.gameBoard.startGame || p2.gameBoard.startGame) {
      section.addEventListener("click", () => {
        displayInfo("Не стреляй по своему полю");
      });
    }
  });
}

click(p1);

const startBtn = document.querySelector(".start__btn");
const randomise = document.querySelector(".move-ship__btn");

startBtn.addEventListener("click", () => {
  const shipisplaced = !Object.values(p1.gameBoard.gameBoardObj).some((row) => row.includes(1));
  if (!shipisplaced) {
    startGame();
    startBtn.disabled = true;
    startBtn.classList.add("disable");
    randomise.disabled = true;
    randomise.classList.add("disable");
  } else {
    console.log("тестировщик молодец");
  }
});

randomise.addEventListener("click", () => {
  randomShip(p1); //убрать числа для рандома
  shipdisplay(p1);
});

function displayInfo(text) {
  const main = document.querySelector(".main");

  const infoBlur = document.createElement("div");
  const info = document.createElement("div");
  const infotext = document.createElement("h3");

  infoBlur.classList.add("info__blure");
  info.classList.add("info");
  infotext.classList.add("info__text");
  infotext.textContent = `${text}`;

  info.append(infotext);
  infoBlur.append(info);
  main.prepend(infoBlur);

  setTimeout(() => {
    infoBlur.classList.add("vis");
    info.classList.add("open");
  });

  infoBlur.addEventListener("click", () => {
    infoBlur.classList.remove("vis");
    info.classList.remove("open");
  });
}

function findShip(activePlayer, y, x) {
  let noActive = activePlayer === p1 ? p2 : p1;
  let arrShip = activePlayer.gameBoard.coordinatesShip;

  if (arrShip.length < 3) {
    return;
  }

  let coordinates;

  // Поиск корабля по координатам
  for (let i = 0; i < arrShip.length; i += 3) {
    if (y == arrShip[i] && x >= arrShip[i + 1] && x < arrShip[i + 1] + arrShip[i + 2]) {
      coordinates = arrShip.slice(i, i + 3); // Получаем координаты корабля: [y, startX, length]
      break; // Прекращаем поиск после нахождения нужного корабля
    }
  }

  if (!coordinates) {
    return;
  }
  console.log("Координаты корабля:", coordinates);

  // Получаем все секции корабля
  let shipSection = activePlayer.gameBoard.gameBoardObj[coordinates[0]].slice(
    coordinates[1],
    coordinates[1] + coordinates[2]
  );

  console.log("Секции корабля:", shipSection);

  // Проверяем, есть ли ещё не поражённые секции (1)
  if (!shipSection.includes(1)) {
    console.log(`Корабль размером ${coordinates[2]} потоплен`);
    return;
  }

  const x1 = coordinates[1]; // Начальная позиция по колонке
  const y1 = coordinates[0]; // Позиция по строке
  const length = coordinates[2]; // Длина корабля

  console.log("Позиции (y1, x1):", y1, x1, "Длина корабля:", length);

  // Функция для выполнения выстрела с задержкой
  function delayedShot(index) {
    if (activePlayer.gameBoard.gameOver || noActive.gameBoard.gameOver) {
      return;
    }
    if (index >= length) {
      console.log("Все секции проверены");
      botShot(p1);
      return;
    }

    // Проверка статуса секции (есть ли непоражённые клетки)
    if (activePlayer.gameBoard.gameBoardObj[coordinates[0]][coordinates[1] + index] === 1) {
      let value = convertInValue(coordinates[0], coordinates[1] + index);
      console.log(coordinates[1] + index + " ffffffffffffffffff");
      shotOnBoard(activePlayer, value); // Вызов функции выстрела
      console.log("Выстрел по секции:", index);
    } else {
      console.log(`Секция ${index} уже поражена!`);
    }

    // Задержка перед следующим выстрелом
    setTimeout(() => delayedShot(index + 1), 1000); // 1000 мс = 1 секунда
  }

  // Начинаем серию выстрелов с первой секции корабля
  delayedShot(0);
}

function identifyShip(activePlayer, y, x) {
  let originalPlayer = activePlayer;
  activePlayer = activePlayer == p1 ? p2 : p1;
  let arrShip = activePlayer.gameBoard.coordinatesShip;

  if (arrShip.length < 3) {
    return;
  }

  let coordinates;

  for (let i = 0; i < arrShip.length; i += 3) {
    if (y == arrShip[i] && x >= arrShip[i + 1] && x < arrShip[i + 1] + arrShip[i + 2]) {
      coordinates = arrShip.slice(i, i + 3); // Получаем координаты корабля: [y, startX, length]
      break; // Прекращаем поиск после нахождения нужного корабля
    }
  }

  if (!coordinates) {
    return;
  }

  // Получаем все секции корабля
  let shipSection = activePlayer.gameBoard.gameBoardObj[coordinates[0]].slice(
    coordinates[1],
    coordinates[1] + coordinates[2]
  );

  // Проверяем, потоплен ли корабль (нет ли секций со значением 1)
  if (!shipSection.includes(1)) {
    console.log(`Корабль размером ${coordinates[2]} потоплен`);

    // Закрашиваем клетки вокруг корабля
    for (let i = coordinates[1] - 1; i <= coordinates[1] + coordinates[2]; i++) {
      if (i >= 0 && i < activePlayer.gameBoard.width) {
        // Верхняя клетка
        if (
          coordinates[0] - 1 >= 0 &&
          activePlayer.gameBoard.gameBoardObj[coordinates[0] - 1][i] === 0
        ) {
          activePlayer.gameBoard.gameBoardObj[coordinates[0] - 1][i] = 2;
          let value = (coordinates[0] - 1) * 10 + i + 1;
          displayShot(originalPlayer, [coordinates[0] - 1, i, 2], value); // Обновляем верхнюю клетку
        }

        // Нижняя клетка
        if (
          coordinates[0] + 1 < activePlayer.gameBoard.height &&
          activePlayer.gameBoard.gameBoardObj[coordinates[0] + 1][i] === 0
        ) {
          activePlayer.gameBoard.gameBoardObj[coordinates[0] + 1][i] = 2;
          let value = (coordinates[0] + 1) * 10 + i + 1;
          displayShot(originalPlayer, [coordinates[0] + 1, i, 2], value); // Обновляем нижнюю клетку
        }
      }
    }

    // Левая клетка от корабля
    if (
      coordinates[1] - 1 >= 0 &&
      activePlayer.gameBoard.gameBoardObj[coordinates[0]][coordinates[1] - 1] === 0
    ) {
      activePlayer.gameBoard.gameBoardObj[coordinates[0]][coordinates[1] - 1] = 2;
      let value = coordinates[0] * 10 + coordinates[1];
      displayShot(originalPlayer, [coordinates[0], coordinates[1], 2], value); // Обновляем левую клетку
    }

    if (
      coordinates[1] + coordinates[2] < activePlayer.gameBoard.width &&
      activePlayer.gameBoard.gameBoardObj[coordinates[0]][coordinates[1] + coordinates[2]] === 0
    ) {
      activePlayer.gameBoard.gameBoardObj[coordinates[0]][coordinates[1] + coordinates[2]] = 2;
      let value = coordinates[0] * 10 + (coordinates[1] + coordinates[2] + 1);
      displayShot(originalPlayer, [coordinates[0], coordinates[1] + coordinates[2], 2], value); // Обновляем правую клетку
    }

    return;
  } else {
    console.log("Корабль не потоплен");
  }
}

module.exports = { Ship, Gameboard, Player };
