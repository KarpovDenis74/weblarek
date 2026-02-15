import { Card } from './Card';
import { IProduct } from '../../types';
import { IEvents } from '../base/Events';
import { cloneTemplate } from '../../utils/utils';

export class CardPreview extends Card {
  protected _category: HTMLElement;
  protected _title: HTMLElement;
  protected _image: HTMLImageElement;
  protected _price: HTMLElement;
  protected _text: HTMLElement;
  protected _button: HTMLButtonElement;
  private _product?: IProduct;
  private _inBasket: boolean = false;

  constructor(container: HTMLElement, events?: IEvents) {
    const element = cloneTemplate<HTMLElement>('#card-preview');
    super(element, events);

    this._category = element.querySelector('.card__category') as HTMLElement;
    this._title = element.querySelector('.card__title') as HTMLElement;
    this._image = element.querySelector('.card__image') as HTMLImageElement;
    this._price = element.querySelector('.card__price') as HTMLElement;
    this._text = element.querySelector('.card__text') as HTMLElement;
    this._button = element.querySelector('.card__button') as HTMLButtonElement;

    this._button.addEventListener('click', () => {
      if (this._product) {
        if (this._inBasket) {
          this.events?.emit('card:remove', { product: this._product });
        } else {
          this.events?.emit('card:add', { product: this._product });
        }
      }
    });
  }

  render(data?: Partial<IProduct & { inBasket: boolean }>): HTMLElement {
    if (!data) return this.container;

    this._product = data as IProduct;
    this._inBasket = data.inBasket || false;

    if (data.category) this.setCategory(data.category);
    if (data.title) this.setTitle(data.title);
    if (data.image) this.setImage(data.image, data.title);
    if (data.price !== undefined) this.setPrice(data.price);
    if (data.description && this._text) {
      this._text.textContent = data.description;
    }

    // Управление кнопкой
    if (this._button) {
      if (data.price === null) {
        this._button.disabled = true;
        this._button.textContent = 'Недоступно';
      } else {
        this._button.disabled = false;
        if (this._inBasket) {
          this._button.textContent = 'Удалить из корзины';
        } else {
          this._button.textContent = 'В корзину';
        }
      }
    }

    return this.container;
  }
}
