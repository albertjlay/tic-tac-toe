import './style.scss';
import Board from './Board';
import DumbAIOpponent from './DumbAIOpponent';
import { PlayerID } from './types';
import SmartAIOpponent from './SmartAIOpponent';

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
    case 'HvSAI':
      new SmartAIOpponent(PlayerID.playerO, board);
      break;
    case 'SAIvH':
      new SmartAIOpponent(PlayerID.playerX, board);
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
