export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  userId: string;
  orderDate: string;
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'; //  order status
  items: OrderItem[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    streetAddress: string;
    townCity: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string; //   payment method ('COD', 'PayPal', 'CreditCard')
  // last4Digits?: string;
  // expiryDate?: string;
}
