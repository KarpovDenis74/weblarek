import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export abstract class Card extends Component<IProduct> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this._title = ensureElement<HTMLElement>('.card__title', container);
    this._price = ensureElement<HTMLElement>('.card__price', container);
  }

  setTitle(title: string): void {
    this._title.textContent = title;
  }

  setPrice(price: number | null): void {
    if (price === null) {
      this._price.textContent = 'Бесценно';
    } else {
      this._price.textContent = `${price} синапсов`;
    }
  }
}
