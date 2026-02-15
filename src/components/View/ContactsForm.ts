import { IBuyer } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { Form } from './Form';

export class ContactsForm extends Form<IBuyer> {
  protected _emailInput: HTMLInputElement;
  protected _phoneInput: HTMLInputElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
    this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);

    // Обработчик изменения email
    this._emailInput.addEventListener('input', () => {
      this.events.emit('contacts:change', {
        email: this._emailInput.value
      } as Partial<IBuyer>);
    });

    // Обработчик изменения телефона
    this._phoneInput.addEventListener('input', () => {
      this.events.emit('contacts:change', {
        phone: this._phoneInput.value
      } as Partial<IBuyer>);
    });

    // Обработчик отправки формы
    container.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit('contacts:submit');
    });
  }

  render(data?: Partial<IBuyer>): HTMLElement {
    if (data) {
      if (data.email) {
        this._emailInput.value = data.email;
      }
      if (data.phone) {
        this._phoneInput.value = data.phone;
      }
    }
    return this.container;
  }
}
