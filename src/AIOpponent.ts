/**
 * This module contains an abstract class that represents an AI opponent.
 */

import { PlayerID, SquareID } from './types';
import Board from './Board';

export default abstract class AIOpponent {
  protected _lastPlayerMove: SquareID | null;
  protected _myMoves: SquareID[];
  constructor(public readonly playerID: PlayerID, public readonly board: Board) {
    this._lastPlayerMove = null;

    if (playerID === PlayerID.playerX) {
      this._myMoves = board.xSquares;
    } else {
      this._myMoves = board.oSquares;
    }

    // function callback(this: AIOpponent) {
    //   if (this.board.currentTurn === this.playerID) {
    //     const movePosition = this.getMove();
    //     this.board.playerMove(movePosition, this.playerID);
    //   }
    // }
    // setInterval(callback.bind());

    // Add click handlers
    const squares = document.querySelectorAll('.square');
    squares.forEach((square) => {
      square.addEventListener('click', () => {
        this._lastPlayerMove = this.board.xSquares[this.board.xSquares.length - 1];
        if (!this.board.isGameOver && this.board.currentTurn === this.playerID) {
          const movePosition = this.getMove();
          this.board.playerMove(movePosition, this.playerID);
        }
      });
    });
  }

  // /**
  //  * Logs the AI's move into the board if it's its turn.
  //  */
  placeMove = () => {
    if (this.board.currentTurn === this.playerID) {
      const movePosition = this.getMove();
      this.board.playerMove(movePosition, this.playerID);
    }
  };

  /**
   * Chooses a square for the AI's move.
   * @returns square where the AI will make its move
   */
  abstract getMove(): SquareID;
}