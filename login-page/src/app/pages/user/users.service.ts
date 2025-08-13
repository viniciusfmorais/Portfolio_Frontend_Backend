import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, delay } from 'rxjs';
import { User } from './user.model';

export interface UsersQuery {
  q?: string;
  role?: string;
  status?: string;
  page?: number;      // 1-based
  pageSize?: number;  // e.g. 10, 25, 50
  sort?: string;      // e.g. 'name' | '-createdAt'
}

export interface UsersResponse {
  data: User[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private http = inject(HttpClient);
  private baseUrl = '/api/users'; // ajuste para o teu backend

  list(query: UsersQuery): Observable<UsersResponse> {
    let params = new HttpParams();
    if (query.q) params = params.set('q', query.q);
    if (query.role) params = params.set('role', query.role);
    if (query.status) params = params.set('status', query.status);
    if (query.page) params = params.set('page', String(query.page));
    if (query.pageSize) params = params.set('pageSize', String(query.pageSize));
    if (query.sort) params = params.set('sort', query.sort);

    // remove o delay quando conectar de verdade
    return this.http.get<UsersResponse>(this.baseUrl, { params }).pipe(delay(250));
  }
}
