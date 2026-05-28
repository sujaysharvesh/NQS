import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  ApiResponse
} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private base = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getAll(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(
      this.base,
      { headers: this.getHeaders() }
    );
  }

  getById(id: string): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(
      `${this.base}/${id}`,
      { headers: this.getHeaders() }
    );
  }

  create(payload: CreateUserRequest): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(
      this.base,
      payload,
      { headers: this.getHeaders() }
    );
  }

  update(id: string, payload: UpdateUserRequest): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(
      `${this.base}/${id}`,
      payload,
      { headers: this.getHeaders() }
    );
  }

  delete(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(
      `${this.base}/${id}`,
      { headers: this.getHeaders() }
    );
  }
}