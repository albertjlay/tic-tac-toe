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

test('Win condition', () => {
  const testBoard = new Board();
  const checkWinningPattern = (board: Board, arr: number[]) => {
    expect(board.checkResult().length).toBe(arr.length);
    arr.forEach((el) => {
      expect(board.checkResult()).toContain(el);
    });
  };

  // Horizontal
  testBoard.xSquares = [0, 1, 2];
  testBoard.oSquares = [4, 5];
  checkWinningPattern(testBoard, testBoard.xSquares);
  testBoard.xSquares = [0, 7, 6, 1];
  testBoard.oSquares = [3, 4, 5];
  checkWinningPattern(testBoard, testBoard.oSquares);
  testBoard.xSquares = [7, 6, 8];
  testBoard.oSquares = [3, 4];
  checkWinningPattern(testBoard, testBoard.xSquares);

  // Vertical
  testBoard.xSquares = [0, 6, 3];
  testBoard.oSquares = [4, 5];
  checkWinningPattern(testBoard, testBoard.xSquares);
  testBoard.xSquares = [0, 2, 6, 8];
  testBoard.oSquares = [7, 4, 1];
  checkWinningPattern(testBoard, testBoard.oSquares);
  testBoard.xSquares = [2, 5, 8];
  testBoard.oSquares = [3, 4];
  checkWinningPattern(testBoard, testBoard.xSquares);

  // Diagonal
  testBoard.xSquares = [8, 0, 4];
  testBoard.oSquares = [1, 2];
  checkWinningPattern(testBoard, testBoard.xSquares);
  testBoard.xSquares = [0, 1, 8, 5];
  testBoard.oSquares = [2, 4, 6];
  checkWinningPattern(testBoard, testBoard.oSquares);

  // Draw
  testBoard.xSquares = [0, 2, 3, 5, 7];
  testBoard.oSquares = [1, 4, 6, 8];
  checkWinningPattern(testBoard, [-1]);

  // Should not win.
  testBoard.xSquares = [0, 4, 5, 6];
  testBoard.oSquares = [1, 3, 7];
  checkWinningPattern(testBoard, []);

  // Win when full
  testBoard.xSquares = [0, 4, 5, 6, 8];
  testBoard.oSquares = [1, 2, 3, 7];
  checkWinningPattern(testBoard, [0, 4, 8]);
});
