import { Component } from '@angular/core';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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

  formatCpf(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    value = value.replace(/\D/g, '');

    if (value.length > 3) value = value.replace(/^(\d{3})(\d)/, '$1.$2');
    if (value.length > 6) value = value.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    if (value.length > 9) value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');

    input.value = value;

    this.loginForm.get('document')?.setValue(value, { emitEvent: false });
  }

  submit() {
    const document = this.loginForm.value.document.replace(/\D/g, '');

    this.loginService.login(document).subscribe({
      next: (response) => {
        const { name, accounts } = response;

        if (accounts && accounts.length > 0) {
          const balance = accounts[0].balance;
          const numberAccount = accounts[0].numberAccount;
          const idAccount = accounts[0].id;

          console.log("numberAccount " + numberAccount)
          console.log("idAccount " + idAccount)
          console.log("accounts " + accounts)

          this.router.navigate(['bank'], { queryParams: { name, balance, numberAccount, idAccount} });
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
    this.router.navigate([''])
  }
}
