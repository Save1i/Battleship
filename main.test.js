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
  it("createBoard() created obj lengh == Gameboard height", () => {
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
});
