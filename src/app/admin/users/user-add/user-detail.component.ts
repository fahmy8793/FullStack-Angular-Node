import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service'; // Import your user service
import { MessageService } from 'primeng/api'; // For notifications

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  userId: string | null = null;
  user: any = {
    name: '',
    email: '',
    role: 'customer', // Default role
    password: '' // Only for new user
  };
  isNewUser = true;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');
      if (this.userId && this.userId !== 'new') {
        this.isNewUser = false;
        this.loadUser(this.userId);
      }
    });
  }

  loadUser(id: string): void {
    this.isLoading = true;
    this.userService.getUser(id).subscribe({
      next: (user) => {
        this.user = user;
        this.isLoading = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load user data'
        });
        this.isLoading = false;
      }
    });
  }

  saveUser(): void {
    if (this.isFormInvalid()) return;

    this.isLoading = true;
    
    if (this.isNewUser) {
      this.createUser();
    } else {
      this.updateUser();
    }
  }

  createUser(): void {
    this.userService.createUser(this.user).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User created successfully'
        });
        this.navigateToList();
      },
      error: (err) => {
        this.handleError(err, 'Failed to create user');
      }
    });
  }

  updateUser(): void {
    if (!this.userId) return;

    this.userService.updateUser(this.userId, this.user).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User updated successfully'
        });
        this.navigateToList();
      },
      error: (err) => {
        this.handleError(err, 'Failed to update user');
      }
    });
  }

  isFormInvalid(): boolean {
    if (!this.user.name || !this.user.email) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Name and Email are required'
      });
      return true;
    }

    if (this.isNewUser && !this.user.password) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Password is required for new users'
      });
      return true;
    }

    return false;
  }

  handleError(error: any, message: string): void {
    console.error(error);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: error.error?.message || message
    });
    this.isLoading = false;
  }

  navigateToList(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  cancel(): void {
    this.navigateToList();
  }
}