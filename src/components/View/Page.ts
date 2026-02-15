import { Component } from '../base/Component';
import { IProduct } from '../../types';

export class Page extends Component<IProduct[]> {
  protected _gallery: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this._gallery = container.querySelector('.gallery') as HTMLElement;
  }

  render(cards: HTMLElement[]): HTMLElement {
    if (this._gallery) {
      this._gallery.replaceChildren(...cards);
    }
    return this.container;
  }
}
