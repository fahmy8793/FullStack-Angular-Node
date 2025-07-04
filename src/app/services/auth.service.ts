import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { RegisterComponent } from '../register/register.component';
import { UserData } from '../interfaces/user-data';
import { LoginRequest } from '../interfaces/login-request';
import { RegisterRequest } from '../interfaces/register-request';
import { environment } from '../../environments/environment';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  // BACK END
  register(data: RegisterRequest): Observable<UserData> {
    // console.log(this.user);
    return this.http.post<UserData>(`${environment.authApiUrl}/register`, data);
  }

  login(data: LoginRequest): Observable<UserData> {
    return this.http.post<UserData>(`${environment.authApiUrl}/login`, data);
  }

  saveUserToLocalStorage(user: UserData) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  logout() {
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): UserData | null {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }
  return null;
}

isLoggedIn(): boolean {
  return !!this.getCurrentUser();
}

requestPasswordReset (email :string){
  return this.http.post<any>(`${environment.authApiUrl}/send-otp`, { email });
}

verifyOtp(email: string, otpCode: string) {
  return this.http.post<any>(`${environment.authApiUrl}/verify-otp`, {
    email,
    otpCode,
  });
}


resetPassword(email: string, newPassword: string, resetToken: string) {
  return this.http.post<any>(`${environment.authApiUrl}/reset-password`, {
    email,
    newPassword,
    resetToken,
  });
}



}
