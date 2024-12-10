import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bank-home',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './bank-home.component.html',
  styleUrl: './bank-home.component.scss'
})
export class BankHomeComponent {
  logoUrl = '../../../assets/logo-white.png'; 
  balance = 5000.00;
  depositAmount: number | null = null;
  transferAmount: number | null = null;
  @Input() name: string = "Fulana";
  @Input() accountId: number = 1002;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchAccountBalance(this.accountId);
  }

  fetchAccountBalance(accountId: number): void {
    const endpoint = `http://localhost:8080/account/find/${accountId}`;
    
    this.http.get<{ balance: number }>(endpoint).subscribe({
      next: (response) => {
        
        console.log("response: ", response); 
        
        this.balance = response.balance; 
      },
      error: (err) => {
        console.error('Erro ao buscar o saldo:', err);
        alert('Erro ao carregar o saldo.');
      }
    });
  }

  get formattedBalance(): string {
    return this.balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  performTransaction(type: 'deposit' | 'transfer'): void {
    const endpoint = type === 'deposit' 
      ? 'http://localhost:8080/transfer/debit' 
      : 'http://localhost:8080/transfer/credit';

    const payload = {
      id: type === 'deposit', 
      amount: type === 'deposit' ? this.depositAmount : this.transferAmount,
    };

    this.http.post(endpoint, payload).subscribe({
      next: () => {
        alert(`${type === 'deposit' ? 'Depósito' : 'Transferência'} realizado com sucesso!`);
        if (type === 'deposit') {
          this.balance += payload.amount ?? 0;
        } else {
          this.balance -= payload.amount ?? 0;
        }
        this.clearInputs(type);
      },
      error: (err) => {
        console.error('Erro na transação:', err);
        alert(`Erro ao realizar ${type === 'deposit' ? 'depósito' : 'transferência'}.`);
      }
    });
  }

  clearInputs(type: 'deposit' | 'transfer'): void {
    if (type === 'deposit') {
      this.depositAmount = null;
    } else {
      this.transferAmount = null;
    }
  }
}
