import { HttpClient } from '@angular/common/http';
import { Injectable, } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private readonly API_URL = 'http://localhost:8080/customer';
  private readonly API_URL_EXTRACT = 'http://localhost:8080/transfer/extract/{idAccount}';
  private readonly API_URL_DEBIT = 'http://localhost:8080/transfer/debit';
  private readonly API_URL_CREDIT = 'http://localhost:8080/transfer/credit';

  constructor(private httpClient: HttpClient) { }

  login(document: string): Observable<any> {
    return this.httpClient.get(`${this.API_URL}?document=${document}`);
  }

  createCustomer(customerData: { document: string; name: string; age: number; email: string }): Observable<any> {
    return this.httpClient.post(this.API_URL, customerData);
  }

  performDebit(accountNumber: number, amount: number): Observable<any> {
    const payload = { accountNumber, amount };
    return this.httpClient.post(this.API_URL_DEBIT, payload);
  }

  performCredit(accountNumber: number, amount: number): Observable<any> {
    const payload = { accountNumber, amount };
    return this.httpClient.post(this.API_URL_CREDIT, payload);
  }


  fetchTransactions(idAccount: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.API_URL_EXTRACT}?idAccount=${idAccount}`);
  }
}
