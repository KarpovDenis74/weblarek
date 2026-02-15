import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class Success extends Component<{ total: number }> {
  protected _title: HTMLElement;
  protected _description: HTMLElement;
  protected _button: HTMLButtonElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this._title = ensureElement<HTMLElement>('.order-success__title', container);
    this._description = ensureElement<HTMLElement>('.order-success__description', container);
    this._button = ensureElement<HTMLButtonElement>('.order-success__close', container);

    this._button.addEventListener('click', () => {
      this.events.emit('success:close');
    });
  }

  render(data?: Partial<{ total: number }>): HTMLElement {
    if (data?.total !== undefined) {
      this._description.textContent = `Списано ${data.total} синапсов`;
    }
    return this.container;
  }
}
