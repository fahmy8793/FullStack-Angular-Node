import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable ,of} from 'rxjs';
import { RegisterComponent } from '../register/register.component';
import { UserData } from '../interfaces/user-data';
import { LoginRequest } from '../interfaces/login-request';
import { RegisterRequest } from '../interfaces/register-request';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) {}


  register(data: RegisterRequest): Observable<UserData> {
    return this.http.post<UserData>(`${environment.apiUrl}/users`, data);
  }

  login(data: LoginRequest): Observable<UserData> {
    return this.http.post<UserData>(`${environment.apiUrl}/auth/login`, data);
  }

  saveUserToLocalStorage(user: UserData) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  logout() {
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): UserData | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  // login(data: LoginRequest): Observable<UserData> {
  //   return this.http.get(`${environment.apiUrl}/users?email=${data.email}`);
  // }

  //  register(data: RegisterRequest): Observable<UserData> {
  //   return this.http.post(`${environment.apiUrl}/users`, data);
  // }
}
