import './style.scss';
import Board from './Board';
import DumbAIOpponent from './DumbAIOpponent';
import { PlayerID } from './types';

/**
 * Clears root div and instantiate a new board.
 */
const newGame = function () {
  console.log('run');
  const root = document.getElementById('root')!;
  root.innerHTML = '';
  const board = new Board();
  board.render(root);
  const cpuPlayer = new DumbAIOpponent(PlayerID.playerO, board);
};

// Add click handler to reset button.
const resetButton = document.querySelector('#reset');
resetButton?.addEventListener('click', newGame);

newGame();
