import { Card } from './Card';
import { IProduct } from '../../types';
import { IEvents } from '../base/Events';
import { cloneTemplate } from '../../utils/utils';

export class CardBasket extends Card {
  protected _index: HTMLElement;
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;
  private _product?: IProduct;

  constructor(container: HTMLElement, events?: IEvents) {
    const element = cloneTemplate<HTMLLIElement>('#card-basket');
    super(element, events);

    this._index = element.querySelector('.basket__item-index') as HTMLElement;
    this._title = element.querySelector('.card__title') as HTMLElement;
    this._price = element.querySelector('.card__price') as HTMLElement;
    this._button = element.querySelector('.basket__item-delete') as HTMLButtonElement;

    this._button.addEventListener('click', () => {
      if (this._product) {
        this.events?.emit('card:remove', { product: this._product });
      }
    });
  }

  render(data?: Partial<IProduct & { index: number }>): HTMLElement {
    if (!data) return this.container;

    this._product = data as IProduct;

    if (data.index !== undefined && this._index) {
      this._index.textContent = String(data.index);
    }
    if (data.title) this.setTitle(data.title);
    if (data.price !== undefined) this.setPrice(data.price);

    return this.container;
  }
}
