export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface TPayment {
  name: 'card' |'cash' | ''
}

export interface Product {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
};

export interface Buyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}