/**
 * A class that represents one of the nine boxes of tic-tac-toe.
 */

import { PositionType, PlayerID, SquareState, SquareID } from './types';

export default class Square {
  public readonly positionType: PositionType;
  private _isActive: boolean;
  private _isWin: boolean;
  private _state: SquareState;
  private _DOMRender: HTMLDivElement | null;
  private _clickHandler: () => void;

  /**
   * Create a square with initial undefined state with the specified ID.
   * @param id The ID of the square.
   */
  constructor(public readonly id: SquareID) {
    this.positionType = this.getPositionTypeById();
    this._state = undefined;
    this._DOMRender = null;
    this._isActive = true;
    this._isWin = false;
    this._clickHandler = () => {};
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
   * If false, click handler will not run.
   */
  get isActive() {
    return this._isActive;
  }
  set isActive(state: boolean) {
    this._isActive = state;
    if (this.isActive === false) {
      this._DOMRender?.classList.remove('active');
      this._DOMRender?.removeEventListener('click', this._clickHandler);
    }
  }

  /**
   * If true, the 'win' class will be added to _DOMRender.
   */
  get isWin() {
    return this._isWin;
  }
  set isWin(state: boolean) {
    this._isWin = state;
    if (this.isWin === true) {
      this._DOMRender?.classList.add('win');
    }
  }

  /**
   * Appends a div representing the square as a child of parent.
   * @param parent Parent element where Square will be appended to.
   * @param clickHandler Event handler for when square is clicked.
   */
  render(parent: HTMLElement, clickHandler: () => void) {
    const domRepresentation = document.createElement('div');
    domRepresentation.id = `square${this.id.toString()}`;
    domRepresentation.classList.add('square');
    domRepresentation.classList.add('active');
    domRepresentation.classList.add(this.getClassState());
    domRepresentation.addEventListener('click', clickHandler);
    this._DOMRender = domRepresentation;
    this._clickHandler = clickHandler;
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

  /**
   * Determine the position type of the instance of the square based on its ID.
   * @returns The position type of the square.
   */
  private getPositionTypeById() {
    switch (this.id) {
      case 0:
      case 2:
      case 6:
      case 8:
        return PositionType.CORNER;
      case 4:
        return PositionType.CENTER;
      default:
        return PositionType.EDGE;
    }
  }
}
