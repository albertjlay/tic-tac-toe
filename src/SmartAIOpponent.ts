/**
 * This module contains a smart AI opponent which guarantees a draw in the worst scenario.
 * Algorithm taken from https://en.wikipedia.org/wiki/Tic-tac-toe
 */

import AIOpponent from './AIOpponent';
import Board from './Board';
import { PlayerID, PositionType, SquareID } from './types';

export default class SmartAIOpponent extends AIOpponent {
  /**
   * Chooses a square for the AI's move.
   * See https://en.wikipedia.org/wiki/Tic-tac-toe to learn how it works.
   * @returns square where the AI will make its move
   */
  getMove() {
    // Take the win.
    const completeAIPattern = this.findCompletingPatterns(this._myMoves);
    if (completeAIPattern.length !== 0) {
      return completeAIPattern[0];
    }

    // Blocks player from winning.
    const blockNextTurnPlayerWin = this.findCompletingPatterns(this._opponentMoves);
    if (blockNextTurnPlayerWin.length !== 0) {
      return blockNextTurnPlayerWin[0];
    }

    // For AI's foruth move if it goes second and player opens with corner.
    // If AI goes second and player opens with corner, try to take edges
    if (
      this.board.curTurnNumber === 4 &&
      this.playerID === PlayerID.playerO &&
      this.board.getFreeSquaresByType(PositionType.EDGE).length !== 0 &&
      Board.getPositionTypeById(this.board.xSquares[0]) === PositionType.CORNER &&
      Board.getPositionTypeById(this.board.xSquares[1]) === PositionType.CORNER
    ) {
      return this.board.getFreeSquaresByType(PositionType.EDGE)[0];
    }

    // Takes fork if available
    const forkingAISquare = this.findFork(this._myMoves);
    if (forkingAISquare !== undefined) {
      return forkingAISquare;
    }

    // Blocks opponent's possible square
    const forkingPlayerSquare = this.findFork(this._opponentMoves);
    if (forkingPlayerSquare !== undefined) {
      return forkingPlayerSquare;
    }

    // Takes center
    if (this.board.getFreeSquaresByType(PositionType.CENTER).length !== 0) {
      return this.board.getFreeSquaresByType(PositionType.CENTER)[0];
    }

    // Takes opposite corner
    const oppositeCorners: [SquareID, SquareID][] = [
      [0, 8],
      [2, 6],
      [6, 2],
      [8, 0],
    ];
    for (let i = 0; i < oppositeCorners.length; i += 1) {
      if (
        this.board.freeSquares.includes(oppositeCorners[i][0]) &&
        this._opponentMoves.includes(oppositeCorners[i][1])
      ) {
        return oppositeCorners[i][0];
      }
    }

    // Takes corner
    if (this.board.getFreeSquaresByType(PositionType.CORNER).length !== 0) {
      return this.board.getFreeSquaresByType(PositionType.CORNER)[0];
    }

    return this.board.freeSquares[0];

    // if (this.playerID === PlayerID.playerX) {
    //   return this.getMoveFirst();
    // }
    // return this.getMoveSecond();
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
   * Returns all free square IDs which, when occupied, would create a winning pattern in occupiedSquares.
   * @param occupiedSquares Squares currently occupied (must not have a winning pattern)
   * @returns Array of SquareIDs which would create a winning pattern in the next turn
   */
  findCompletingPatterns(occupiedSquares: SquareID[]): SquareID[] {
    if (this.board.findWins(occupiedSquares).length !== 0) {
      throw new Error('Occupied squares must not have a winning pattern already!');
    }

    const retval: SquareID[] = [];
    for (let i = 0; i < this.board.freeSquares.length; i += 1) {
      const curSquare = this.board.freeSquares[i];
      const possiblePlayerMove = [...occupiedSquares, curSquare];
      if (this.board.findWins(possiblePlayerMove).length !== 0) {
        retval.push(curSquare);
      }
    }

    return retval;
  }

  /**
   * Finds a fork position (one which creates two possible winning paths in the next turn).
   * If there are multiple, returns the one with the smallest ID.
   * @param occupiedSquares Squares currently occupied (must not have a winning pattern)
   * @returns SquareID which would create a fork or undefined if none exists
   */
  findFork(occupiedSquares: SquareID[]) {
    if (this.board.findWins(occupiedSquares).length !== 0) {
      throw new Error('Occupied squares must not have a winning pattern already!');
    }

    // Inserts possible fork position
    for (let i = 0; i < this.board.freeSquares.length; i += 1) {
      const possibleFork = this.board.freeSquares[i];
      const possibleForkFormation = [...occupiedSquares, possibleFork];
      if (this.findCompletingPatterns(possibleForkFormation).length >= 2) {
        return possibleFork;
      }
    }
  }
}
