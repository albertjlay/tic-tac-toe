import './style.scss';
import Board from './Board';
import DumbAIOpponent from './DumbAIOpponent';
import { PlayerID } from './types';

// /**
//  * Clears root div and instantiate a new board.
//  */
// const newGame = function () {
//   console.log('run');
//   const root = document.getElementById('root')!;
//   root.innerHTML = '';
//   const board = new Board();
//   board.render(root);
//   const cpuPlayer = new DumbAIOpponent(PlayerID.playerO, board);
// };

// // Add click handler to reset button.
// const resetButton = document.querySelector('#reset');
// resetButton?.addEventListener('click', newGame);

// newGame();

type gameMode = 'HvH' | 'HvDAI' | 'DAIvH' | 'HvSAI' | 'SAIvH';
const newGame = function (mode: string) {
  const root = document.getElementById('root')!;
  root.innerHTML = '';
  const board = new Board();
  board.render(root);
  switch (mode) {
    case 'HvH':
      break;
    case 'HvDAI':
      new DumbAIOpponent(PlayerID.playerO, board);
      break;
    case 'DAIvH':
      new DumbAIOpponent(PlayerID.playerX, board);
      break;
    default:
      console.log('error');
  }
};

// Adding submitHandler to game-mode form.
const gameModeForm = document.getElementById('game-mode');
gameModeForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const checkedButton: HTMLInputElement = document.querySelector(
    'input[name="game-mode"]:checked'
  )!;
  newGame(checkedButton.value);
});
