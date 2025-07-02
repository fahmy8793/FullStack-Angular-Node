import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserData } from '../../interfaces/user-data';
import { OrderService } from '../../services/order.service';
import { Order } from '../../interfaces/order-data.interface';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  userOrders: Order[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private orderService: OrderService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [
        { value: '', disabled: true },
        [Validators.required, Validators.email],
      ],
      phone: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      const currentUser: UserData | null = this.authService.getCurrentUser();
      if (currentUser) {
        this.profileForm.patchValue({
          // firstName: currentUser.firstName,
          // lastName: currentUser.lastName,
          email: currentUser.email,
          // phone: currentUser.phone,
        });

        this.orderService.getMyOrders().subscribe({
          next: (orders) => {
            this.userOrders = orders;
            console.log('User Orders:', this.userOrders);
          },
          error: (err) => {
            console.error('Failed to load user orders:', err);
          },
        });
      } else {
        console.warn('User is logged in but no current user data found.');
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      const updatedUserData = this.profileForm.getRawValue();
      delete updatedUserData.email;

      console.log('Updated Profile Data:', updatedUserData);
      alert('Profile update simulated!');
    } else {
      this.profileForm.markAllAsTouched();
      alert('Please correct the errors in the form.');
      console.log('Form is invalid:', this.profileForm.errors);
    }
  }

  getFormControl(name: string) {
    return this.profileForm.get(name);
  }
}
