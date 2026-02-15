import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Header extends Component<{ count: number }> {
  protected _basketButton: HTMLButtonElement;
  protected _counter: HTMLElement;
  protected events?: IEvents;

  constructor(container: HTMLElement, events?: IEvents) {
    super(container);
    this.events = events;
    this._basketButton = container.querySelector('.header__basket') as HTMLButtonElement;
    this._counter = container.querySelector('.header__basket-counter') as HTMLElement;

    this._basketButton.addEventListener('click', () => {
      this.events?.emit('header:basket');
    });
  }

  render(data?: Partial<{ count: number }>): HTMLElement {
    if (data?.count !== undefined && this._counter) {
      this._counter.textContent = String(data.count);
    }
    return this.container;
  }
}
