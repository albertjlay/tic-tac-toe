/**
 * A class that represents the board.
 * Manages the win condition and which player's turn it currently is.
 */

import Square from './Square';
import { SquareID, PlayerID } from './types';

export default class Board {
  /**
   * Array containing SquareIDs in ascending order.
   */
  private readonly _squareIDs: SquareID[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  /**
   * Array representing the nine squares.
   */
  readonly boardSquares: Square[];

  // ---------------------------- GAME STATES -------------------------------- //

  private _xSquares: SquareID[] = [];
  /**
   * Array representing the IDs of squares occupied by PX.
   * Elements are in original order determined by moves of PX (earliest first).
   * Should only be modified through playerMove.
   */
  get xSquares() {
    return this._xSquares;
  }

  private _oSquares: SquareID[] = [];
  /**
   * Array representing the IDs of squares occupied by PO.
   * Elements are in original order determined by moves of PO (earliest first).
   * Should only be modified through playerMove.
   */
  get oSquares() {
    return this._oSquares;
  }

  private _freeSquares: SquareID[] = [...this._squareIDs];
  /**
   * Array representing the IDs of unoccupied squares.
   * Elements are in ascending order.
   * Should only be modified through playerMove.
   */
  get freeSquares() {
    return this._freeSquares;
  }

  private _currentTurn: PlayerID = PlayerID.playerX;
  /**
   * Current player's turn. PX goes first.
   * Should only be modified through playerMove.
   */
  get currentTurn() {
    return this._currentTurn;
  }

  private _curWinPattern: Number[][] = [];
  /**
   * Current winning pattern of the game.
   * If the game has not concluded or result in a draw, will be empty.
   * Can only be modified through playerMove.
   */
  get curWinPattern() {
    return this._curWinPattern;
  }

  private _isGameOver = false;
  /**
   * Whether the game has concluded or not.
   */
  get isGameOver() {
    return this._isGameOver;
  }
  set isGameOver(x: boolean) {
    if (x && this.curWinPattern.length === 0 && this.xSquares.length + this.oSquares.length !== 9) {
      throw new Error('Game must be won or board must be full for the game to be over!');
    }
    this._isGameOver = x;
  }

  private _isDraw = false;
  /**
   * Whether the game results in a draw or not.
   */
  get isDraw() {
    return this._isDraw;
  }
  set isDraw(x: boolean) {
    if (!x || (this.isGameOver && this.curWinPattern.length === 0)) {
      this._isDraw = x;
    } else {
      throw new Error('Game must conclude and no player must win for the game to draw!');
    }
  }
  // -------------------------------------------------------------------------------------- //

  /**
   * Creates a new, empty board.
   */
  constructor() {
    this.boardSquares = this._squareIDs.map((el) => new Square(el));
  }

  /**
   * Find all horizontal winning patterns of filledSquares.
   * @param - Array of square IDs which have been filled by the player.
   * @returns Array of array of horizontal-winning squares (in arbitrary order).
   */
  findHorizontalWins(filledSquares: SquareID[]) {
    const retval: SquareID[][] = [];
    const sortedArr = filledSquares.sort((a, b) => a - b);
    for (let i = 0; i < sortedArr.length - 2; i += 1) {
      const isConsecutive =
        sortedArr[i] + 1 === sortedArr[i + 1] && sortedArr[i + 1] + 1 === sortedArr[i + 2];
      const isCorrectColumn =
        sortedArr[i] % 3 === 0 && sortedArr[i + 1] % 3 === 1 && sortedArr[i + 2] % 3 === 2;
      if (isConsecutive && isCorrectColumn) {
        retval.push(sortedArr.slice(i, i + 3));
      }
    }
    return retval;
  }

  /**
   * Find all vertical winning patterns of filledSquares.
   * @param - Array of square IDs which have been filled by the player.
   * @returns Array of array of vertical-winning squares (in arbitrary order).
   */
  findVerticalWins(filledSquares: SquareID[]) {
    const retval: SquareID[][] = [];
    for (let i = 0; i < 3; i += 1) {
      const verticalPattern = filledSquares.filter((el) => el % 3 === i);
      if (verticalPattern.length === 3) {
        retval.push(verticalPattern);
      }
    }
    return retval;
  }

  /**
   * Find all diagonal winning patterns of filledSquares.
   * @param - Array of square IDs which have been filled by the player.
   * @returns Array of array of diagonal-winning squares (in arbitrary order).
   */
  findDiagonalWins(filledSquares: SquareID[]) {
    const retval: SquareID[][] = [];
    const lrDiagonalPattern = filledSquares.filter((el) => el === 0 || el === 4 || el === 8);
    if (lrDiagonalPattern.length === 3) {
      retval.push(lrDiagonalPattern);
    }
    const rlDiagonalPattern = filledSquares.filter((el) => el === 2 || el === 4 || el === 6);
    if (rlDiagonalPattern.length === 3) {
      retval.push(rlDiagonalPattern);
    }
    return retval;
  }

  /**
   * Find all winning patterns of filledSquares.
   * @param - Array of square IDs which have been filled by the player.
   * @returns Array of array of winning squares (in arbitrary order).
   */
  findWins(filledSquares: SquareID[]) {
    return [
      ...this.findHorizontalWins(filledSquares),
      ...this.findVerticalWins(filledSquares),
      ...this.findDiagonalWins(filledSquares),
    ];
  }

  /**
   * Should be called when a player moves. Will update all game states.
   * @param move Which square the player is making their move.
   * @param player Which player is moving.
   */
  playerMove(move: SquareID, player: PlayerID) {
    if (!this.freeSquares.includes(move)) {
      console.log(move);
      throw new Error('Player cannot occupy a previously occupied square!');
    } else if (player !== this.currentTurn) {
      throw new Error('Player can only move when it is their turn!');
    }

    // Logs move to corresponding player array.
    if (player === PlayerID.playerX) {
      this.xSquares.push(move);
    } else {
      this.oSquares.push(move);
    }

    this._freeSquares = this.freeSquares.filter((el) => el !== move);

    // Check whether game has concluded
    this._curWinPattern = [...this.findWins(this.xSquares), ...this.findWins(this.oSquares)];
    if (this.curWinPattern.length !== 0) {
      this.isGameOver = true;
    } else if (this.freeSquares.length === 0) {
      this.isGameOver = true;
      this.isDraw = true;
    }

    // Update DOM
    this.boardSquares[move].state = player;
    this.boardSquares[move].isActive = false;

    // Change next turn player
    if (this.currentTurn === PlayerID.playerX) {
      this._currentTurn = PlayerID.playerO;
    } else {
      this._currentTurn = PlayerID.playerX;
    }

    if (this.isGameOver) {
      this.gameOverHandler();
    }
  }

  /**
   * Should be called when game is over.
   * Deactivates all squares and set isWin to true to all winning squares.
   */
  private gameOverHandler() {
    this.boardSquares.forEach((el) => {
      el.isActive = false;

      // Create a list of all winning squares (unique).
      const destructuredWinPattern = new Set();
      for (let i = 0; i < this.curWinPattern.length; i += 1) {
        destructuredWinPattern.add(this.curWinPattern[i][0]);
        destructuredWinPattern.add(this.curWinPattern[i][1]);
        destructuredWinPattern.add(this.curWinPattern[i][2]);
      }

      if (destructuredWinPattern.has(el.id)) {
        el.isWin = true;
      }
    });
  }

  /**
   * Render the board with nine empty squares as children to parent.
   * @param parent The HTML element where the squares will be appended to.
   */
  render(parent: HTMLElement) {
    const boardDOM = document.createElement('div');
    boardDOM.classList.add('board');
    this.boardSquares.forEach((square) => {
      square.render(boardDOM, () => {
        this.playerMove(square.id, this.currentTurn);
      });
    });

    parent.appendChild(boardDOM);
  }
}
