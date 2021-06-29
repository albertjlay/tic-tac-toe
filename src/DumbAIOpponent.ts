/**
 * This module contains a "dumb" AI opponent that the player can go up against.
 * It chooses available squares randomly.
 */

import AIOpponent from './AIOpponent';

export default class DumbAIOpponent extends AIOpponent {
  getMove() {
    return this.board.freeSquares[0];
    // return this.board.freeSquares[Math.floor(Math.random() * this.board.freeSquares.length)];
  }
}
