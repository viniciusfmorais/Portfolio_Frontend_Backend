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
    component: LoginComponent
  },
  {
    path: "signup",
    component: SignupComponent
  },
  {
    path: "user",
    component: UserComponent,
    canActivate: [AuthGuard]  
  },
  {
    path: "certificates",
    component: CertificatesComponent,
    canActivate: [AuthGuard]  
  },
  {
  path: "forgot-password",
  component: ForgotPasswordComponent
  },
  {
  path: 'reset-password',
  component: ResetPasswordComponent
  }



];
 