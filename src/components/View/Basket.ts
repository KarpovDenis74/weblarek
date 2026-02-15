import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { IEvents } from '../base/Events';
import { cloneTemplate } from '../../utils/utils';
import { CardBasket } from './CardBasket';

export class Basket extends Component<{ items: IProduct[], total: number }> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;
  protected events?: IEvents;

  constructor(container: HTMLElement, events?: IEvents) {
    const element = cloneTemplate<HTMLElement>('#basket');
    super(element);
    this.events = events;

    this._list = element.querySelector('.basket__list') as HTMLElement;
    this._total = element.querySelector('.basket__price') as HTMLElement;
    this._button = element.querySelector('.basket__button') as HTMLButtonElement;

    this._button.addEventListener('click', () => {
      this.events?.emit('basket:order');
    });
  }

  render(data?: Partial<{ items: IProduct[], total: number }>): HTMLElement {
    if (!data) return this.container;

    // Очищаем список
    if (this._list) {
      this._list.innerHTML = '';
    }

    // Отображаем товары или сообщение о пустой корзине
    if (data.items && data.items.length > 0) {
      const items = data.items.map((product, index) => {
        const card = new CardBasket(document.createElement('li'), this.events);
        return card.render({ ...product, index: index + 1 });
      });
      if (this._list) {
        this._list.replaceChildren(...items);
      }

      // Активируем кнопку оформления
      if (this._button) {
        this._button.disabled = false;
      }
    } else {
      // Показываем сообщение о пустой корзине
      if (this._list) {
        const emptyMessage = document.createElement('li');
        emptyMessage.textContent = 'Корзина пуста';
        emptyMessage.className = 'basket__empty';
        this._list.appendChild(emptyMessage);
      }

      // Деактивируем кнопку оформления
      if (this._button) {
        this._button.disabled = true;
      }
    }

    // Обновляем общую стоимость
    if (this._total && data.total !== undefined) {
      this._total.textContent = `${data.total} синапсов`;
    }

    return this.container;
  }
}
