import { LoginService } from '../../services/login.service';
import { Component } from '@angular/core';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

interface SignupForm {
  username: FormControl,
  email: FormControl,
  password: FormControl,
  passwordConfirm: FormControl
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    DefaultLoginLayoutComponent,
    ReactiveFormsModule,
    PrimaryInputComponent
  ],
  providers: [LoginService],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signupForm!: FormGroup<SignupForm>;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastrService

  ) {
    this.signupForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  submit(event?: Event) {
    event?.preventDefault(); 

    if (!this.signupForm.valid) {
      this.toastService.error("Please fill all required fields");
      return;
    }

    const { username, email, password, passwordConfirm } = this.signupForm.value;


    if (password !== passwordConfirm) {
      this.toastService.error("Passwords do not match");
      return;
    }

    this.loginService.signup(username, email, password).subscribe({
      next: () => this.toastService.success('Account created successfully'),
      error: () => this.toastService.error('Create failed')
    });
  }

    
  navigate(){
    this.router.navigate(['/login']);

  }
}
