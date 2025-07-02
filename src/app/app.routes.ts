import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { CartComponent } from './users/cart/cart.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordDoneComponent } from './reset-password-done/reset-password-done.component';
import { authGuard } from './guards/auth.guard';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';

import { CheckoutComponent } from './users/checkout/checkout.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, title: 'home ' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cart', component: CartComponent, canActivate: [authGuard] },
  { path: 'password/reset', component: ForgetPasswordComponent },
  { path: 'password/reset/done', component:ResetPasswordDoneComponent},

  { path: 'admin', component: AdminLayoutComponent },

  { path: 'checkout', component: CheckoutComponent, title: 'checkout' },
];
