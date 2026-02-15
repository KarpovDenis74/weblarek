import { Component } from '../base/Component';
import { IBuyer, TPayment } from '../../types';
import { IEvents } from '../base/Events';
import { cloneTemplate } from '../../utils/utils';

export class OrderForm extends Component<IBuyer> {
  protected _paymentButtons: NodeListOf<HTMLButtonElement>;
  protected _addressInput: HTMLInputElement;
  protected _submitButton: HTMLButtonElement;
  protected _errors: HTMLElement;
  protected events?: IEvents;
  private _selectedPayment: TPayment = '';

  constructor(container: HTMLElement, events?: IEvents) {
    const element = cloneTemplate<HTMLFormElement>('#order');
    super(element);
    this.events = events;

    this._paymentButtons = element.querySelectorAll('.order__buttons button') as NodeListOf<HTMLButtonElement>;
    this._addressInput = element.querySelector('input[name="address"]') as HTMLInputElement;
    this._submitButton = element.querySelector('button[type="submit"]') as HTMLButtonElement;
    this._errors = element.querySelector('.form__errors') as HTMLElement;

    // Обработчики выбора способа оплаты
    this._paymentButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const paymentName = button.name as 'card' | 'cash';
        this.setPayment(paymentName);
        this.validate();
      });
    });

    // Обработчик изменения адреса
    this._addressInput.addEventListener('input', () => {
      this.validate();
      this.events?.emit('order:change', {
        address: this._addressInput.value,
        payment: this._selectedPayment
      } as Partial<IBuyer>);
    });

    // Обработчик отправки формы
    element.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.validate()) {
        this.events?.emit('order:submit', {
          payment: this._selectedPayment,
          address: this._addressInput.value
        } as Partial<IBuyer>);
      }
    });
  }

  setPayment(payment: 'card' | 'cash'): void {
    this._selectedPayment = payment;

    // Обновляем визуальное состояние кнопок
    this._paymentButtons.forEach((button) => {
      if (button.name === payment) {
        button.classList.add('button_alt-active');
      } else {
        button.classList.remove('button_alt-active');
      }
    });
  }

  validate(): boolean {
    const errors: string[] = [];

    if (!this._selectedPayment || this._selectedPayment === '') {
      errors.push('Не выбран способ оплаты');
    }

    if (!this._addressInput.value || this._addressInput.value.trim() === '') {
      errors.push('Укажите адрес доставки');
    }

    // Отображаем ошибки
    if (this._errors) {
      if (errors.length > 0) {
        this._errors.textContent = errors.join(', ');
      } else {
        this._errors.textContent = '';
      }
    }

    // Активируем/деактивируем кнопку отправки
    if (this._submitButton) {
      this._submitButton.disabled = errors.length > 0;
    }

    return errors.length === 0;
  }

  render(data?: Partial<IBuyer>): HTMLElement {
    if (data) {
      if (data.payment && (data.payment === 'card' || data.payment === 'cash')) {
        this.setPayment(data.payment);
      }
      if (data.address && this._addressInput) {
        this._addressInput.value = data.address;
      }
      this.validate();
    }
    return this.container;
  }
}
