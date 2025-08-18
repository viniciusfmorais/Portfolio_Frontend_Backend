import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ForgotPasswordService } from '../../services/forgot-password.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  email: string = '';
  message: string = '';
  isLoading: boolean = false;

  constructor(private forgotPasswordService: ForgotPasswordService) { }

  onSubmit() {
    this.message = '';
    this.isLoading = true;
    
    this.forgotPasswordService.sendResetLink(this.email).subscribe({
      next: (res) => {
        this.message = 'If the email exists, a reset link has been sent!';
        this.isLoading = false;
      },
      error: (err) => {
        this.message = 'Error sending reset link. Try again later.';
        this.isLoading = false;
      }
    });
  }

}