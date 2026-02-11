import { Product } from '../../types';


export class Catalog {
  protected productList: [Product] = [];
  protected currentProduct: Product;

  constructor(baseUrl: string, options: RequestInit = {}) {
      this.baseUrl = baseUrl;
      this.options = {
          headers: {
              'Content-Type': 'application/json',
              ...(options.headers as object ?? {})
          }
      };
  }
}