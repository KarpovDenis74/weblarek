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


const basketModel = new BasketModel();



// Тестирование класса Buyer

const buyerModel = new Buyer();


const api = new Api(API_URL);
const shopApi = new ShopApi(api);

// Инициализация компонентов
const events = new EventEmitter();
const catalogModel = new Catalog(events);
const page = new Page(document.body);
const modal = new Modal(document.querySelector('#modal-container') as HTMLElement);
const header = new Header(document.querySelector('.header') as HTMLElement, events);

// Создание компонентов представления (кроме карточек)
const basketView = new BasketView(document.createElement('div'), events);
const orderForm = new OrderForm(document.createElement('form'), events);
const contactsForm = new ContactsForm(document.createElement('form'), events);
const successView = new Success(document.createElement('div'), events);

// Инициализация счетчика корзины
header.render({ count: basketModel.getCount() });

// Обработчик открытия модального окна с просмотром товара
events.on('card:select', (data: { product: IProduct }) => {
  const preview = new CardPreview(document.createElement('div'), events);
  const inBasket = basketModel.contains(data.product.id);
  const previewElement = preview.render({ ...data.product, inBasket });
  modal.setContent(previewElement);
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
});

// Обработчик изменения данных в форме оформления заказа
events.on('order:change', (data: Partial<IBuyer>) => {
  buyerModel.setData(data);
});

// Обработчик отправки первой формы (переход ко второй форме)
events.on('order:submit', (data: Partial<IBuyer>) => {
  buyerModel.setData(data);
  // Открываем вторую форму (ContactsForm)
  const buyerData = buyerModel.getData();
  const contactsFormElement = contactsForm.render(buyerData);
  modal.setContent(contactsFormElement);
  modal.open();
});

// Обработчик изменения данных в форме контактов
events.on('contacts:change', (data: Partial<IBuyer>) => {
  buyerModel.setData(data);
});

// Обработчик отправки формы контактов (отправка заказа на сервер)
events.on('contacts:submit', async (data: Partial<IBuyer>) => {
  buyerModel.setData(data);

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
    const card = new CardCatalog(document.createElement('button'), events);
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
