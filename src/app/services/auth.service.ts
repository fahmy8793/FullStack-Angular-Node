import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserData } from '../interfaces/user-data';
import { LoginRequest } from '../interfaces/login-request';
import { RegisterRequest } from '../interfaces/register-request';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<UserData | null>;
  public currentUser$: Observable<UserData | null>;
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {
    const user = this.getUserFromLocalStorage();
    this.currentUserSubject = new BehaviorSubject<UserData | null>(user);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserData | null {
    return this.currentUserSubject.value;
  }

  // --- Core Authentication Methods ---

  register(data: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/register`, data);
  }

  login(data: LoginRequest): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/auth/login`, data)
      .pipe(tap((response) => this.setSession(response)));
  }

  loginWithGoogle(googleToken: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/auth/google-login`, { tokenId: googleToken })
      .pipe(tap((response) => this.setSession(response)));
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // OTP methods 
  verifyRegisterOtp(email: string, otpCode: string) {
    console.log("🟢 VERIFY REGISTER OTP CALLED");
    return this.http.post<any>(`${this.apiUrl}/auth/verify-register-otp`, {
      email,
      otpCode,
    });
  }

  requestPasswordReset(email: string) {
    return this.http.post<any>(`${this.apiUrl}/auth/send-otp`, { email });
  }

  verifyOtp(email: string, otpCode: string) {
    console.log("🔴 VERIFY OTP (RESET) CALLED");
    return this.http.post<any>(`${this.apiUrl}/auth/verify-otp`, {
      email,
      otpCode,
    });
  }

  resetPassword(resetToken: string, newPassword: string) {
    // Note: The backend might not need the email here, only the token and new password.
    // Adjust if necessary based on the backend implementation.
    return this.http.post<any>(`${this.apiUrl}/auth/reset-password`, {
      resetToken,
      newPassword,
    });
  }

  // --- Helper & Utility Methods ---

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  private setSession(authResponse: any) {
    if (authResponse && authResponse.token) {
      const userData: UserData = {
        _id: authResponse._id,
        name: authResponse.name,
        email: authResponse.email,
      };
      localStorage.setItem('authToken', authResponse.token);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      this.currentUserSubject.next(userData);
    }
  }

  private getUserFromLocalStorage(): UserData | null {
    if (typeof window !== 'undefined' && localStorage) {
      const user = localStorage.getItem('currentUser');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }
}
