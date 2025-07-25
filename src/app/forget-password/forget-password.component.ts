import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {
  forgotPasswordForm: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  handleSubmitForm() {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }
    const email = this.forgotPasswordForm.value.email;
    this.authService.requestPasswordReset(email).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.errorMessage = '';
        localStorage.setItem('resetEmail', email); // أهم خطوة
        this.router.navigate(['/verify-otp'], { queryParams: { flow: 'reset' } }); // flow=reset
      },
      error: (err) => {
        this.successMessage = '';
        this.errorMessage = err.error.message || 'Something went wrong';
      },
    });
  }
}
