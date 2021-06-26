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
  private readonly squareIDs: SquareID[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  /**
   * Creates a new, empty board.
   */
  constructor() {
    this.boardSquares = this.squareIDs.map((el) => new Square(el));
    this.xSquares = [];
    this.oSquares = [];
    this.currentTurn = PlayerID.playerX;
  }

  /**
   * Render the board with nine empty squares as children to parent.
   * @param parent The HTML element where the squares will be appended to.
   */
  render(parent: HTMLElement) {
    this.boardSquares.forEach((square) => {
      square.render(parent, () => {
        if (this.currentTurn === PlayerID.playerX) {
          this.xSquares.push(square.id);
          square.state = PlayerID.playerX;
          this.currentTurn = PlayerID.playerO;
        } else {
          this.oSquares.push(square.id);
          square.state = PlayerID.playerO;
          this.currentTurn = PlayerID.playerX;
        }
        if (this.checkResult() === PlayerID.playerX || this.checkResult() === PlayerID.playerO) {
          console.log(this.checkResult());
        }
      });
    });
  }

  /**
   * Determines whether a player has won or a draw has been achieved
   * @returns ID of winner, 'DRAW', or 'INCONCLUSIVE'
   */
  checkResult() {
    if (this.isWin(this.xSquares)) {
      return PlayerID.playerX;
    } else if (this.isWin(this.oSquares)) {
      return PlayerID.playerO;
    } else if (this.xSquares.length + this.oSquares.length === 9) {
      return 'DRAW';
    }
    return 'INCONCLUSIVE';
  }

  /**
   * Determines whether the array has a winning pattern.
   * @param - Array of square IDs which have been filled by the player.
   * @returns true if the array has a winning pattern. false otherwise
   */
  private isWin(filledSquares: SquareID[]) {
    // check horizontal win
    const sortedArr = filledSquares.sort((a, b) => a - b);
    console.log(sortedArr);
    for (let i = 0; i < sortedArr.length - 2; i += 1) {
      if (sortedArr[i] + 1 === sortedArr[i + 1] && sortedArr[i + 1] + 1 === sortedArr[i + 2]) {
        return true;
      }
    }

    // check vertical win
    for (let i = 0; i < 3; i += 1) {
      if (filledSquares.filter((el) => el % 3 === i).length === 3) {
        return true;
      }
    }

    // check diagonal win
    if (
      filledSquares.filter((el) => el === 0 || el === 4 || el === 8).length === 3 ||
      filledSquares.filter((el) => el === 2 || el === 4 || el === 6).length === 3
    ) {
      return true;
    }
  }
}
