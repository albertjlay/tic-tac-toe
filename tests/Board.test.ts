import Board from '../src/Board';
import { PlayerID, SquareID } from '../src/types';

test('Initialization of board', () => {
  const testBoard = new Board();
  expect(testBoard.xSquares.length).toBe(0);
  expect(testBoard.oSquares.length).toBe(0);
  expect(testBoard.freeSquares.length).toBe(9);
  expect(testBoard.boardSquares.length).toBe(9);
  expect(testBoard.currentTurn).toBe(PlayerID.playerX);
  expect(testBoard.curWinPattern.length).toBe(0);
  expect(testBoard.isGameOver).toBe(false);
  expect(testBoard.isDraw).toBe(false);
  expect(testBoard.prevMove).toBe(null);
  testBoard.boardSquares.forEach((el, idx) => {
    expect(el.id).toBe(idx);
    expect(testBoard.freeSquares[idx]).toBe(idx);
  });
});

test('Player moves', () => {
  const testBoard = new Board();
  // Test another player moves when it's not their turn.
  expect(() => {
    testBoard.playerMove(4, PlayerID.playerO);
  }).toThrow();

  // Test game states.
  testBoard.playerMove(4, PlayerID.playerX);
  expect(testBoard.currentTurn).toBe(PlayerID.playerO);
  expect(testBoard.isDraw).toBe(false);
  expect(testBoard.isGameOver).toBe(false);
  expect(testBoard.oSquares.length).toBe(0);
  expect(testBoard.xSquares.length).toBe(1);
  expect(testBoard.xSquares[0]).toBe(4);
  expect(testBoard.curWinPattern.length).toBe(0);
  expect(testBoard.freeSquares.length).toBe(8);
  expect(testBoard.freeSquares.includes(4)).toBe(false);
  expect(testBoard.prevMove).toBe(4);

  // Test occupying the same square.
  expect(() => {
    testBoard.playerMove(4, PlayerID.playerO);
  }).toThrow();
  testBoard.playerMove(5, PlayerID.playerO);
});

test('Check winning patterns', () => {
  /**
   * Testing function which tests whether findWins work as expected.
   * @param moves An array of player moves, where odd indices are playerX and even are playerO
   * @param expectedWinPatterns Expected pattern
   */
  const checkWinningPattern = (moves: SquareID[], expectedWinPatterns: SquareID[][]) => {
    const testBoard = new Board();
    moves.forEach((move) => {
      testBoard.playerMove(move, testBoard.currentTurn);
    });

    const computedWinPatterns = [
      ...testBoard.findWins(testBoard.xSquares),
      ...testBoard.findWins(testBoard.oSquares),
    ];

    // Sorting both arrays (so order does not matter)
    computedWinPatterns.map((pattern) => pattern.sort((a, b) => a - b));
    expectedWinPatterns.map((pattern) => pattern.sort((a, b) => a - b));

    expect(computedWinPatterns.length).toBe(expectedWinPatterns.length);
    expectedWinPatterns.forEach((pattern) => {
      expect(computedWinPatterns).toContainEqual(pattern);
    });
  };

  // ------------------------ Single Pattern -------------------- //
  // Horizontal
  checkWinningPattern([0, 4, 1, 5, 2], [[0, 1, 2]]);
  checkWinningPattern([0, 3, 7, 4, 6, 5, 1], [[3, 4, 5]]);
  checkWinningPattern([7, 3, 6, 4, 8], [[7, 6, 8]]);

  // // Vertical
  checkWinningPattern([0, 4, 6, 5, 3], [[0, 6, 3]]);
  checkWinningPattern([0, 7, 2, 4, 6, 1, 8], [[7, 4, 1]]);
  checkWinningPattern([2, 3, 5, 4, 8], [[2, 5, 8]]);

  // // Diagonal
  checkWinningPattern([8, 1, 0, 2, 4], [[8, 0, 4]]);
  checkWinningPattern([0, 2, 1, 4, 8, 6, 5], [[2, 4, 6]]);

  // // Win when full
  checkWinningPattern([0, 1, 4, 2, 5, 3, 6, 7, 8], [[0, 4, 8]]);

  // // ------------------------ Multiple patterns -------------------- //
  checkWinningPattern(
    [0, 1, 2, 3, 4, 5, 6, 7, 8],
    [
      [0, 4, 8],
      [2, 4, 6],
    ]
  );
  checkWinningPattern(
    [2, 0, 5, 1, 6, 3, 7, 4, 8],
    [
      [2, 5, 8],
      [6, 7, 8],
    ]
  );
});

test('Check draw and inconclusive patterns', () => {
  enum Result {
    DRAW,
    INCONCLUSIVE,
  }
  const checkDrawOrInconclusive = (moves: SquareID[], result: Result) => {
    const testBoard = new Board();
    moves.forEach((move) => {
      testBoard.playerMove(move, testBoard.currentTurn);
    });

    if (result === Result.DRAW) {
      expect(testBoard.isDraw).toBe(true);
      expect(testBoard.isGameOver).toBe(true);
    } else {
      expect(testBoard.isDraw).toBe(false);
      expect(testBoard.isGameOver).toBe(false);
      expect(testBoard.curWinPattern.length).toBe(0);
    }
  };

  checkDrawOrInconclusive([0, 1, 2, 3, 4, 6, 5, 8, 7], Result.DRAW);
  checkDrawOrInconclusive([0, 1, 2, 3, 5, 4, 6, 8, 7], Result.DRAW);
  checkDrawOrInconclusive([], Result.INCONCLUSIVE);
  checkDrawOrInconclusive([5], Result.INCONCLUSIVE);
  checkDrawOrInconclusive([], Result.INCONCLUSIVE);
  checkDrawOrInconclusive([0, 5, 7, 1, 4], Result.INCONCLUSIVE);
});
