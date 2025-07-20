// src/app/services/user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`; // Base URL for user actions

  constructor(private http: HttpClient) {}

  // Function to update the user's name
  updateProfile(data: { name: string }): Observable<any> {
    return this.http.patch(`${this.apiUrl}/profile`, data);
  }

  // Function to change the user's password
  updatePassword(data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/change-password`, data);
  }

   getUser(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  
  createUser(userData: any): Observable<any> {
    return this.http.post(this.apiUrl, userData);
  }

  updateUser(id: string, userData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, userData);
  }
  
  deleteUser(id: string, userData: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, userData);
}
getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

}