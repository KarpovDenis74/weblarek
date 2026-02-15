import { IProduct } from '../../types';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { CardBasket } from './CardBasket';

export class Basket extends Component<{ items: IProduct[], total: number }> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this._list = ensureElement<HTMLElement>('.basket__list', container);
    this._total = ensureElement<HTMLElement>('.basket__price', container);
    this._button = ensureElement<HTMLButtonElement>('.basket__button', container);

    this._button.addEventListener('click', () => {
      this.events.emit('basket:order');
    });
  }

  render(data?: Partial<{ items: IProduct[], total: number }>): HTMLElement {
    if (!data) return this.container;

    // Очищаем список
    this._list.innerHTML = '';

    // Отображаем товары или сообщение о пустой корзине
    if (data.items && data.items.length > 0) {
      const items = data.items.map((product, index) => {
        const cardElement = cloneTemplate<HTMLLIElement>('#card-basket');
        const card = new CardBasket(cardElement, this.events);
        return card.render({ ...product, index: index + 1 });
      });
      this._list.replaceChildren(...items);

      // Активируем кнопку оформления
      this._button.disabled = false;
    } else {
      // Показываем сообщение о пустой корзине
      const emptyMessage = document.createElement('li');
      emptyMessage.textContent = 'Корзина пуста';
      emptyMessage.className = 'basket__empty';
      this._list.appendChild(emptyMessage);

      // Деактивируем кнопку оформления
      this._button.disabled = true;
    }

    // Обновляем общую стоимость
    if (data.total !== undefined) {
      this._total.textContent = `${data.total} синапсов`;
    }

    return this.container;
  }
}
