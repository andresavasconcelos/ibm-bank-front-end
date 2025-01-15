import { Component } from '@angular/core';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { FormControl, FormGroup,  ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { cpfValidator } from '../validators/cpf-validator';
import { HttpClient } from '@angular/common/http';

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
    private toastService: ToastrService,
    private http: HttpClient
  ){

    this.signupForm = new FormGroup({
      document: new FormControl('', [Validators.required, Validators.minLength(11), cpfValidator]),
      name: new FormControl('', [Validators.required]),
      age: new FormControl('', [Validators.required]),
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

  submit() {
    if (this.signupForm.valid) {

      const cleanedDocument = this.signupForm.get('document')!.value!.replace(/\D/g, '');

      const customerData = {
        document: cleanedDocument as string,
        name: this.signupForm.get('name')!.value as string,
        age: this.signupForm.get('age')!.value as number,
        email: this.signupForm.get('email')!.value as string,
      };

      this.loginService.createCustomer(customerData).subscribe({
        next: () => this.getCustomer(),
        error: (err) => {
          if (err.error?.message === 'customer already exist') {
            this.toastService.warning('Cliente já cadastrado. Verifique os dados e tente novamente.');
          } else {
            this.toastService.error('Erro ao realizar o cadastro! Tente novamente.');
          }
        },
      });
    } else {
      this.toastService.warning('Por favor, preencha todos os campos corretamente.');
    }
  }

  getCustomer() {
    const document = this.signupForm.value.document.replace(/\D/g, '');

    this.loginService.login(document).subscribe({
      next: (response) => {
        const { name, accounts } = response;

        if (accounts && accounts.length > 0) {
          const idAccount = accounts[0].id;
          const balance = accounts[0].balance;
          const numberAccount = accounts[0].numberAccount;

          this.router.navigate(['bank'], { queryParams: { name, balance, numberAccount, idAccount } });
        } else {
          this.toastService.error("Nenhuma conta vinculada a este CPF.");
        }
      },
      error: () => {
        this.toastService.error("Erro ao realizar login. Tente novamente mais tarde.");
      }
    });
  }

  navigate(){
    this.router.navigate(['login'])
  }
}
