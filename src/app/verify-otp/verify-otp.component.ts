import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.scss',
})
export class VerifyOtpComponent implements OnInit {
  verifyForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  email: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.verifyForm = this.fb.group({
      otpCode: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    // Get the email from the query params
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'] || '';
    });
  }

  handleSubmitForm() {
    if (this.verifyForm.invalid) {
      this.verifyForm.markAllAsTouched();
      return;
    }

    const otpCode = this.verifyForm.value.otpCode;

    this.authService.verifyOtp(this.email, otpCode).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.errorMessage = '';
        // Navigate to reset-password page with token and email
        this.router.navigate(['password/reset/done'], {
          queryParams: { token: res.resetToken, email: this.email },

        });
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'OTP verification failed';
        this.successMessage = '';
      },
    });
  }
}
