import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { BankHomeComponent } from './pages/bank-home/bank-home.component';

export const routes: Routes = [
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "",
    component: SignupComponent
  },
  {
    path: "bank",
    component: BankHomeComponent
  }
];
