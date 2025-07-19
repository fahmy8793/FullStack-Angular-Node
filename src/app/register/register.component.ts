import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [MessageService],
})
export class RegisterComponent {
  registerForm: FormGroup;
  passwordsDoNotMatch: boolean = false;

  showPassword: boolean = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
          ),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    });
  }

  handleSubmitForm() {
    this.passwordsDoNotMatch = false;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { password, confirmPassword } = this.registerForm.value;

    if (password !== confirmPassword) {
      this.passwordsDoNotMatch = true;
      return;
    }

    this.authService.register(this.registerForm.value).subscribe({
      next: (res) => {
        localStorage.setItem('registerEmail', this.registerForm.value.email);
        this.router.navigate(['/verify-otp']);
      },
      error: (err) => {
        console.error('❌ Registration failed:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Registration Failed',
          detail: err.error?.message || 'This email is already in use or another error occurred.',
        });
      },
    });
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
