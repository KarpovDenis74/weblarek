import { IBuyer } from '../../types';
import { ensureAllElements, ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { Form } from './Form';

export class OrderForm extends Form<IBuyer> {
  protected _paymentButtons: HTMLButtonElement[];
  protected _addressInput: HTMLInputElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this._paymentButtons = ensureAllElements<HTMLButtonElement>('.order__buttons button', container);
    this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);

    // Обработчики выбора способа оплаты
    this._paymentButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const paymentName = button.name as 'card' | 'cash';
        this.events.emit('order:change', {
          payment: paymentName
        } as Partial<IBuyer>);
      });
    });

    // Обработчик изменения адреса
    this._addressInput.addEventListener('input', () => {
      this.events.emit('order:change', {
        address: this._addressInput.value
      } as Partial<IBuyer>);
    });

    // Обработчик отправки формы
    container.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit('order:submit');
    });
  }

  setPayment(payment: 'card' | 'cash'): void {
    // Обновляем визуальное состояние кнопок
    this._paymentButtons.forEach((button) => {
      if (button.name === payment) {
        button.classList.add('button_alt-active');
      } else {
        button.classList.remove('button_alt-active');
      }
    });
  }

  render(data?: Partial<IBuyer>): HTMLElement {
    if (data) {
      if (data.payment && (data.payment === 'card' || data.payment === 'cash')) {
        this.setPayment(data.payment);
      }
      if (data.address) {
        this._addressInput.value = data.address;
      }
    }
    return this.container;
  }
}
