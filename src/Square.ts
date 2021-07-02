/**
 * A class that represents one of the nine boxes of tic-tac-toe.
 */

import { PlayerID, SquareState, SquareID } from './types';

export default class Square {
  private _isActive = true;
  private _isWin = false;
  private _isLose = false;
  private _state: SquareState = undefined;
  private _DOMRender: HTMLDivElement | null = null;

  /**
   * Create a square with initial undefined state with the specified ID.
   * @param id The ID of the square.
   */
  constructor(public readonly id: SquareID) {}

  /**
   * Can only be modified if current state is undefined. Once changed, it stays constant.
   * Will also rerender div if it exists.
   */
  get state() {
    return this._state;
  }
  set state(player: SquareState) {
    if (!this.isActive) {
      throw new Error('Cannot place a move on an inactive square!');
    }
    if (this._state === undefined) {
      this._state = player;
      this.updateRender();
    }
  }

  /**
   * If false, will remove the 'active' class and the click handler from _DOMRender.
   */
  get isActive() {
    return this._isActive;
  }
  set isActive(state: boolean) {
    this._isActive = state;
    if (this.isActive === false) {
      this._DOMRender?.classList.remove('active');
      // Removes all event listeners.
      // Taken from https://stackoverflow.com/questions/9251837/how-to-remove-all-listeners-in-an-element
      this._DOMRender?.replaceWith(this._DOMRender.cloneNode(true));
    }
  }

  /**
   * If true, the 'win' class will be added to _DOMRender.
   */
  get isWin() {
    return this._isWin;
  }
  set isWin(state: boolean) {
    if (state && this.isLose) {
      throw new Error('Square cannot win and lose at the same time.');
    }
    this._isWin = state;

    if (this.isWin === true) {
      // hack to remove all event listeners. Refactor recommended
      document.getElementById(`square${this.id}`)?.classList.add('win');
    }
  }

  /**
   * If true, the 'lose' class will be added to _DOMRender.
   */
  get isLose() {
    return this._isLose;
  }
  set isLose(state: boolean) {
    if (state && this.isWin) {
      throw new Error('Square cannot win and lose at the same time.');
    }
    this._isLose = state;
    if (this.isLose === true) {
      // hack to remove all event listeners. Refactor recommended
      document.getElementById(`square${this.id}`)?.classList.add('lose');
    }
  }

  /**
   * Appends a div representing the square as a child of parent.
   * @param parent Parent element where Square will be appended to.
   * @param clickHandler Event handler for when square is clicked. Run ONCE.
   */
  render(parent: HTMLElement, clickHandler: () => void) {
    const domRepresentation = document.createElement('div');
    domRepresentation.id = `square${this.id.toString()}`;
    domRepresentation.classList.add('square');
    domRepresentation.classList.add('active');
    domRepresentation.classList.add(this.getClassState());
    domRepresentation.addEventListener('click', clickHandler, { once: true });
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
