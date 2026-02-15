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
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

// Тестирование класса Catalog
console.log('=== Тестирование класса Catalog ===');
const catalogModel = new Catalog();
catalogModel.setProducts(apiProducts.items);
console.log('Массив товаров из каталога:', catalogModel.getProducts());
console.log('Количество товаров в каталоге:', catalogModel.getProducts().length);

const firstProduct = apiProducts.items[0];
const productById = catalogModel.getProductById(firstProduct.id);
console.log('Товар по ID:', productById);

catalogModel.setCurrentProduct(firstProduct);
console.log('Текущий выбранный товар:', catalogModel.getCurrentProduct());

const currentProduct = catalogModel.getCurrentProduct();
console.log('Получение текущего товара:', currentProduct);

// Тестирование класса Basket
console.log('\n=== Тестирование класса Basket ===');
const basketModel = new BasketModel();
console.log('Начальное состояние корзины:', basketModel.getItems());
console.log('Количество товаров в корзине (начальное):', basketModel.getCount());
console.log('Общая стоимость корзины (начальная):', basketModel.getTotal());

basketModel.addItem(apiProducts.items[0]);
basketModel.addItem(apiProducts.items[1]);
console.log('Товары в корзине после добавления:', basketModel.getItems());
console.log('Количество товаров в корзине:', basketModel.getCount());
console.log('Общая стоимость корзины:', basketModel.getTotal());

const containsFirst = basketModel.contains(apiProducts.items[0].id);
console.log('Содержит первый товар:', containsFirst);

const containsNonExistent = basketModel.contains('non-existent-id');
console.log('Содержит несуществующий товар:', containsNonExistent);

basketModel.removeItem(apiProducts.items[0]);
console.log('Товары в корзине после удаления первого:', basketModel.getItems());
console.log('Количество товаров в корзине после удаления:', basketModel.getCount());

basketModel.clear();
console.log('Товары в корзине после очистки:', basketModel.getItems());
console.log('Количество товаров в корзине после очистки:', basketModel.getCount());

// Тестирование класса Buyer
console.log('\n=== Тестирование класса Buyer ===');
const buyerModel = new Buyer();
console.log('Начальные данные покупателя:', buyerModel.getData());

buyerModel.setData({ email: 'test@example.com' });
console.log('Данные покупателя после установки email:', buyerModel.getData());

buyerModel.setData({ phone: '+7 999 123 45 67' });
console.log('Данные покупателя после установки phone (email сохранился):', buyerModel.getData());

buyerModel.setData({
  address: 'Москва, ул. Примерная, д. 1',
  payment: 'card'
});
console.log('Данные покупателя после установки address и payment:', buyerModel.getData());

const validationErrors = buyerModel.validate();
console.log('Ошибки валидации (все поля заполнены):', validationErrors);
console.log('Валидность данных:', Object.keys(validationErrors).length === 0);

buyerModel.clear();
console.log('Данные покупателя после очистки:', buyerModel.getData());

const emptyValidationErrors = buyerModel.validate();
console.log('Ошибки валидации (все поля пустые):', emptyValidationErrors);

buyerModel.setData({
  email: 'test@example.com',
  phone: '+7 999 123 45 67',
  address: 'Москва, ул. Примерная, д. 1',
  payment: 'cash'
});
const finalValidationErrors = buyerModel.validate();
console.log('Ошибки валидации (все поля заполнены корректно):', finalValidationErrors);
console.log('Валидность данных (все поля заполнены):', Object.keys(finalValidationErrors).length === 0);
// Работа с сервером
console.log('\n=== Работа с сервером ===');
const api = new Api(API_URL);
const shopApi = new ShopApi(api);

// Инициализация компонентов
const events = new EventEmitter();
const page = new Page(document.body);
const modal = new Modal(document.querySelector('#modal-container') as HTMLElement);
const header = new Header(document.querySelector('.header') as HTMLElement, events);

// Инициализация счетчика корзины
header.render({ count: basketModel.getCount() });

// Обработчик открытия модального окна с просмотром товара
events.on('card:select', (data: { product: import('./types').IProduct }) => {
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
events.on('card:add', (data: { product: import('./types').IProduct }) => {
  basketModel.addItem(data.product);
  updateBasketCounter();
  modal.close();
});

// Обработчик удаления товара из корзины
events.on('card:remove', (data: { product: import('./types').IProduct }) => {
  basketModel.removeItem(data.product);
  updateBasketCounter();

  // Если модальное окно открыто с корзиной, обновляем её
  const modalContainer = document.querySelector('#modal-container');
  const modalContent = modalContainer?.querySelector('.basket');
  if (modalContent) {
    const basket = new BasketView(document.createElement('div'), events);
    const items = basketModel.getItems();
    const total = basketModel.getTotal();
    const basketElement = basket.render({ items, total });
    modal.setContent(basketElement);
  } else {
    modal.close();
  }
});

// Обработчик открытия модального окна с корзиной
events.on('header:basket', () => {
  const basket = new BasketView(document.createElement('div'), events);
  const items = basketModel.getItems();
  const total = basketModel.getTotal();
  const basketElement = basket.render({ items, total });
  modal.setContent(basketElement);
  modal.open();
});

// Обработчик открытия формы оформления заказа
events.on('basket:order', () => {
  const orderForm = new OrderForm(document.createElement('form'), events);
  const buyerData = buyerModel.getData();
  const orderFormElement = orderForm.render(buyerData);
  modal.setContent(orderFormElement);
  modal.open();
});

// Обработчик изменения данных в форме оформления заказа
events.on('order:change', (data: Partial<import('./types').IBuyer>) => {
  buyerModel.setData(data);
});

// Обработчик отправки первой формы (переход ко второй форме)
events.on('order:submit', (data: Partial<import('./types').IBuyer>) => {
  buyerModel.setData(data);
  // Открываем вторую форму (ContactsForm)
  const contactsForm = new ContactsForm(document.createElement('form'), events);
  const buyerData = buyerModel.getData();
  const contactsFormElement = contactsForm.render(buyerData);
  modal.setContent(contactsFormElement);
  modal.open();
});

// Обработчик изменения данных в форме контактов
events.on('contacts:change', (data: Partial<import('./types').IBuyer>) => {
  buyerModel.setData(data);
});

// Обработчик отправки формы контактов (отправка заказа на сервер)
events.on('contacts:submit', async (data: Partial<import('./types').IBuyer>) => {
  buyerModel.setData(data);

  // Формируем данные заказа
  const buyerData = buyerModel.getData();
  const basketItems = basketModel.getItems();
  const total = basketModel.getTotal();
  const orderData: import('./types').IOrderRequest = {
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
    const success = new Success(document.createElement('div'), events);
    const successElement = success.render({ total });
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

shopApi.getProducts()
  .then((products) => {
    console.log('Товары получены с сервера:', products);
    catalogModel.setProducts(products);

    // Создаем карточки для каждого товара
    const cards = products.map((product) => {
      const card = new CardCatalog(document.createElement('button'), events);
      return card.render(product);
    });

    // Отображаем карточки на странице
    page.render(cards);
    console.log('Товары отображены на странице');
  })
  .catch((error) => {
    console.error('Ошибка при получении товаров с сервера:', error);
  });
