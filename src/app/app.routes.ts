import { NotFoundComponent } from './not-found/not-found.component';
import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { CartComponent } from './users/cart/cart.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordDoneComponent } from './reset-password-done/reset-password-done.component';
import { authGuard } from './guards/auth.guard';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
// import { BookListsComponent } from './admin/books/book-list/book-list.component';
import { BookDetailComponent } from './admin/books/book-add/book-detail.component';
import { OrderDetailComponent } from './admin/orders/order-detail/order-detail.component';
import { OrderListComponent } from './admin/orders/order-list/order-list.component';

import { CheckoutComponent } from './users/checkout/checkout.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './users/profile/profile.component';
import { BookListComponent } from './book-list/book-list.component';
import { BookDetailsComponent } from './book-details/book-details.component';

import { VerifyOtpComponent } from './auth/verify-otp.component';

import { WishlistComponent } from './wish-list/wish-list.component';
import { SettingsComponent } from './admin/settings/settings.component';
import { UserDetailComponent } from './admin/users/user-add/user-detail.component';
import { UserListComponent } from './admin/users/user-list/user-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, title: 'home' },
  { path: 'register', component: RegisterComponent },
  { path: 'verify-otp', loadComponent: () => import('./auth/verify-otp.component').then(m => m.VerifyOtpComponent) },
  { path: 'login', component: LoginComponent },

  { path: 'cart', component: CartComponent, canActivate: [authGuard] },
  { path: 'checkout', component: CheckoutComponent, title: 'checkout', canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, title: 'profile', canActivate: [authGuard] },
  { path: 'wish', component: WishlistComponent, title: 'wish list', canActivate: [authGuard] },

  { path: 'password/reset', component: ForgetPasswordComponent },
  { path: 'password/reset/done', component: ResetPasswordDoneComponent },
  { path: 'verify-otp', component: VerifyOtpComponent },

  { path: 'shop', component: BookListComponent, title: 'shop' },
  { path: 'shop/:id', component: BookDetailsComponent },

  { path: 'admin', component: AdminLayoutComponent, canActivate: [authGuard] },


  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
       { path: 'book-list', component: BookListComponent },
       { path: 'book-add', component: BookDetailComponent },

      { path: 'orders', component: OrderDetailComponent },
       { path: 'order-list', component: OrderListComponent },
       { path: 'settings', component: SettingsComponent },
       { path: 'user-add', component: UserDetailComponent },
        { path: 'users', component: UserListComponent },
       { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },



  // must be last route
  { path: '**', component: NotFoundComponent }


];
