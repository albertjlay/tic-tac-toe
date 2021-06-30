/**
 * This module contains an abstract class that represents an AI opponent.
 */

import { PlayerID, SquareID } from './types';
import Board from './Board';

export default abstract class AIOpponent {
  protected _myMoves: SquareID[];
  constructor(public readonly playerID: PlayerID, public readonly board: Board) {
    if (playerID === PlayerID.playerX) {
      this._myMoves = board.xSquares;
    } else {
      this._myMoves = board.oSquares;
    }

    // Add click handlers
    const squares = document.querySelectorAll('.square');
    squares.forEach((square) => {
      square.addEventListener('click', this.AIMove);
    });

    // In case AI moves first.
    this.AIMove();
  }

  /**
   * Logs the AI's move into the board if it's its turn.
   */
  AIMove = () => {
    if (!this.board.isGameOver && this.board.currentTurn === this.playerID) {
      this.board.playerMove(this.getMove(), this.playerID);
    }
  };

  /**
   * Chooses a square for the AI's move.
   * @returns square where the AI will make its move
   */
  abstract getMove(): SquareID;
}
