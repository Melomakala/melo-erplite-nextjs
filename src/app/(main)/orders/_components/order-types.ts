export interface MockCustomer {
  customer_id: string;
  name: string;
}

export interface MockProduct {
  product_id: string;
  name: string;
  price: number;
}

export interface MockOrderDetail {
  order_detail_id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  total: number;
  created_at: string;
}

export type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "COMPLETED" | "CANCELLED";

export interface MockOrder {
  order_id: string;
  customer_id: string;
  customer_name: string;
  status: OrderStatus;
  grand_total: number;
  order_details: MockOrderDetail[];
  created_at: string;
  updated_at: string;
}
