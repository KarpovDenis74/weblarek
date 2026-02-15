import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { cloneTemplate } from '../../utils/utils';

export class Success extends Component<{ total: number }> {
  protected _title: HTMLElement;
  protected _description: HTMLElement;
  protected _button: HTMLButtonElement;
  protected events?: IEvents;

  constructor(container: HTMLElement, events?: IEvents) {
    const element = cloneTemplate<HTMLElement>('#success');
    super(element);
    this.events = events;

    this._title = element.querySelector('.order-success__title') as HTMLElement;
    this._description = element.querySelector('.order-success__description') as HTMLElement;
    this._button = element.querySelector('.order-success__close') as HTMLButtonElement;

    this._button.addEventListener('click', () => {
      this.events?.emit('success:close');
    });
  }

  render(data?: Partial<{ total: number }>): HTMLElement {
    if (data?.total !== undefined && this._description) {
      this._description.textContent = `Списано ${data.total} синапсов`;
    }
    return this.container;
  }
}
