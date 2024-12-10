import { HttpClient } from '@angular/common/http';
import { Injectable, } from '@angular/core';
import { LoginResponse, } from '../types/login-response';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  apiUrl: string = "http://localhost:8080/customer/create"

  constructor(private httpClient: HttpClient) { }

  login(id: string){
    return this.httpClient.post<LoginResponse>(this.apiUrl, { id }).pipe(
      tap((value) => {
            sessionStorage.setItem("name", value.name)
      })
    )
  }
}
