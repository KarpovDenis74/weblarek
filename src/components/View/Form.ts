import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export abstract class Form<T> extends Component<T> {
  protected _submitButton: HTMLButtonElement;
  protected _errors: HTMLElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
    this._errors = ensureElement<HTMLElement>('.form__errors', container);
  }

  setErrors(errors: string[]): void {
    if (errors.length > 0) {
      this._errors.textContent = errors.join(', ');
    } else {
      this._errors.textContent = '';
    }
  }

  setSubmitButtonDisabled(disabled: boolean): void {
    this._submitButton.disabled = disabled;
  }
}
