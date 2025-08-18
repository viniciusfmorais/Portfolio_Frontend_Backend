import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { UserComponent } from './pages/user/user.component';
import { AuthGuard } from './services/auth-guard.service';
import { CertificatesComponent } from './pages/certificates/certificates.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';

export const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full"
  },
  {
    path: "login",
    component: LoginComponent,
    data: { title: 'Login | Vinicius Portfolio' }
  },
  {
    path: "signup",
    component: SignupComponent,
    data: { title: 'Signup | Vinicius Portfolio' }
  },
  {
    path: "user",
    component: UserComponent,
    data: { title: 'User Profile | Vinicius Portfolio' },
    canActivate: [AuthGuard]
  },
  {
    path: "certificates",
    component: CertificatesComponent,
    data: { title: 'Certificates | Vinicius Portfolio' },
    canActivate: [AuthGuard]  
  },
  {
  path: "forgot-password",
  component: ForgotPasswordComponent,
  data: { title: 'Forgot Password | Vinicius Portfolio' }
  },
  {
  path: 'reset-password',
  component: ResetPasswordComponent,
  data: { title: 'Reset Password | Vinicius Portfolio' }
  }



];
 