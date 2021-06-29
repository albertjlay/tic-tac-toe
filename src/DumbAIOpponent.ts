/**
 * This module contains a "dumb" AI opponent that the player can go up against.
 * It chooses available squares randomly.
 */

import AIOpponent from './AIOpponent';

export default class DumbAIOpponent extends AIOpponent {
  getMove() {
    const randSquareIndex = Math.floor(Math.random() * this.board.freeSquares.length);
    return this.board.freeSquares[randSquareIndex];
  }
}
