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
  // public currentUser$: Observable<UserData | null>;
  private apiUrl = environment.apiUrl;

  private currentUserSource = new BehaviorSubject<any | null>(null);
  public currentUser$ = this.currentUserSource.asObservable();


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
    console.log('🟢 VERIFY REGISTER OTP CALLED');
    return this.http.post<any>(`${this.apiUrl}/auth/verify-register-otp`, {
      email,
      otpCode,
    });
  }

  requestPasswordReset(email: string) {
    return this.http.post<any>(`${this.apiUrl}/auth/send-otp`, { email });
  }

  verifyOtp(email: string, otpCode: string) {
    console.log('🔴 VERIFY OTP (RESET) CALLED');
    return this.http.post<any>(`${this.apiUrl}/auth/verify-otp`, {
      email,
      otpCode,
    });
  }
  public updateUserName(newName: string): void {
    const currentUser = this.currentUserValue;

    if (currentUser) {
      const updatedUser = { ...currentUser, name: newName };

      this.currentUserSubject.next(updatedUser);

      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
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
        role: authResponse.role,
      };
      localStorage.setItem('authToken', authResponse.token);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      this.currentUserSubject.next(userData);
    }
  }
  private getUserFromLocalStorage(): UserData | null {
    if (typeof window !== 'undefined' && localStorage) {
      const user = localStorage.getItem('currentUser');
      if (!user || user === 'undefined') {
        return null;
      }
      try {
        return JSON.parse(user);
      } catch (error) {
        console.error('Invalid JSON in localStorage:', error);
        return null;
      }
    }
    return null;
  }


  // public updateUserName(newName: string): void {
  //   // 1. Get the current user object
  //   const currentUser = this.currentUserSource.getValue();
  //   // 2. If a user is logged in, update their name
  //   if (currentUser) {
  //     // 3. Create a new user object with the updated name
  //     const updatedUser = { ...currentUser, name: newName };
  //     // 4. Broadcast the updated user object to the rest of the app
  //     this.currentUserSource.next(updatedUser);
  //     // 5. Also update the user info in localStorage to keep it synced
  //     localStorage.setItem('userInfo', JSON.stringify(updatedUser));
  //   }
  // }
}
