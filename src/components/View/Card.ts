import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { IEvents } from '../base/Events';
import { categoryMap } from '../../utils/constants';
import { CDN_URL } from '../../utils/constants';

export abstract class Card extends Component<IProduct> {
  protected _category?: HTMLElement;
  protected _title?: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _price?: HTMLElement;
  protected events?: IEvents;

  constructor(container: HTMLElement, events?: IEvents) {
    super(container);
    this.events = events;
  }

  setCategory(category: string): void {
    if (this._category) {
      const categoryClass = categoryMap[category as keyof typeof categoryMap] || '';
      this._category.textContent = category;
      this._category.className = 'card__category';
      if (categoryClass) {
        this._category.classList.add(categoryClass);
      }
    }
  }

  setImage(src: string, alt?: string): void {
    if (this._image) {
      super.setImage(this._image, `${CDN_URL}${src}`, alt);
    }
  }

  setTitle(title: string): void {
    if (this._title) {
      this._title.textContent = title;
    }
  }

  setPrice(price: number | null): void {
    if (this._price) {
      if (price === null) {
        this._price.textContent = 'Бесценно';
      } else {
        this._price.textContent = `${price} синапсов`;
      }
    }
  }
}
