import './scss/styles.scss';
import { Catalog } from './components/Models/catalog';
import { Basket } from './components/Models/basket';
import { Buyer } from './components/Models/user';
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
const basketModel = new Basket();
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
  payment: { name: 'card' }
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
  payment: { name: 'cash' }
});
const finalValidationErrors = buyerModel.validate();
console.log('Ошибки валидации (все поля заполнены корректно):', finalValidationErrors);
console.log('Валидность данных (все поля заполнены):', Object.keys(finalValidationErrors).length === 0);