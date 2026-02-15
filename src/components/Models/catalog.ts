import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class Catalog {
  protected productList: IProduct[] = [];
  protected currentProduct: IProduct | null = null;
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  setProducts(products: IProduct[]): void {
    this.productList = products;
    this.events.emit('catalog:changed', { products: this.productList });
  }

  getProducts(): IProduct[] {
    return this.productList;
  }

  getProductById(id: string): IProduct | undefined {
    return this.productList.find(product => product.id === id);
  }

  setCurrentProduct(product: IProduct): void {
    this.currentProduct = product;
  }

  getCurrentProduct(): IProduct | null {
    return this.currentProduct;
  }
}
