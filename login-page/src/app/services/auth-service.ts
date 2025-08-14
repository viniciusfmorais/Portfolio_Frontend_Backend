import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map, Observable } from 'rxjs';

export interface LoginResponse {
  token: string;
  email?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  /** Call your backend login, get JWT, and store it */
  login(email: string, password: string): Observable<void> {
    return this.http.post<LoginResponse>('/auth/login', { email, password }).pipe(
      tap(res => {
        sessionStorage.setItem('auth-token', res.token);   // <- token salvo
        if (res.email) sessionStorage.setItem('email', res.email);
      }),
      map(() => void 0)
    );
  }

  logout() {
    sessionStorage.removeItem('auth-token');
    sessionStorage.removeItem('email');
  }

  get token(): string | null {
    return sessionStorage.getItem('auth-token');
  }
}
