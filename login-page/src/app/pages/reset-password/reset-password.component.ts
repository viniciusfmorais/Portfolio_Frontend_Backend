import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {

  password: string = '';
  confirmPassword: string = '';
  token: string = '';
  message: string = '';
  

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'];
  }

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.message = 'Passwords do not match';
      return;
    }

    this.http.post(`http://192.168.1.18:8080/auth/reset-password`, {
      token: this.token,
      newPassword: this.password
    }).subscribe({
      next: (res: any) => this.message = res.message,
      error: (err) => this.message = err.error?.message || 'Error resetting password'
    });
  }


}
