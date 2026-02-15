import { Component } from '../base/Component';
import { cloneTemplate } from '../../utils/utils';

export class Modal extends Component<void> {
  protected _content: HTMLElement;
  protected _closeButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);
    this._content = container.querySelector('.modal__content') as HTMLElement;
    this._closeButton = container.querySelector('.modal__close') as HTMLButtonElement;

    // Закрытие по клику на кнопку закрытия
    this._closeButton.addEventListener('click', () => {
      this.close();
    });

    // Закрытие по клику вне модального окна
    container.addEventListener('click', (e) => {
      if (e.target === container) {
        this.close();
      }
    });

    // Предотвращение скролла модального окна
    container.addEventListener('wheel', (e) => {
      e.stopPropagation();
    });
  }

  setContent(content: HTMLElement): void {
    if (this._content) {
      this._content.replaceChildren(content);
    }
  }

  open(): void {
    this.container.classList.add('modal_active');
    // Блокируем скролл body при открытии модального окна
    document.body.style.overflow = 'hidden';
  }

  close(): void {
    this.container.classList.remove('modal_active');
    // Восстанавливаем скролл body при закрытии модального окна
    document.body.style.overflow = '';
    // Очищаем контент
    if (this._content) {
      this._content.innerHTML = '';
    }
  }

  containsBasket(): boolean {
    if (this._content) {
      return this._content.querySelector('.basket') !== null;
    }
    return false;
  }

  render(): HTMLElement {
    return this.container;
  }
}
