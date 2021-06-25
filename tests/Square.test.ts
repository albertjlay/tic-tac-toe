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
  const testSquare = new Square(7);
  const testSquareDOM = testSquare.render();
  expect(testSquareDOM.id).toBe('square7');
  expect(testSquareDOM.classList).toContain('square');

  testSquare.state = PlayerID.P2;
  const updatedSquareDOM = testSquare.render();
  expect(updatedSquareDOM.classList).toContain('P2');
  expect(updatedSquareDOM.classList).not.toContain('P1');
});
