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
import { ProfileComponent } from './users/profile/profile.component';

import { BookListComponent } from './book-list/book-list.component';
import { BookDetailsComponent } from './book-details/book-details.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, title: 'home ' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cart', component: CartComponent, canActivate: [authGuard] },

  { path: 'password/reset', component: ForgetPasswordComponent },
  { path :'verify-otp', component: VerifyOtpComponent},
  { path: 'password/reset/done', component:ResetPasswordDoneComponent},

  { path: 'shop', component:BookListComponent},
  { path: 'shop/:id', component: BookDetailsComponent },

  { path: 'admin', component: AdminLayoutComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'checkout', component: CheckoutComponent, title: 'checkout' },
];
