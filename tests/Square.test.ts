import Square from '../src/Square';
import { PlayerID } from '../src/types';

test('Correctness of square properties', () => {
  const testSquare = new Square(5);
  expect(testSquare.id).toBe(5);
  expect(testSquare.state).toBe(undefined);
  testSquare.state = PlayerID.P1;
  expect(testSquare.state).toBe(PlayerID.P1);
  testSquare.state = PlayerID.P2;
  expect(testSquare.state).toBe(PlayerID.P1);
});

test('Correctness of square DOM properties', () => {
  const testSquare1 = new Square(7);
  const parent1 = document.createElement('div');
  testSquare1.render(parent1);
  const testSquareDOM1 = parent1.children[0];
  expect(testSquareDOM1).not.toBeUndefined;
  expect(testSquareDOM1.id).toBe('square7');
  expect(testSquareDOM1.classList).toContain('square');

  testSquare1.state = PlayerID.P2;
  expect(testSquareDOM1.classList).toContain('P2');
  expect(testSquareDOM1.classList).not.toContain('P1');

  // Try changing state before rendering.
  const testSquare2 = new Square(6);
  const parent2 = document.createElement('div');
  testSquare2.state = PlayerID.P2;
  testSquare2.render(parent2);
  const testSquareDOM2 = parent2.children[0];
  expect(testSquareDOM2).not.toBeUndefined;
  expect(testSquareDOM2.id).toBe('square6');
  expect(testSquareDOM2.classList).toContain('square');
  expect(testSquareDOM2.classList).toContain('P2');
  expect(testSquareDOM2.classList).not.toContain('P1');
});
