/**
 * A class that represents one of the nine boxes of tic-tac-toe.
 */

import { PlayerID, SquareState, SquareID } from './types';

export default class Square {
  private _state: SquareState;
  private _DOMRender: HTMLDivElement | null;

  /**
   * Create a square with initial undefined state with the specified ID.
   * @param id The ID of the square.
   */
  constructor(public readonly id: SquareID) {
    this._state = undefined;
    this._DOMRender = null;
  }

  /**
   * Can only be modified if current state is undefined. Once changed, it stays constant.
   * Will also rerender div if it exists.
   */
  get state() {
    return this._state;
  }
  set state(player: SquareState) {
    if (this._state === undefined) {
      this._state = player;
      this.updateRender();
    }
  }

  /**
   * Appends a div representing the square as a child of parent.
   * @param parent Parent element where Square will be appended to.
   */
  render(parent: HTMLElement) {
    const domRepresentation = document.createElement('div');
    domRepresentation.id = `square${this.id.toString()}`;
    domRepresentation.classList.add('square');
    domRepresentation.classList.add(this.getClassState());
    this._DOMRender = domRepresentation;
    parent.appendChild(domRepresentation);
  }

  /**
   * Determine class based on the current state.
   * @returns Class based on the current state
   */
  private getClassState() {
    switch (this.state) {
      case PlayerID.playerX:
        return 'playerX';
      case PlayerID.playerO:
        return 'playerO';
      default:
        return 'none';
    }
  }

  /**
   * Add new class based on current state and delete the 'none' class.
   */
  private updateRender() {
    this._DOMRender?.classList.add(this.getClassState());
    this._DOMRender?.classList.remove('none');
  }
}
