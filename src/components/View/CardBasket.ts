import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { Card } from './Card';

export class CardBasket extends Card {
  protected _index: HTMLElement;
  protected _button: HTMLButtonElement;
  private _buttonClickHandler?: () => void;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this._index = ensureElement<HTMLElement>('.basket__item-index', container);
    this._button = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

    this._button.addEventListener('click', () => {
      if (this._buttonClickHandler) {
        this._buttonClickHandler();
      }
    });
  }

  render(data?: Partial<IProduct & { index: number }>): HTMLElement {
    if (!data) return this.container;

    const product = data as IProduct;

    // Создаем колбэк с данными продукта
    this._buttonClickHandler = () => {
      this.events.emit('card:remove', { product });
    };

    if (data.index !== undefined) {
      this._index.textContent = String(data.index);
    }
    if (data.title) this.setTitle(data.title);
    if (data.price !== undefined) this.setPrice(data.price);

    return this.container;
  }
}
