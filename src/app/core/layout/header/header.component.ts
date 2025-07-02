import { CartService } from './../../../services/cartService.service';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  //for count item in cart
  cartItemCount: number = 0;
  constructor(
    public authService: AuthService,
    private router: Router,
    private CartService: CartService
  ) {}

  //for count item in cart
  ngOnInit(): void {
    this.CartService.cartItems$.subscribe((items) => {
      this.cartItemCount = items.reduce(
        (total, item) => total + item.quantity,
        0
      );
    });
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['home']);
  }
}
