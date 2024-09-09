const { Ship, Gameboard } = require("./main.js");

describe("tests ship", () => {
  it("A ship of length 2 should issue { length: 2, hits: 0, rip: true }", () => {
    const smallShip = new Ship(2);
    expect(smallShip.length).toBe(2);
    expect(smallShip.hits).toBe(0);
    expect(smallShip.rip).toBe(false);
  });
  it("if the length of the ship is equal to the hits, it rip", () => {
    const smallShip = new Ship(2);
    smallShip.hit();
    smallShip.hit();
    expect(smallShip.length).toBe(2);
    expect(smallShip.hits).toBe(2);
    expect(smallShip.rip).toBe(true);
  });
  it("A ship of length 0 should issue Error", () => {
    const nonexistentShip = new Ship(0);
    expect(nonexistentShip).toEqual(Error("Длинна корабля должна быть больше 0"));
  });
  it("A ship of length none should issue Error", () => {
    const nonexistentShip = new Ship();
    expect(nonexistentShip).toEqual(Error("Длинна корабля должна быть больше 0"));
  });
});

describe("test from board", () => {
  //29.08.2024
  it("create obj where height == 10 and width == 10", () => {
    const board = new Gameboard(10, 10);
    expect(board.height).toBe(10);
    expect(board.width).toBe(10);
  });
  it("createBoard() created obj height == Gameboard height", () => {
    const board = new Gameboard(10);
    board.createBoard();
    expect(Object.keys(board.gameBoardObj).length).toBe(10);
  });
  it("method placeChip(4, 3, 4) => board.gameBoardObj[key].slice(3, 7) == [1, 1, 1, 1]", () => {
    const board = new Gameboard(10);
    board.createBoard();
    board.placeShip(4, 3, 4);
    expect(board.gameBoardObj[4].slice(3, 7)).toEqual([1, 1, 1, 1]);
  });
  it("method placeChip(4, 8, 4) => Error (часть карабля выходит за пределы поля)", () => {
    const board = new Gameboard(10);
    board.createBoard();
    expect(board.placeShip(4, 8, 4)).toEqual(Error("часть карабля выходит за пределы поля"));
  });
  it("method placeChip() => Error (часть карабля выходит за пределы поля)", () => {
    const board = new Gameboard(10);
    board.createBoard();
    expect(board.placeShip()).toEqual(Error("введите данные для размещения корабля"));
  });
  it("method shot(1, 1) => border.gameBoardObj[1][1] == 2", () => {
    const board = new Gameboard(10);
    board.createBoard();
    board.shot(1, 1);
    expect(board.gameBoardObj[1][1]).toBe(2);
  });
  it("method shot(2, 1) => return get = [2, 1]", () => {
    const board = new Gameboard(10);
    board.createBoard();
    expect(board.shot(2, 1)).toEqual([2, 1]);
  });
  it("method shot(1, 1) => when hitting the ship, it should change the value to 7", () => {
    const board = new Gameboard(10);
    board.createBoard();
    board.placeShip(1, 1, 2);
    board.shot(1, 1);
    board.shot(1, 2);
    expect(board.gameBoardObj[1][1]).toBe(7);
    expect(board.gameBoardObj[1][2]).toBe(7);
  });

  it("the size of the field is 10 => 0-9, the value of 10 for key goes beyond these limits, method shot(10, 1) => Error", () => {
    const board = new Gameboard(10);
    board.createBoard();
    expect(board.shot(10, 1)).toEqual(Error("значения координат должны быть в пределах поля"));
  });
  it("the size of the field is -1 => 0-9, the value of 10 for key goes beyond these limits, method shot(-1, 1) => Error", () => {
    const board = new Gameboard(10);
    board.createBoard();
    expect(board.shot(-1, 1)).toEqual(Error("значения координат должны быть в пределах поля"));
  });
  it("When there are no ships left on the map, the game is over", () => {
    const board = new Gameboard(10);
    board.createBoard();
    board.placeShip(1, 1, 2);
    board.shot(1, 1);
    board.shot(1, 2);
    expect(board.gameOver).toBe(true);
  });
  it("When there are no ships left on the map, the game is over", () => {
    const board = new Gameboard(10);
    board.createBoard();
    board.placeShip(1, 1, 2);
    board.shot(1, 1);
    board.shot(1, 2);
    expect(board.startGame).toBe(true);
  });
  it("After the first shot, the game start Game == true, permutation is prohibited", () => {
    const board = new Gameboard(10);
    board.createBoard();
    board.placeShip(1, 1, 2);
    board.shot(1, 1);
    expect(board.placeShip(4, 1, 4)).toEqual(
      Error("игра уже началась, нельзя переставлять корабли")
    );
  });
  it("checking the placement of ships, placeShip(1, 1, 2) and board.placeShip(1, 2, 4) => Error", () => {
    const board = new Gameboard(10);
    board.createBoard();
    board.placeShip(1, 1, 2);
    expect(board.placeShip(1, 2, 4)).toEqual(Error("сюда нельзя поставить корабль"));
  });
  it("checking the placement of ships, placeShip(1, 1, 2) and board.placeShip(1, 2, 4) => Error", () => {
    const board = new Gameboard(10);
    board.createBoard();
    board.placeShip(1, 1, 2);
    expect(board.placeShip(1, 3, 4)).toEqual(Error("сюда нельзя поставить корабль"));
  });
  it("checking the placement of ships, placeShip(1, 1, 2) and board.placeShip(1, 2, 4) => Error", () => {
    const board = new Gameboard(10);
    board.createBoard();
    board.placeShip(2, 0, 2);
    expect(board.placeShip(3, 0, 2)).toEqual(Error("сюда нельзя поставить корабль"));
  });
});
