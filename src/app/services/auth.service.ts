import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable ,of} from 'rxjs';
import { RegisterComponent } from '../register/register.component';
import { UserData } from '../interfaces/user-data';
import { LoginRequest } from '../interfaces/login-request';
import { RegisterRequest } from '../interfaces/register-request';
import { environment } from '../../environments/environment';
import { throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) {}


//TESTING WITH LOCAL STORAGE

register(data: RegisterRequest): Observable<any> {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  users.push(data);
  localStorage.setItem('users', JSON.stringify(users));
  return of({ message: 'Registered successfully' });
}

login(data: LoginRequest): Observable<UserData> {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find((u: any) => u.email === data.email && u.password === data.password);
  if (user) {
    this.saveUserToLocalStorage(user);
    return of(user);
  } else {
    return throwError(() => new Error('Invalid email or password'));
  }
}


saveUserToLocalStorage(user: UserData) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

logout() {
  localStorage.removeItem('currentUser');
}

// getCurrentUser(): UserData | null {
//   const user = localStorage.getItem('currentUser');
//   return user ? JSON.parse(user) : null;
// }
getCurrentUser(): UserData | null {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }
  return null;
}

// isLoggedIn(): boolean {
//   return !!this.getCurrentUser();
// }
isLoggedIn(): boolean {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    return !!this.getCurrentUser();
  }
  return false;
}





// BACK END
  // register(data: RegisterRequest): Observable<UserData> {
  //   return this.http.post<UserData>(`${environment.apiUrl}/users`, data);
  // }

  // login(data: LoginRequest): Observable<UserData> {
  //   return this.http.post<UserData>(`${environment.apiUrl}/auth/login`, data);
  // }

  // saveUserToLocalStorage(user: UserData) {
  //   localStorage.setItem('currentUser', JSON.stringify(user));
  // }

  // logout() {
  //   localStorage.removeItem('currentUser');
  // }

  // getCurrentUser(): UserData | null {
  //   const user = localStorage.getItem('currentUser');
  //   return user ? JSON.parse(user) : null;
  // }

  // isLoggedIn(): boolean {
  //   return !!this.getCurrentUser();
  // }


}
