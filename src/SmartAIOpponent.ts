/**
 * This module contains a smart AI opponent which guarantees a draw in the worst scenario.
 */

import AIOpponent from './AIOpponent';
import Board from './Board';
import { PlayerID, PositionType, SquareID } from './types';

export default class SmartAIOpponent extends AIOpponent {
  /**
   * Chooses a square for the AI's move.
   * How the algorithm works:
   *  1. Move to a square which will make it win.
   *  2. If not above, move to a square which will block player's win
   *  3. Else, uses the algorithm outlined in https://www.quora.com/Is-there-a-way-to-never-lose-at-Tic-Tac-Toe
   * @returns square where the AI will make its move
   */
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
    return this.getMoveSecond();

    // return this.board.freeSquares[0];
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
   * Chooses an optimal square for the AI's move when it moves first.
   * @returns ID of square to guarantee at least a draw
   */
  private getMoveFirst(): SquareID {
    if (this.playerID === PlayerID.playerO) {
      throw new Error('Only use this method if AI moves first.');
    }

    // for first move
    if (this.board.curTurnNumber === 1) {
      return 0;
    }

    // Split cases based on player's second move.
    if (Board.getPositionTypeById(this.board.oSquares[0]) === PositionType.CENTER) {
      return this.getMoveFirstCenter();
    }
    return this.getMoveFirstNonCenter();
  }

  /**
   * Chooses an optimal square for the AI's move when it moves first and
   * the player's second move is in the center.
   * @returns ID of square to guarantee at least a draw
   */
  private getMoveFirstCenter(): SquareID {
    if (this.playerID === PlayerID.playerO) {
      throw new Error('Only use this method if AI moves first.');
    } else if (this.board.freeSquares.length === 7 && this.board.prevMove !== 4) {
      throw new Error("Only use this method if the player's second move is center");
    }

    if (this.board.curTurnNumber === 3) {
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
  private getMoveFirstNonCenter() {
    if (this.playerID === PlayerID.playerO) {
      throw new Error('Only use this method if AI moves first.');
    } else if (this.board.curTurnNumber >= 2 && Board.getPositionTypeById(this.board.oSquares[0])) {
      throw new Error("Only use this method if the player's second move is non-center");
    }

    const corners: SquareID[] = [0, 2, 6, 8];
    const availableCorners = corners.filter((id) => {
      return this.board.freeSquares.includes(id);
    });

    return availableCorners[0];
  }

  /**
   * Chooses an optimal square fot the AI's move when it moves second.
   * @returns ID of square to guarantee at least a draw
   */
  private getMoveSecond() {
    if (this.playerID === PlayerID.playerX) {
      throw new Error('Only use this method if AI moves second.');
    }

    const firstMoveType = Board.getPositionTypeById(this.board.xSquares[0]);
    console.log(firstMoveType);
    switch (firstMoveType) {
      case PositionType.CENTER:
        return this.getMoveSecondCenter();
      case PositionType.CORNER:
        return this.getMoveSecondCorner();
      case PositionType.EDGE:
        return this.getMoveSecondEdge();
      default:
        throw new Error(
          'Position type can only be one of: center, corner, or edge. Please check Board.getPositionTypeById'
        );
    }
  }

  /**
   * Chooses an optimal square for the AI's move when it moves second and
   * the player's second move is in the center.
   * @returns ID of square to guarantee at least a draw
   */
  private getMoveSecondCenter() {
    if (this.playerID === PlayerID.playerX) {
      throw new Error('Only use this method if AI moves second.');
    } else if (Board.getPositionTypeById(this.board.xSquares[0]) !== PositionType.CENTER) {
      throw new Error("Only use this method if the player's first move is center");
    }

    if (this.board.curTurnNumber === 2) {
      return 0;
    } else if (this.board.curTurnNumber === 4) {
      const corners: SquareID[] = [0, 2, 6, 8];
      const availableCorners = corners.filter((id) => {
        return this.board.freeSquares.includes(id);
      });
      return availableCorners[0];
    } else {
      throw new Error('Error! Please check getMoveSecondCenter');
    }
  }

  /**
   * Chooses an optimal square for the AI's move when it moves second and
   * the player's second move is in the corner.
   * @returns ID of square to guarantee at least a draw
   */
  private getMoveSecondCorner() {
    if (this.playerID === PlayerID.playerX) {
      throw new Error('Only use this method if AI moves second.');
    } else if (Board.getPositionTypeById(this.board.xSquares[0]) !== PositionType.CORNER) {
      throw new Error("Only use this method if the player's first move is a corner");
    }

    const edges: SquareID[] = [1, 3, 5, 7];
    const availableCorners = edges.filter((id) => {
      return this.board.freeSquares.includes(id);
    });
    if (this.board.curTurnNumber === 2) {
      return 4;
    } else if (availableCorners.length !== 0) {
      return availableCorners[0];
    } else {
      return this.board.freeSquares[0];
    }
  }

  /**
   * Chooses an optimal square for the AI's move when it moves second and
   * the player's second move is in the edge.
   * @returns ID of square to guarantee at least a draw
   */
  private getMoveSecondEdge() {
    if (this.playerID === PlayerID.playerX) {
      throw new Error('Only use this method if AI moves second.');
    } else if (Board.getPositionTypeById(this.board.xSquares[0]) !== PositionType.EDGE) {
      throw new Error("Only use this method if the player's first move is an edge");
    }

    if (this.board.curTurnNumber === 2) {
      return 4;
    } else {
      return this.board.freeSquares[0];
    }
  }
}
