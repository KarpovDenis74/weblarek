import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { Basket as BasketModel } from './components/Models/basket';
import { Catalog } from './components/Models/catalog';
import { Buyer } from './components/Models/user';
import { ShopApi } from './components/ShopApi';
import { Basket as BasketView } from './components/View/Basket';
import { CardCatalog } from './components/View/CardCatalog';
import { CardPreview } from './components/View/CardPreview';
import { ContactsForm } from './components/View/ContactsForm';
import { Header } from './components/View/Header';
import { Modal } from './components/View/Modal';
import { OrderForm } from './components/View/OrderForm';
import { Page } from './components/View/Page';
import { Success } from './components/View/Success';
import './scss/styles.scss';
import { IBuyer, IOrderRequest, IProduct } from './types';
import { API_URL } from './utils/constants';
import { cloneTemplate } from './utils/utils';


// Инициализация событий
const events = new EventEmitter();

// Инициализация моделей данных
const basketModel = new BasketModel();
const buyerModel = new Buyer(events);
const catalogModel = new Catalog(events);

// Инициализация API
const api = new Api(API_URL);
const shopApi = new ShopApi(api);
const page = new Page(document.body);
const modal = new Modal(document.querySelector('#modal-container') as HTMLElement);
const header = new Header(document.querySelector('.header') as HTMLElement, events);

// Создание компонентов представления (кроме карточек)
const basketView = new BasketView(cloneTemplate<HTMLElement>('#basket'), events);
const orderForm = new OrderForm(cloneTemplate<HTMLFormElement>('#order'), events);
const contactsForm = new ContactsForm(cloneTemplate<HTMLFormElement>('#contacts'), events);
const successView = new Success(cloneTemplate<HTMLElement>('#success'), events);

// Инициализация счетчика корзины
header.render({ count: basketModel.getCount() });

// Обработчик открытия модального окна с просмотром товара
events.on('card:select', (data: { product: IProduct }) => {
  const previewElement = cloneTemplate<HTMLElement>('#card-preview');
  const preview = new CardPreview(previewElement, events);
  const inBasket = basketModel.contains(data.product.id);
  const renderedPreview = preview.render({ ...data.product, inBasket });
  modal.setContent(renderedPreview);
  modal.open();
});

// Функция для обновления счетчика в header
function updateBasketCounter() {
  const count = basketModel.getCount();
  header.render({ count });
}

// Обработчик добавления товара в корзину
events.on('card:add', (data: { product: IProduct }) => {
  basketModel.addItem(data.product);
  updateBasketCounter();
  modal.close();
});

// Обработчик удаления товара из корзины
events.on('card:remove', (data: { product: IProduct }) => {
  basketModel.removeItem(data.product);
  updateBasketCounter();

  // Если модальное окно открыто с корзиной, обновляем её
  if (modal.containsBasket()) {
    const items = basketModel.getItems();
    const total = basketModel.getTotal();
    const basketElement = basketView.render({ items, total });
    modal.setContent(basketElement);
  } else {
    modal.close();
  }
});

// Обработчик открытия модального окна с корзиной
events.on('header:basket', () => {
  const items = basketModel.getItems();
  const total = basketModel.getTotal();
  const basketElement = basketView.render({ items, total });
  modal.setContent(basketElement);
  modal.open();
});

// Обработчик открытия формы оформления заказа
events.on('basket:order', () => {
  const buyerData = buyerModel.getData();
  const orderFormElement = orderForm.render(buyerData);
  modal.setContent(orderFormElement);
  modal.open();
  // Валидируем форму при открытии
  const errors = buyerModel.validate();
  const formErrors: string[] = [];
  if (errors.payment) formErrors.push(errors.payment);
  if (errors.address) formErrors.push(errors.address);
  orderForm.setErrors(formErrors);
  orderForm.setSubmitButtonDisabled(formErrors.length > 0 || !buyerModel.getData().payment || !buyerModel.getData().address);
});

// Обработчик изменения данных в форме оформления заказа
events.on('order:change', (data: Partial<IBuyer>) => {
  buyerModel.setData(data);

  // Обновляем визуальное состояние кнопок оплаты, если изменилось поле payment
  if (data.payment && (data.payment === 'card' || data.payment === 'cash')) {
    orderForm.setPayment(data.payment);
  }

  // Валидируем только поля первой формы (payment и address)
  const errors = buyerModel.validate();
  const formErrors: string[] = [];
  if (errors.payment) formErrors.push(errors.payment);
  if (errors.address) formErrors.push(errors.address);
  orderForm.setErrors(formErrors);
  orderForm.setSubmitButtonDisabled(formErrors.length > 0 || !buyerModel.getData().payment || !buyerModel.getData().address);
});

