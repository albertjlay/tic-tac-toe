import Board from '../src/Board';
import { PlayerID, SquareID } from '../src/types';

test('Initialization of board', () => {
  const testBoard = new Board();
  expect(testBoard.xSquares.length).toBe(0);
  expect(testBoard.oSquares.length).toBe(0);
  expect(testBoard.boardSquares.length).toBe(9);
  expect(testBoard.currentTurn).toBe(PlayerID.playerX);
  testBoard.boardSquares.forEach((el, idx) => {
    expect(el.id).toBe(idx);
  });
});

test('Check winning patterns', () => {
  const testBoard = new Board();
  const checkWinningPattern = (board: Board, expectedWinPattern: number[][]) => {
    const computedWinPattern = [
      ...board.findWins(board.xSquares),
      ...board.findWins(board.oSquares),
    ];

    // Sorting both arrays (so order does not matter)
    computedWinPattern.map((pattern) => pattern.sort((a, b) => a - b));
    expectedWinPattern.map((pattern) => pattern.sort((a, b) => a - b));

    expect(computedWinPattern.length).toBe(expectedWinPattern.length);
    expectedWinPattern.forEach((pattern) => {
      expect(computedWinPattern).toContainEqual(pattern);
    });
  };

  // ------------------------ Single Pattern -------------------- //
  // Horizontal
  testBoard.xSquares = [0, 1, 2];
  testBoard.oSquares = [4, 5];
  checkWinningPattern(testBoard, [testBoard.xSquares]);
  testBoard.xSquares = [0, 7, 6, 1];
  testBoard.oSquares = [3, 4, 5];
  checkWinningPattern(testBoard, [testBoard.oSquares]);
  testBoard.xSquares = [7, 6, 8];
  testBoard.oSquares = [3, 4];
  checkWinningPattern(testBoard, [testBoard.xSquares]);

  // Vertical
  testBoard.xSquares = [0, 6, 3];
  testBoard.oSquares = [4, 5];
  checkWinningPattern(testBoard, [testBoard.xSquares]);
  testBoard.xSquares = [0, 2, 6, 8];
  testBoard.oSquares = [7, 4, 1];
  checkWinningPattern(testBoard, [testBoard.oSquares]);
  testBoard.xSquares = [2, 5, 8];
  testBoard.oSquares = [3, 4];
  checkWinningPattern(testBoard, [testBoard.xSquares]);

  // Diagonal
  testBoard.xSquares = [8, 0, 4];
  testBoard.oSquares = [1, 2];
  checkWinningPattern(testBoard, [testBoard.xSquares]);
  testBoard.xSquares = [0, 1, 8, 5];
  testBoard.oSquares = [2, 4, 6];
  checkWinningPattern(testBoard, [testBoard.oSquares]);

  // Win when full
  testBoard.xSquares = [0, 4, 5, 6, 8];
  testBoard.oSquares = [1, 2, 3, 7];
  checkWinningPattern(testBoard, [[0, 4, 8]]);

  // ------------------------ Multiple patterns -------------------- //
  testBoard.xSquares = [0, 2, 4, 6, 8];
  testBoard.oSquares = [1, 3, 5, 7];
  checkWinningPattern(testBoard, [
    [0, 4, 8],
    [2, 4, 6],
  ]);

  testBoard.xSquares = [0, 1, 3, 4];
  testBoard.oSquares = [2, 5, 6, 7, 8];
  checkWinningPattern(testBoard, [
    [2, 5, 8],
    [6, 7, 8],
  ]);

  testBoard.xSquares = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  testBoard.oSquares = [];
  checkWinningPattern(testBoard, [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]);
});

test('Check draw and inconclusive patterns', () => {
  // // ---------------------------- Draw ------------------------- //
  // testBoard.xSquares = [0, 2, 3, 5, 7];
  // testBoard.oSquares = [1, 4, 6, 8];
  // checkWinningPattern(testBoard, [-1]);
  // // ---------------------------- None --------------------------- //
  // testBoard.xSquares = [0, 4, 5, 6];
  // testBoard.oSquares = [1, 3, 7];
  // checkWinningPattern(testBoard, []);
  //  // ------------------------------------------------------------ //
});
