import { Card } from './Card';
import { IEvents } from '../base/Events';
import { categoryMap, CDN_URL } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export abstract class CardWithImage extends Card {
  protected _category: HTMLElement;
  protected _image: HTMLImageElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);
    this._category = ensureElement<HTMLElement>('.card__category', container);
    this._image = ensureElement<HTMLImageElement>('.card__image', container);
  }

  setCategory(category: string): void {
    const categoryClass = categoryMap[category as keyof typeof categoryMap] || '';
    this._category.textContent = category;
    this._category.className = 'card__category';
    if (categoryClass) {
      this._category.classList.add(categoryClass);
    }
  }

  setImage(src: string, alt?: string): void {
    super.setImage(this._image, `${CDN_URL}${src}`, alt);
  }
}
