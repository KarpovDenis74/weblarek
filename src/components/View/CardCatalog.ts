import { Card } from './Card';
import { IProduct } from '../../types';
import { IEvents } from '../base/Events';
import { cloneTemplate } from '../../utils/utils';

export class CardCatalog extends Card {
  protected _category: HTMLElement;
  protected _title: HTMLElement;
  protected _image: HTMLImageElement;
  protected _price: HTMLElement;
  private _product?: IProduct;

  constructor(container: HTMLElement, events?: IEvents) {
    const element = cloneTemplate<HTMLButtonElement>('#card-catalog');
    super(element, events);

    this._category = element.querySelector('.card__category') as HTMLElement;
    this._title = element.querySelector('.card__title') as HTMLElement;
    this._image = element.querySelector('.card__image') as HTMLImageElement;
    this._price = element.querySelector('.card__price') as HTMLElement;

    element.addEventListener('click', () => {
      if (this._product) {
        this.events?.emit('card:select', { product: this._product });
      }
    });
  }

  render(data?: Partial<IProduct>): HTMLElement {
    if (!data) return this.container;

    this._product = data as IProduct;

    if (data.category) this.setCategory(data.category);
    if (data.title) this.setTitle(data.title);
    if (data.image) this.setImage(data.image, data.title);
    if (data.price !== undefined) this.setPrice(data.price);

    return this.container;
  }
}
