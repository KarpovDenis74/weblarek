import { IProduct } from '../../types';
import { IEvents } from '../base/Events';
import { CardWithImage } from './CardWithImage';

export class CardCatalog extends CardWithImage {
  private _clickHandler?: () => void;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    container.addEventListener('click', () => {
      if (this._clickHandler) {
        this._clickHandler();
      }
    });
  }

  render(data?: Partial<IProduct>): HTMLElement {
    if (!data) return this.container;

    const product = data as IProduct;

    // Создаем колбэк с данными продукта
    this._clickHandler = () => {
      this.events.emit('card:select', { product });
    };

    if (data.category) this.setCategory(data.category);
    if (data.title) this.setTitle(data.title);
    if (data.image) this.setImage(data.image, data.title);
    if (data.price !== undefined) this.setPrice(data.price);

    return this.container;
  }
}
