import Square from '../src/Square';
import { PlayerID, PositionType } from '../src/types';

test('Correctness of square properties', () => {
  const testSquare = new Square(5);
  expect(testSquare.id).toBe(5);
  expect(testSquare.state).toBe(undefined);
  testSquare.state = PlayerID.playerX;
  expect(testSquare.state).toBe(PlayerID.playerX);
  testSquare.state = PlayerID.playerO;
  expect(testSquare.state).toBe(PlayerID.playerX);
});

test('Correctness of square DOM properties', () => {
  const testSquare1 = new Square(7);
  const parent1 = document.createElement('div');
  testSquare1.render(parent1, () => console.log('Click!'));
  const testSquareDOM1 = parent1.children[0];
  expect(testSquareDOM1).not.toBeUndefined;
  expect(testSquareDOM1.id).toBe('square7');
  expect(testSquareDOM1.classList).toContain('square');

  testSquare1.state = PlayerID.playerO;
  expect(testSquareDOM1.classList).toContain('playerO');
  expect(testSquareDOM1.classList).not.toContain('playerX');

  // Try changing state before rendering.
  const testSquare2 = new Square(6);
  const parent2 = document.createElement('div');
  testSquare2.state = PlayerID.playerX;
  testSquare2.render(parent2, () => console.log('Click!'));
  const testSquareDOM2 = parent2.children[0];
  expect(testSquareDOM2).not.toBeUndefined;
  expect(testSquareDOM2.id).toBe('square6');
  expect(testSquareDOM2.classList).toContain('square');
  expect(testSquareDOM2.classList).toContain('playerX');
  expect(testSquareDOM2.classList).not.toContain('playerO');
});
