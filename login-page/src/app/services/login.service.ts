import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../types/login-response.type';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://192.168.1.18:8080/';
  

  constructor(private httpClient: HttpClient) { }

  login( email: string, password: string ){
    return this.httpClient.post<LoginResponse>(this.apiUrl + "auth/login", {email, password}).pipe(
      tap((value) => {
        sessionStorage.setItem('auth-token', value.token)
        sessionStorage.setItem('email', value.email);
      })
    )
  }
   signup(username: string, email: string, password: string){
    return this.httpClient.post<LoginResponse>(this.apiUrl + "auth/register", { username, email, password }).pipe(
      tap((value) => {
        sessionStorage.setItem("auth-token", value.token)
        sessionStorage.setItem("email", value.email);
      })
    )
  }
}


