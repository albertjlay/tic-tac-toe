import Board from '../src/Board';
import { PlayerID } from '../src/types';

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

  // Horizontal
  testBoard.xSquares = [0, 1, 2];
  testBoard.oSquares = [4, 5];
  expect(testBoard.checkResult()).toBe(PlayerID.playerX);
  testBoard.xSquares = [0, 7, 6, 1];
  testBoard.oSquares = [3, 4, 5];
  expect(testBoard.checkResult()).toBe(PlayerID.playerO);
  testBoard.xSquares = [7, 6, 8];
  testBoard.oSquares = [3, 4];
  expect(testBoard.checkResult()).toBe(PlayerID.playerX);

  // Vertical
  testBoard.xSquares = [0, 6, 3];
  testBoard.oSquares = [4, 5];
  expect(testBoard.checkResult()).toBe(PlayerID.playerX);
  testBoard.xSquares = [0, 2, 6, 8];
  testBoard.oSquares = [7, 4, 1];
  expect(testBoard.checkResult()).toBe(PlayerID.playerO);
  testBoard.xSquares = [2, 5, 8];
  testBoard.oSquares = [3, 4];
  expect(testBoard.checkResult()).toBe(PlayerID.playerX);

  // Diagonal
  testBoard.xSquares = [8, 0, 4];
  testBoard.oSquares = [1, 2];
  expect(testBoard.checkResult()).toBe(PlayerID.playerX);
  testBoard.xSquares = [0, 1, 8, 5];
  testBoard.oSquares = [2, 4, 6];
  expect(testBoard.checkResult()).toBe(PlayerID.playerO);
});
