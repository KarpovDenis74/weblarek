import { BuyerError, IBuyer, TPayment } from '../../types';
import { IEvents } from '../base/Events';

export class Buyer {
  protected payment: TPayment = '';
  protected address: string = '';
  protected phone: string = '';
  protected email: string = '';
  protected events?: IEvents;

  constructor(events?: IEvents) {
    this.events = events;
  }

  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) {
      this.payment = data.payment;
    }
    if (data.address !== undefined) {
      this.address = data.address;
    }
    if (data.phone !== undefined) {
      this.phone = data.phone;
    }
    if (data.email !== undefined) {
      this.email = data.email;
    }
    this.events?.emit('buyer:changed', {});
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      phone: this.phone,
      email: this.email,
    };
  }

  clear(): void {
    this.payment = '';
    this.address = '';
    this.phone = '';
    this.email = '';
  }

  validate(): BuyerError {
    const errors: BuyerError = {};

    if (!this.payment) {
      errors.payment = 'Не выбран вид оплаты';
    }

    if(!this.address?.trim()) {
      errors.address = 'Укажите адрес';
    }

    if (!this.phone?.trim()) {
      errors.phone = 'Укажите телефон';
    }

    if (!this.email?.trim()) {
      errors.email = 'Укажите емэйл';
    }

    return errors;
  }
}
