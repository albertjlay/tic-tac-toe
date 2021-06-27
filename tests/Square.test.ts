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

test('Correctness of position types', () => {
  const testSquare0 = new Square(0);
  expect(testSquare0.positionType).toBe(PositionType.CORNER);
  const testSquare1 = new Square(1);
  expect(testSquare1.positionType).toBe(PositionType.EDGE);
  const testSquare2 = new Square(2);
  expect(testSquare2.positionType).toBe(PositionType.CORNER);
  const testSquare3 = new Square(3);
  expect(testSquare3.positionType).toBe(PositionType.EDGE);
  const testSquare4 = new Square(4);
  expect(testSquare4.positionType).toBe(PositionType.CENTER);
  const testSquare5 = new Square(5);
  expect(testSquare5.positionType).toBe(PositionType.EDGE);
  const testSquare6 = new Square(6);
  expect(testSquare6.positionType).toBe(PositionType.CORNER);
  const testSquare7 = new Square(7);
  expect(testSquare7.positionType).toBe(PositionType.EDGE);
  const testSquare8 = new Square(8);
  expect(testSquare8.positionType).toBe(PositionType.CORNER);
});
