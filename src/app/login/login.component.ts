import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';

// This is necessary for TypeScript to recognize the 'google' object
declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showPassword = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    // Ensure Google's script only runs in the browser to avoid SSR errors
    if (isPlatformBrowser(this.platformId)) {
      (window as any)['handleCredentialResponse'] =
        this.handleCredentialResponse.bind(this);

      google.accounts.id.initialize({
        // IMPORTANT: This should be your actual Client ID from Google Cloud Console
        client_id:
          '594089926182-nsq0trk9rmnvpcek7mmeukmjmgg5c3s9.apps.googleusercontent.com',
        callback: this.handleCredentialResponse.bind(this),
      });

      google.accounts.id.renderButton(document.getElementById('googleBtn'), {
        theme: 'outline',
        size: 'large',
        width: '300',
      });
    }
  }

  /**
   * Handles the response from Google Sign-In
   */
  handleCredentialResponse(response: any) {
    const googleToken = response.credential;

    this.authService.loginWithGoogle(googleToken).subscribe({
      next: (user) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Logged in with Google successfully!',
        });
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Google Login Failed',
          detail: err.error.message || 'An error occurred.',
        });
      },
    });
  }

  /**
   * Handles the regular email/password form submission
   */
  handleSubmitForm() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (user) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Login successful!',
        });
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: err.error.message || 'Invalid credentials',
        });
      },
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
