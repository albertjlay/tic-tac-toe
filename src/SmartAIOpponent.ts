/**
 * This module contains a smart AI opponent which guarantees a draw in the worst scenario.
 */

import AIOpponent from './AIOpponent';
import { PlayerID, SquareID } from './types';

export default class SmartAIOpponent extends AIOpponent {
  getMove() {
    // Take the win.
    const completeAIPattern = this.completePattern(this._myMoves);
    if (completeAIPattern) {
      return completeAIPattern;
    }

    // Blocks player from winning.
    const blockNextTurnPlayerWin = this.completePattern(this._opponentMoves);
    if (blockNextTurnPlayerWin) {
      return blockNextTurnPlayerWin;
    }

    if (this.playerID === PlayerID.playerX) {
      return this.getMoveFirst();
    }

    return this.board.freeSquares[0];
  }

  /**
   * Returns a free square ID which, when occupied, would create a winning pattern in occupiedSquares.
   * If there are multiple, returns the smallest ID.
   * @param occupiedSquares Squares currently occupied (must not have a winning pattern)
   * @returns SquareID which would create a winning pattern in the next turn or undefined if none exists.
   */
  completePattern(occupiedSquares: SquareID[]) {
    if (this.board.findWins(occupiedSquares).length !== 0) {
      throw new Error('Occupied squares must not have a winning pattern already!');
    }

    for (let i = 0; i < this.board.freeSquares.length; i += 1) {
      const curSquare = this.board.freeSquares[i];
      const possiblePlayerMove = [...occupiedSquares, curSquare];
      if (this.board.findWins(possiblePlayerMove).length !== 0) {
        return curSquare;
      }
    }
  }

  /**
   * Chooses an optimal square fot the AI's move when it moves first.
   * @returns ID of square to guarantee at least a draw
   */
  getMoveFirst(): SquareID {
    if (this.playerID === PlayerID.playerO) {
      throw new Error('Only use this method if AI moves first.');
    }

    // for first move
    if (this.board.prevMove === null) {
      return 0;
    }

    // Split cases based on player's second move.
    if (this.board.oSquares[0] === 4) {
      return this.getMoveFirstCenter();
    }
    return this.getMoveFirstNonCenter();
  }

  /**
   * Chooses an optimal square fot the AI's move when it moves first and
   * the player's second move is in the center.
   * @returns ID of square to guarantee at least a draw
   */
  getMoveFirstCenter(): SquareID {
    if (this.playerID === PlayerID.playerO) {
      throw new Error('Only use this method if AI moves first.');
    } else if (this.board.freeSquares.length === 7 && this.board.prevMove !== 4) {
      throw new Error("Only use this method if the player's second move is center");
    }

    // Third turn
    if (this.board.freeSquares.length === 7) {
      return 8;
    }

    // Will never reach here. completePatter will handle the rest.
    throw new Error('Error! Please check getMoveFirstCenter');
  }

  /**
   * Chooses an optimal square fot the AI's move when it moves first and
   * the player's second move is not in the center.
   * @returns ID of square to guarantee at least a draw
   */
  getMoveFirstNonCenter() {
    if (this.playerID === PlayerID.playerO) {
      throw new Error('Only use this method if AI moves first.');
    } else if (this.board.freeSquares.length === 7 && this.board.prevMove === 4) {
      throw new Error("Only use this method if the player's second move is non-center");
    }

    // For third turn
    if (this.board.freeSquares.length === 7) {
      switch (this.board.prevMove) {
        case 1:
        case 2:
          return 6;
        default:
          return 2;
      }
    } else if (this.board.freeSquares.length === 5) {
      // Will only reach here if player blocks the pattern.
      // If not, completePattern will take care of it.
      switch (this.board.xSquares[1]) {
        case 6:
          return 8;
        case 2:
          return 6;
        default:
          throw new Error('Error! Please check getMoveFirstNonCenter');
      }
    } else {
      // Will never reach here if algorithm works correctly as completePattern will take care of the rest.
      throw new Error('Error! Please check getMoveFirstNonCenter');
    }
  }
}
