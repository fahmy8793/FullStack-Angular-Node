import { Component, OnInit, Inject, PLATFORM_ID, NgZone } from '@angular/core';
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
import { ToastModule } from 'primeng/toast'; // ✅ جديد
import { environment } from '../../environments/environment';

// This is necessary for TypeScript to recognize the 'google' object
declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule,ToastModule],
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
    private messageService: MessageService,
    private ngZone: NgZone
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
        client_id: environment.GOOGLE_CLIENT_ID,
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
        this.ngZone.run(() => {
          const role = user.role;

          if (role === 'admin') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/']);
          }
        });
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
        console.log('LOGIN RESPONSE:', user);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Login successful!',
        });
        const role = user.role;

        if (role === 'admin') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err: any) => {
        console.log('LOGIN ERROR:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: err.error.message || 'invalid email or password',
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
