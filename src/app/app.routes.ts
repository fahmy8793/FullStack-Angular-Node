import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { CartComponent } from './users/cart/cart.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { authGuard } from './guards/auth.guard';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cart', component: CartComponent ,canActivate: [authGuard]},
  { path: 'forgot-password' , component: ForgetPasswordComponent},
    { path: 'admin', component: AdminLayoutComponent },

];
