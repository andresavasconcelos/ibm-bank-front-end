import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bank-home',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  providers:[
    LoginService
  ],
  templateUrl: './bank-home.component.html',
  styleUrl: './bank-home.component.scss'
})
export class BankHomeComponent implements OnInit  {
  logoUrl = '../../../assets/logo-white.png';
  debtAmount: number | null = null;
  creditAmount: number | null = null;

  name: string = '';
  balance: number = 0;
  numberAccount: number = 0;
  idAccount: number = 0;
  transactions: any[] = [];
  loadingTransactions = false;

  constructor(
    private http: ActivatedRoute,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
      this.http.queryParams.subscribe(params => {
        this.name = params['name'] || 'Name';
        this.balance = +params['balance'] || 0;
        this.numberAccount = +params['numberAccount'] || 0;
        this.idAccount = +params['idAccount'] || 0;

        this.fetchExtract()
      });
  }

  get formattedBalance(): string {
    return this.balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  performTransaction(type: 'debit' | 'credit', amount: number): void {

    if (amount === null || amount <= 0) {
      alert('Não há valor a ser debitado.');
      return;
    }

    if (amount && amount > 0) {
      const accountNumber = this.numberAccount;

      if (type === 'debit') {

        this.loginService.performDebit(accountNumber, amount).subscribe({
          next: (response) => {
            this.balance -= amount;
            alert('Débito realizado com sucesso!');
            this.clearInputs('deposit');
            this.fetchExtract()
          },
          error: (err) => {
            console.error('Erro ao realizar débito:', err);
            alert('Erro ao realizar débito. Tente novamente.');
          }
        });
      } else if (type === 'credit') {

        this.loginService.performCredit(accountNumber, amount).subscribe({
          next: (response) => {
            this.balance += amount;
            alert('Crédito realizado com sucesso!');
            this.clearInputs('transfer');
            this.fetchExtract()
          },
          error: (err) => {
            console.error('Erro ao realizar crédito:', err);
            alert('Erro ao realizar crédito. Tente novamente.');
          }
        });
      }
    } else {
      alert('Valor inválido para a transação.');
    }
  }

  clearInputs(type: 'deposit' | 'transfer'): void {
    if (type === 'deposit') {
      this.debtAmount = null;
    } else {
      this.creditAmount = null;
    }
  }

  fetchExtract(): void {
    if (!this.idAccount) {
      // alert('ID da conta é inválido.');
      return;
    }

    this.loginService.fetchTransactions(this.idAccount).subscribe({
      next: (response) => {

        this.transactions = response;
        this.loadingTransactions = false;
      },
      error: (err) => {
        console.error('Erro ao buscar o extrato:', err);
        alert('Erro ao buscar o extrato. Tente novamente.');
        this.loadingTransactions = false;
      }
    });
  }
}
