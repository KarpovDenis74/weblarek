import { IApi, IProduct, IProductsResponse, IOrderRequest } from '../types';

export class ShopApi {
  protected api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async getProducts(): Promise<IProduct[]> {
    const response = await this.api.get<IProductsResponse>('/product/');
    return response.items;
  }

  async postOrder(order: IOrderRequest): Promise<object> {
    return await this.api.post('/order/', order);
  }
}
