import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterUser } from '../interfaces/register-user';
import { ApiResponse } from '../interfaces/api-response';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private http = inject(HttpClient);

  private API_URL = 'http://localhost:3000/usuarios';

  constructor() {
    
  }
  
  createUser(userData: RegisterUser): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.API_URL, userData);
  }
}
