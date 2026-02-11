import { IProduct } from '../../types';

export class Catalog {
  protected productList: IProduct[] = [];
  protected currentProduct: IProduct | null = null;

  constructor() {}

  setProducts(products: IProduct[]): void {
    this.productList = products;
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
