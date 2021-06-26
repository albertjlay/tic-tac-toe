/**
 * A class that represents the board.
 * Manages the win condition and which player's turn it currently is.
 */

import Square from './Square';
import { SquareID, PlayerID } from './types';

export default class Board {
  /**
   * Array representing the nine squares.
   */
  readonly boardSquares: Square[];
  /**
   * Array representing the IDs of squares occupied by P1.
   * Elements are in original order determined by moves of P1 (earliest first).
   */
  xSquares: SquareID[];
  /**
   * Array representing the IDs of squares occupied by P2.
   * Elements are in original order determined by moves of P2 (earliest first).
   */
  oSquares: SquareID[];
  /**
   * Current player's turn. PX goes first.
   */
  currentTurn: PlayerID;
  /**
   * Array containing SquareIDs in ascending order.
   */
  private readonly _squareIDs: SquareID[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  /**
   * Current result of the game:
   *  * If a player has won, equals an array of the winning square IDs.
   *  * If draw, equals [-1]
   *  * If inconclusive, equals[]
   */
  private _curResult: Number[] = [];

  /**
   * Creates a new, empty board.
   */
  constructor() {
    this.boardSquares = this._squareIDs.map((el) => new Square(el));
    this.xSquares = [];
    this.oSquares = [];
    this.currentTurn = PlayerID.playerX;
  }

  /**
   * Determines whether a player has won or a draw has been achieved
   * @returns ID of winner, 'DRAW', or 'INCONCLUSIVE'
   */
  checkResult() {
    const winningPatternX = this.winningPattern(this.xSquares);
    const winningPatternO = this.winningPattern(this.oSquares);
    if (winningPatternX) {
      return winningPatternX;
    } else if (winningPatternO) {
      return winningPatternO;
    } else if (this.xSquares.length + this.oSquares.length === 9) {
      return [-1];
    }
    return [];
  }

  /**
   * Determines whether the array has a winning pattern.
   * If it does, return an array of the winning square IDs.
   * @param - Array of square IDs which have been filled by the player.
   * @returns Array of winning squares if it has a winning pattern. null otherwise.
   */
  private winningPattern(filledSquares: SquareID[]) {
    // check horizontal win
    const sortedArr = filledSquares.sort((a, b) => a - b);
    for (let i = 0; i < sortedArr.length - 2; i += 1) {
      const isConsecutive =
        sortedArr[i] + 1 === sortedArr[i + 1] && sortedArr[i + 1] + 1 === sortedArr[i + 2];
      const isCorrectColumn =
        sortedArr[i] % 3 === 0 && sortedArr[i + 1] % 3 === 1 && sortedArr[i + 2] % 3 === 2;
      if (isConsecutive && isCorrectColumn) {
        return sortedArr.slice(i, i + 3);
      }
    }

    // check vertical win
    for (let i = 0; i < 3; i += 1) {
      const verticalPattern = filledSquares.filter((el) => el % 3 === i);
      if (verticalPattern.length === 3) {
        return verticalPattern;
      }
    }

    // check diagonal win
    const lrDiagonalPattern = filledSquares.filter((el) => el === 0 || el === 4 || el === 8);
    if (lrDiagonalPattern.length === 3) {
      return lrDiagonalPattern;
    }
    const rlDiagonalPattern = filledSquares.filter((el) => el === 2 || el === 4 || el === 6);
    if (rlDiagonalPattern.length === 3) {
      return rlDiagonalPattern;
    }
    return null;
  }

  winHandler() {
    this.boardSquares.forEach((el) => {
      el.isActive = false;
      if (this._curResult.includes(el.id)) {
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
        square.isActive = false;
        if (this.currentTurn === PlayerID.playerX) {
          this.xSquares.push(square.id);
          square.state = PlayerID.playerX;
          this.currentTurn = PlayerID.playerO;
        } else {
          this.oSquares.push(square.id);
          square.state = PlayerID.playerO;
          this.currentTurn = PlayerID.playerX;
        }
        this._curResult = this.checkResult();
        if (this._curResult.length === 3) {
          this.winHandler();
        }
      });
    });
    parent.appendChild(boardDOM);
  }
}
