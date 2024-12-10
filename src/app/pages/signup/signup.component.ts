import { Component } from '@angular/core';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { FormControl, FormGroup, FormRecord, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { cpfValidator } from '../validators/cpf-validator';

interface SignUpForm {
  document: FormControl,
  name: FormControl,
  age: FormControl,
  email: FormControl,
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    DefaultLoginLayoutComponent,
    ReactiveFormsModule,
    PrimaryInputComponent
  ],
  providers:[
    LoginService
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signupForm!: FormGroup<SignUpForm>;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastrService
  ){

    this.signupForm = new FormGroup({
      document: new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(11), cpfValidator]),
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      age: new FormControl('', [Validators.required, Validators.minLength(1)]),
      email: new FormControl('', [Validators.required, Validators.email])
    })
  }

  formatCpf(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
  
    value = value.replace(/\D/g, '');
  
    if (value.length > 3) value = value.replace(/^(\d{3})(\d)/, '$1.$2');
    if (value.length > 6) value = value.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    if (value.length > 9) value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
  
    input.value = value;
  
    this.signupForm.get('document')?.setValue(value, { emitEvent: false });
  }

  submit(){

    this.loginService.login(this.signupForm.value.document).subscribe({
      next: () => this.toastService.success("Login feito com sucesso!"),
      error: () => this.toastService.error("Erro inesperado! Tente novamente mais tarde")
    })
  }

  navigate(){
    this.router.navigate(["signup"])
  }  
}
