import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/operators'; 

import { LoginUser } from '../../interfaces/login-user';
import { ApiResponse } from '../../interfaces/api-response';
import { LoginService } from '../../services/login-service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, RouterModule, CommonModule],
  templateUrl: './login.html', 
  styleUrls: ['./login.css']
})

export class Login implements OnInit {
  router = inject(Router);
  loginService: LoginService = inject(LoginService);

  loginForm = new FormGroup({
    correo: new FormControl('', [Validators.required, Validators.email]),
    contrasena: new FormControl('', [Validators.required, Validators.minLength(3)]) 
  });

  // Variables para las alertas visuales en el frontend
  showSendingAlert: boolean = false; // Para el mensaje de "iniciando sesión..."
  showErrorAlert: boolean = false;   // Para mensajes de error
  showWelcomeAlert: boolean = false; // Alerta de Bienvenida 
  errorMessage: string = '';         // Contenido del mensaje de error
  userName: string = '';

  
  constructor(private fb: FormBuilder) {
    // this.loginForm = this.fb.group({
    //   correo: ['', [Validators.required, Validators.email]],
    //   contrasena: ['', [Validators.required, Validators.minLength(3)]]
    // });
  }

  ngOnInit(): void {
    // Lógica para comprobar si el usuario ya está logueado
    if (this.loginService.isLoggedIn()) {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = this.loginService.decodeToken(token);
        if (decoded && decoded.nombre) {
          this.userName = decoded.nombre;
        } else {
          this.userName = 'Usuario';
        }
      }
      this.showWelcomeAlert = true; 

      setTimeout(() => {
        this.showWelcomeAlert = false; 
        this.router.navigateByUrl('/my-services');
      }, 1000);

    }
  }

  handleSubmit(): void {
    // Resetear las alertas al inicio de cada intento de login
    this.showSendingAlert = false;
    this.showErrorAlert = false;
    this.showWelcomeAlert = false;
    this.errorMessage = '';
    this.userName = '';

    // Validar el formulario
    if (this.loginForm.valid) {
      this.showSendingAlert = true; // Mostrar la alerta de "iniciando sesión"

      // Obtener los valores del formulario
      const correo = this.loginForm.value.correo;
      const contrasena = this.loginForm.value.contrasena;

      if (typeof correo === 'string' && typeof contrasena === 'string') {
        const userCredentials: LoginUser = {
          correo, 
          contrasena 
        };

        this.loginService.login(userCredentials)
          .pipe(
            finalize(() => {
              this.showSendingAlert = false;
            })
          )
          .subscribe(
            (response: ApiResponse) => {
              if (response.result === 'Ok') {
                console.log('Login exitoso:', response.message);
                localStorage.setItem('token', response.data); 

                // Decodificar el token para obtener el nombre del usuario
                const decodedToken: any = this.loginService.decodeToken(response.data);
                if (decodedToken && decodedToken.nombre) { 
                  this.userName = decodedToken.nombre; 
                  console.log('Nombre de usuario obtenido del token:', this.userName);
                } else {
                  console.warn('El nombre de usuario no se encontró en el token decodificado.');
                  this.userName = 'Usuario';
                }

                setTimeout(() => {
                  this.showWelcomeAlert = true;

                  setTimeout(() => {
                    this.showWelcomeAlert = false;
                    this.router.navigateByUrl('/my-services');
                  },3000);
                },3000);

                // Opcional: Decodificar el token para obtener el rol y redirigir
                // const decoded: any = this.loginService.decodeToken(response.data);
                // console.log("Token decodificado", decoded);
                // if (decoded.rol === 'admin') {
                //   this.router.navigateByUrl('/admin-panel');
                // } else {
                //   this.router.navigateByUrl('/my-services'); // Redirigir a /my-services para usuarios normales
                // }

              } else {
                setTimeout(() => {
                  this.showErrorAlert = true;
                  this.errorMessage = response.message || 'Credenciales incorrectas. Intenta de nuevo.';
                  console.error('Error en el login (respuesta backend):', response.message);
                }, 2000);
              }
            },
            (error) => {
              setTimeout(() => {
                this.showErrorAlert = true;
                console.error('Error de conexión o API en login:', error);
  
                if (error.status === 401) { 
                  this.errorMessage = 'Correo o contraseña incorrectos.';
                } else if (error.status === 400 && error.error && error.error.message) {
                  this.errorMessage = error.error.message;
                } else {
                  this.errorMessage = 'No se pudo conectar al servidor o hubo un error inesperado. Intenta de nuevo más tarde.';
                }
              }, 2000);
            }
          );
      }
    } else {
      console.log("Formulario inválido.");
      this.loginForm.markAllAsTouched();
      this.showSendingAlert = false; 
      this.showErrorAlert = true;
      this.errorMessage = 'Por favor, introduce un correo y contraseña válidos.';
    }
  }
}