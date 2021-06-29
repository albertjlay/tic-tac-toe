/**
 * This module contains an abstract class that represents an AI opponent.
 */

import { PlayerID, SquareID } from './types';
import Board from './Board';

export default abstract class AIOpponent {
  protected myMoves: SquareID[];
  constructor(public readonly playerID: PlayerID, public readonly board: Board) {
    if (playerID === PlayerID.playerX) {
      this.myMoves = board.xSquares;
    } else {
      this.myMoves = board.oSquares;
    }

    setInterval(() => {
      if (this.board.currentTurn === this.playerID) {
        this.board.playerMove(this.getMove(), this.playerID);
      }
    }, 150);
  }

  // /**
  //  * Logs the AI's move into the board if it's its turn.
  //  */
  // placeMove() {

  // }

  /**
   * Chooses a square for the AI's move.
   * @returns square where the AI will make its move
   */
  abstract getMove(): SquareID;
}
