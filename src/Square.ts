/**
 * A class that represents one of the nine boxes of tic-tac-toe.
 */

import { PlayerID, SquareState, SquareID } from './types';

export default class Square {
  private _state: SquareState;

  /**
   * Create a square with initial undefined state with the specified ID.
   * @param id The ID of the square.
   */
  constructor(public readonly id: SquareID) {
    this._state = undefined;
  }

  /**
   * Can only be modified if current state is undefined. Once changed, it stays constant.
   */
  get state() {
    return this._state;
  }
  set state(player: SquareState) {
    if (this._state === undefined) {
      this._state = player;
    }
  }

  /**
   * Returns a div representing the square with most updated state.
   */
  render() {
    const domRepresentation = document.createElement('div');
    domRepresentation.id = `square${this.id.toString()}`;
    domRepresentation.classList.add('square');
    switch (this.state) {
      case PlayerID.P1:
        domRepresentation.classList.add('P1');
        break;
      case PlayerID.P2:
        domRepresentation.classList.add('P2');
        break;
      default:
    }
    return domRepresentation;
  }
}
