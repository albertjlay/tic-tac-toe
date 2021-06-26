import './style.scss';
import Board from './Board';

const root = document.querySelector('main')!;
const board = new Board();
board.render(root);
