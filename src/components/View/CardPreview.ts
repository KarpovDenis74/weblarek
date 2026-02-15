import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { CardWithImage } from './CardWithImage';

export class CardPreview extends CardWithImage {
  protected _text: HTMLElement;
  protected _button: HTMLButtonElement;
  private _buttonClickHandler?: () => void;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this._text = ensureElement<HTMLElement>('.card__text', container);
    this._button = ensureElement<HTMLButtonElement>('.card__button', container);

    this._button.addEventListener('click', () => {
      if (this._buttonClickHandler) {
        this._buttonClickHandler();
      }
    });
  }

  render(data?: Partial<IProduct & { inBasket: boolean }>): HTMLElement {
    if (!data) return this.container;

    const product = data as IProduct;
    const inBasket = data.inBasket || false;

    // Создаем колбэк с данными продукта
    this._buttonClickHandler = () => {
      if (inBasket) {
        this.events.emit('card:remove', { product });
      } else {
        this.events.emit('card:add', { product });
      }
    };

    if (data.category) this.setCategory(data.category);
    if (data.title) this.setTitle(data.title);
    if (data.image) this.setImage(data.image, data.title);
    if (data.price !== undefined) this.setPrice(data.price);
    if (data.description) {
      this._text.textContent = data.description;
    }

    // Управление кнопкой
    if (data.price === null) {
      this._button.disabled = true;
      this._button.textContent = 'Недоступно';
    } else {
      this._button.disabled = false;
      if (inBasket) {
        this._button.textContent = 'Удалить из корзины';
      } else {
        this._button.textContent = 'В корзину';
      }
    }

    return this.container;
  }
}
