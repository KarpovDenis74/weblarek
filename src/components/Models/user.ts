import { IBuyer, TPayment } from '../../types';

export class Buyer {
  protected payment: TPayment = { name: '' };
  protected address: string = '';
  protected phone: string = '';
  protected email: string = '';

  constructor() {}

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
    this.payment = { name: '' };
    this.address = '';
    this.phone = '';
    this.email = '';
  }

  validate(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

    if (!this.payment.name || this.payment.name === '') {
      errors.payment = 'Не выбран вид оплаты';
    }

    if (!this.address || this.address.trim() === '') {
      errors.address = 'Укажите адрес';
    }

    if (!this.phone || this.phone.trim() === '') {
      errors.phone = 'Укажите телефон';
    }

    if (!this.email || this.email.trim() === '') {
      errors.email = 'Укажите емэйл';
    }

    return errors;
  }
}
