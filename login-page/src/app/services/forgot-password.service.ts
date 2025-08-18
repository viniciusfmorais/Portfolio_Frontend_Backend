import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {


  private apiUrl = 'http://192.168.1.18:8080/auth/forgot-password'; //

  constructor(private http: HttpClient) { }

  sendResetLink(email: string): Observable<any> {
    return this.http.post(this.apiUrl, { email },  { responseType: 'text' });
  }
}