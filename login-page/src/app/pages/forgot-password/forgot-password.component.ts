import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ForgotPasswordService } from '../../services/forgot-password.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  email: string = '';
  message: string = '';

  constructor(private forgotPasswordService: ForgotPasswordService) { }

  onSubmit() {
    this.forgotPasswordService.sendResetLink(this.email).subscribe({
      next: (res) => this.message = 'If the email exists, a reset link has been sent!',
      error: (err) => this.message = 'Error sending reset link. Try again later.'
    });
  }
}