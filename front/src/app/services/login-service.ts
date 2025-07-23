import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
// import { Credential } from '../interfaces/credential';
import { Observable } from 'rxjs';
import { LoginUser } from '../interfaces/login-user';
import { ApiResponse } from '../interfaces/api-response';

import jwt_decode from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private API_URL = 'http://localhost:3000/inicio-sesion'; 

  constructor() {
    
  }

  
  login(userCredentials: LoginUser): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.API_URL, userCredentials);
  }

  decodeToken(token: string): any {
    try {
      if (isPlatformBrowser(this.platformId)) {
        return jwt_decode(token);
      }
      return null;
    } catch (Error) {
      console.error('Error decodificando el token:', Error);
      return null;
    }
  }

  // Metodo para verificar si el usuario esta logueado.
  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = this.decodeToken(token);
        return !!decoded;
      }
    }
    return false; 
  }

  // Obtener el nombre de usuario del token
  getUserName(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded: any = this.decodeToken(token);
        return decoded && decoded.nombre ? decoded.nombre : null;
      }
    }
    return null; 
  }

  // Método para cerrar sesión
  logout(): void {
    // Solo acceder a localStorage si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
  }

}