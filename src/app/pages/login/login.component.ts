import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { FormControl, FormGroup, FormRecord, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { cpfValidator } from '../validators/cpf-validator';

interface LoginForm {
  document: FormControl,
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    DefaultLoginLayoutComponent,
    ReactiveFormsModule,
    PrimaryInputComponent
  ],
  providers:[
    LoginService
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup<LoginForm>;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastrService
  ){

    this.loginForm = new FormGroup({
      document: new FormControl('', [Validators.required, Validators.minLength(11), cpfValidator])
    });
  }

  submit(){

    this.loginService.login(this.loginForm.value.document).subscribe({
      next: () => this.toastService.success("Login feito com sucesso!"),
      error: () => this.toastService.error("Erro inesperado! Tente novamente mais tarde")
    })

    console.log(this.loginForm.value)
  }

  navigate(){
    this.router.navigate(["signup"])
  }
}
