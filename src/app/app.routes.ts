import { Routes } from '@angular/router';
import { CartComponent } from './user/cart/cart.component';

export const routes: Routes = [
  {
    path: 'cart',
    component: CartComponent,
    title: 'Cart',
  },
];
