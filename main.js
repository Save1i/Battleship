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
  //ДРБАВИТЬ ШАБЛОН КАРАБЛЕЙ ПО НАЗВАНИЯМ -- нет
}

class Gameboard {
  constructor(height = 10, width = 10, startGame = false, gameOver = false, active = true) {
    this.height = height;
    this.width = width;
    this.gameOver = gameOver;
    this.startGame = startGame;

    this.active = active;

    this.coordinatesShip = new Array();
    this.coordinateShot = new Array();

    this.createBoard();
  }
  // ДОБАВИТЬ ПРОВЕРКУ ЧТОБЫ ВСЕ КОРАБЛИ БЫЛИ ПОСТАВЛЕНЫ НА ПОЛЕ -- нет

  //ДОБАВТЬ ПРОВЕРКУ КОНЦА ИГРЫ -- есть

  //Добавить проверку на начало игры!!! -- есть
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
      return new Error("сюда нельзя поставить корабль");
    }
    if (this.startGame == true) {
      return new Error("игра уже началась, нельзя переставлять корабли");
    }
    if (this.width - (startP - 1) <= length || startP < 0) {
      return new Error("часть карабля выходит за пределы поля");
    }

    let x = startP;
    let y = key;
    let l = length;
    this.coordinatesShip.push(y, x, l);
    // проверка на расстояние от кораблей 1 клетка -- нет
    for (let i = startP; i < startP + length; i++) {
      this.gameBoardObj[key].splice(i, 1, 1);
    }
  }

  shot(y, x) {
    // this.active = !this.active;
    this.startGame = true;

    if (isNaN(x) || isNaN(y)) {
      throw new Error("Координаты должны быть числами");
    }
    if (x >= this.width || x < 0 || y >= this.height || y < 0) {
      throw new Error("Значения координат должны быть в пределах поля");
    }
    if (this.gameOver) {
      throw new Error("Игра окончена! Все корабли уничтожены.");
    }
    if (this.gameBoardObj[y][x] === 7 || this.gameBoardObj[y][x] === 2) {
      throw new Error("Это поле уже было атаковано");
    } else if (this.gameBoardObj[y][x] === 0) {
      this.gameBoardObj[y].splice(x, 1, 2);
      this.coordinateShot.push([y, x]);
      return [y, x, 2];
    } else if (this.gameBoardObj[y][x] === 1) {
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
    // this.key = key;
    // this.startP = startP;
    // this.length = length;
    this.gameBoard = new Gameboard();
  }
}

const p1 = new Player(false); // player
const p2 = new Player(true); // computer

const pSections = document.querySelectorAll(".sect");
const rSections = document.querySelectorAll(".section");

function click(activePlayer) {
  return new Promise((resolve) => {
    if (activePlayer.isCpu == false) {
      rSections.forEach((section) => {
        section.addEventListener("click", (e) => {
          resolve(e.currentTarget.getAttribute("value"));
        });
      });
    } else if (activePlayer.isCpu == true) {
      pSections.forEach((section) => {
        section.addEventListener("click", (e) => {
          resolve(e.currentTarget.getAttribute("value"));
        });
      });
    }
  });
}

function convertInXY(value) {
  let columns = 10;
  const index = value - 1; // Преобразуем value в индекс (начиная с 0)
  const y = Math.floor(index / columns); // Определяем строку (y)
  const x = index % columns; // Определяем столбец (x)
  return [y, x];
}

async function shotOnBoard(activePlayer) {
  activePlayer = activePlayer == p1 ? p1 : p2;
  let noActive = activePlayer === p1 ? p2 : p1;

  // Continuously check if the game is over and perform shots
  while (!noActive.gameBoard.gameOver) {
    console.log("End Game Status:", noActive.gameBoard.gameOver);

    try {
      // Await the player's shot input
      const shot = await click(activePlayer);
      const [y, x] = convertInXY(shot); // Convert the clicked section to coordinates

      // Execute the shot and display the result
      let coords = noActive.gameBoard.shot(y, x);
      console.log("Shot Result:", coords);

      displayShot(activePlayer, coords, shot); // Visualize the shot on the board

      // Update the game-over status after the shot
      noActive.gameBoard.endGame();
      // Check if the game has ended after the shot
      if (noActive.gameBoard.gameOver) {
        console.log("Game Over!");
        break;
      }

      // Switch turns between players after each shot
      [activePlayer, noActive] = [noActive, activePlayer]; // Swap players
    } catch (error) {
      console.error("Error during shot:", error.message);
    }
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
      console.log("boom");
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
  const allSection = document.querySelectorAll(".sect");
  allSection.forEach((element) => {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  });
  activePlayer.gameBoard.coordinatesShip = [];
}

function randomShip(activePlayer) {
  // arrShip = [1, 1, 1, 1, 2, 2, 2, 3, 3, 4];
  arrShip = [1];
  clearBoard(activePlayer);

  arrShip.forEach((element) => {
    let isPlaced = false;
    while (!isPlaced) {
      let randKey = Math.floor(Math.random() * 10);
      let startP = Math.floor(Math.random() * 10);
      const result = activePlayer.gameBoard.placeShip(randKey, startP, element);

      if (!(result instanceof Error)) {
        isPlaced = true;
      }
    }
  });
}

function bot() {
  randomShip(p2);
  shipdisplay(p2);
}

bot();

// async function handleTurns() {
//   let activePlayer = p1.gameBoard.active ? p1 : p2;
//   let noActivePlayer = p1.gameBoard.active ? p2 : p1;

//   while (!noActivePlayer.gameBoard.gameOver) {
//     console.log(`It's ${activePlayer.name}'s turn`);

//     // Ensure the shotOnBoard function finishes before switching turns
//     await shotOnBoard(activePlayer);

//     // Switch the active player
//     p1.gameBoard.active = !p1.gameBoard.active;
//     p2.gameBoard.active = !p2.gameBoard.active;

//     activePlayer = p1.gameBoard.active ? p1 : p2;
//     noActivePlayer = p1.gameBoard.active ? p2 : p1;
//   }

//   console.log("Game Over!");
// }

// Функция для начала игры по нажатию на кнопку "Start"
function startGame() {}
shotOnBoard(p1);

const startBtn = document.querySelector(".start__btn");
const randomise = document.querySelector(".move-ship__btn");

startBtn.addEventListener("click", startGame);

randomise.addEventListener("click", () => {
  randomShip(p1);
  shipdisplay(p1);
});

// module.exports = { Ship, Gameboard, Player };