// Обработчик отправки первой формы (переход ко второй форме)
events.on('order:submit', () => {
  // Валидируем только поля первой формы
  const errors = buyerModel.validate();
  const formErrors: string[] = [];
  if (errors.payment) formErrors.push(errors.payment);
  if (errors.address) formErrors.push(errors.address);

  if (formErrors.length === 0) {
    // Открываем вторую форму (ContactsForm)
    const buyerData = buyerModel.getData();
    const contactsFormElement = contactsForm.render(buyerData);
    modal.setContent(contactsFormElement);
    modal.open();
    // Валидируем вторую форму при открытии
    const contactErrors = buyerModel.validate();
    const contactFormErrors: string[] = [];
    if (contactErrors.email) contactFormErrors.push(contactErrors.email);
    if (contactErrors.phone) contactFormErrors.push(contactErrors.phone);
    contactsForm.setErrors(contactFormErrors);
    contactsForm.setSubmitButtonDisabled(contactFormErrors.length > 0 || !buyerModel.getData().email || !buyerModel.getData().phone);
  } else {
    orderForm.setErrors(formErrors);
    orderForm.setSubmitButtonDisabled(true);
  }
});

// Обработчик изменения данных в форме контактов
events.on('contacts:change', (data: Partial<IBuyer>) => {
  buyerModel.setData(data);
  // Валидируем только поля второй формы (email и phone)
  const errors = buyerModel.validate();
  const formErrors: string[] = [];
  if (errors.email) formErrors.push(errors.email);
  if (errors.phone) formErrors.push(errors.phone);
  contactsForm.setErrors(formErrors);
  contactsForm.setSubmitButtonDisabled(formErrors.length > 0 || !buyerModel.getData().email || !buyerModel.getData().phone);
});

// Обработчик отправки формы контактов (отправка заказа на сервер)
events.on('contacts:submit', async () => {
  // Валидируем все поля перед отправкой
  const errors = buyerModel.validate();
  const formErrors: string[] = [];
  if (errors.email) formErrors.push(errors.email);
  if (errors.phone) formErrors.push(errors.phone);

  if (formErrors.length > 0) {
    contactsForm.setErrors(formErrors);
    contactsForm.setSubmitButtonDisabled(true);
    return;
  }

  // Формируем данные заказа
  const buyerData = buyerModel.getData();
  const basketItems = basketModel.getItems();
  const total = basketModel.getTotal();
  const orderData: IOrderRequest = {
    payment: buyerData.payment,
    email: buyerData.email,
    phone: buyerData.phone,
    address: buyerData.address,
    items: basketItems.map(item => item.id),
    total: total
  };

  try {
    // Отправляем заказ на сервер
    const response = await shopApi.postOrder(orderData);
    console.log('Заказ успешно отправлен:', response);

    // Очищаем корзину и данные покупателя
    basketModel.clear();
    buyerModel.clear();
    updateBasketCounter();

    // Открываем модальное окно с сообщением об успехе
    // Используем total из ответа сервера, так как там наиболее актуальные данные
    const successElement = successView.render({ total: response.total });
    modal.setContent(successElement);
    modal.open();
  } catch (error) {
    console.error('Ошибка при отправке заказа:', error);
    // Можно добавить отображение ошибки пользователю
    alert('Произошла ошибка при оформлении заказа. Попробуйте еще раз.');
  }
});

// Обработчик закрытия сообщения об успехе
events.on('success:close', () => {
  modal.close();
});

// Обработчик изменения каталога товаров
events.on('catalog:changed', (data: { products: IProduct[] }) => {
  // Создаем карточки для каждого товара
  const cards = data.products.map((product) => {
    const cardElement = cloneTemplate<HTMLButtonElement>('#card-catalog');
    const card = new CardCatalog(cardElement, events);
    return card.render(product);
  });

  // Отображаем карточки на странице
  page.render(cards);
  console.log('Товары отображены на странице');
});

shopApi.getProducts()
  .then((products) => {
    console.log('Товары получены с сервера:', products);
    catalogModel.setProducts(products);
  })
  .catch((error) => {
    console.error('Ошибка при получении товаров с сервера:', error);
  });
