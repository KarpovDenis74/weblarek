import { Component } from '../base/Component';
import { IBuyer } from '../../types';
import { IEvents } from '../base/Events';
import { cloneTemplate } from '../../utils/utils';

export class ContactsForm extends Component<IBuyer> {
  protected _emailInput: HTMLInputElement;
  protected _phoneInput: HTMLInputElement;
  protected _submitButton: HTMLButtonElement;
  protected _errors: HTMLElement;
  protected events?: IEvents;

  constructor(container: HTMLElement, events?: IEvents) {
    const element = cloneTemplate<HTMLFormElement>('#contacts');
    super(element);
    this.events = events;

    this._emailInput = element.querySelector('input[name="email"]') as HTMLInputElement;
    this._phoneInput = element.querySelector('input[name="phone"]') as HTMLInputElement;
    this._submitButton = element.querySelector('button[type="submit"]') as HTMLButtonElement;
    this._errors = element.querySelector('.form__errors') as HTMLElement;

    // Обработчик изменения email
    this._emailInput.addEventListener('input', () => {
      this.validate();
      this.events?.emit('contacts:change', {
        email: this._emailInput.value
      } as Partial<IBuyer>);
    });

    // Обработчик изменения телефона
    this._phoneInput.addEventListener('input', () => {
      this.validate();
      this.events?.emit('contacts:change', {
        phone: this._phoneInput.value
      } as Partial<IBuyer>);
    });

    // Обработчик отправки формы
    element.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.validate()) {
        this.events?.emit('contacts:submit', {
          email: this._emailInput.value,
          phone: this._phoneInput.value
        } as Partial<IBuyer>);
      }
    });
  }

  validate(): boolean {
    const errors: string[] = [];

    if (!this._emailInput.value || this._emailInput.value.trim() === '') {
      errors.push('Укажите email');
    }

    if (!this._phoneInput.value || this._phoneInput.value.trim() === '') {
      errors.push('Укажите телефон');
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
      if (data.email && this._emailInput) {
        this._emailInput.value = data.email;
      }
      if (data.phone && this._phoneInput) {
        this._phoneInput.value = data.phone;
      }
      this.validate();
    }
    return this.container;
  }
}
