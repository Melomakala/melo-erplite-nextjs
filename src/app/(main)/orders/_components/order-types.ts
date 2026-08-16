// Order types — matching Prisma schema (tbl_order, tbl_order_detail)

export type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "COMPLETED" | "CANCELLED";

export interface OrderDetail {
  order_detail_id: string;
  order_id: string;
  product_id: string;
  product_name?: string;
  product?: {
    product_id: string;
    name: string;
  };
  quantity: number;
  price: number;
  total: number;
  created_at: string;
}

export interface Order {
  order_id: string;
  customer_id: string;
  name?: string;
  customer?: {
    customer_id: string;
    name: string;
  };
  status: OrderStatus;
  grand_total: number;
  order_details: OrderDetail[];
  created_at: string;
  updated_at: string;
}

// Minimal Product shape needed by order form / combobox
export interface OrderProduct {
  product_id: string;
  name: string;
  price: number;
}
