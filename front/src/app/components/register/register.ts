import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { RegisterUser } from '../../interfaces/register-user';
import { RegisterService } from '../../services/register-service';
import { ApiResponse } from '../../interfaces/api-response'; 
import { finalize } from 'rxjs/operators';

// Validador personalizado para confirmar contraseñas
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('contrasena');
  const confirmPassword = control.get('confirmContrasena');

  if (!password || !confirmPassword) {
    return null;
  }
  return password.value === confirmPassword.value ? null : { mismatch: true };
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register implements OnInit {
  router = inject(Router);
  registerService: RegisterService = inject(RegisterService);

  registerForm: FormGroup;
  showSendingAlert: boolean = false; 
  showSuccessAlert: boolean = false; 
  showErrorAlert: boolean = false;   
  errorMessage: string = '';

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(3)]], 
      confirmContrasena: ['', Validators.required]
    }, {
      validators: passwordMatchValidator
    });
  }

  ngOnInit(): void { }

  handleSubmit(): void {
    this.showSuccessAlert = false;
    this.showErrorAlert = false;
    this.errorMessage = '';

    if (this.registerForm.valid) {
      this.showSendingAlert = true;

      const { nombre, correo, contrasena } = this.registerForm.value; 

      const newUser: RegisterUser = {
        nombre: nombre as string, 
        correo: correo as string,
        contrasena: contrasena as string
      };

      this.registerService.createUser(newUser)
        .pipe(
          finalize(() => {
            this.showSendingAlert = false; 
          })
        )
        .subscribe(
          (response: ApiResponse) => {
            if (response.result === 'Ok') {
              this.showSuccessAlert = true; 
              this.registerForm.reset(); 
              Object.keys(this.registerForm.controls).forEach(key => {
                this.registerForm.get(key)?.setErrors(null);
              });

              setTimeout(() => {
                this.router.navigateByUrl('/login');
              }, 5000);

            } else {
              this.showErrorAlert = true; 
              this.errorMessage = response.message || 'Ocurrió un error al registrar el usuario.';
              console.error('Error en el registro:', response.message);
            }
          },
          (error) => {
            // ¡ESTE ES EL BLOQUE QUE SE EJECUTA CUANDO EL STATUS ES 400!
            
            setTimeout(() => {
              this.showErrorAlert = true; 
              console.error('Error de conexión o API:', error);
              
              // Intenta obtener el mensaje de error del backend
              if (error.error && error.error.message) {
              // Si el backend envía un mensaje de error específico en el cuerpo de la respuesta
                this.errorMessage = error.error.message;
              } else if (error.status === 400) { // Manejo explícito del status 400
                // Tu backend envía 400. Si no hay error.error.message, usa un default
                this.errorMessage = 'Ha ocurrido un error en la solicitud. Por favor, revisa tus datos.';
            } else if (error.status === 409) { // Conflicto: Posiblemente "usuario ya registrado" (aunque tu backend usa 400)
              this.errorMessage = 'Este correo ya se encuentra registrado. Por favor, inicia sesión o usa otro correo.';
            } else {
                // Mensaje genérico para otros tipos de errores (ej. 500, problemas de red)
              this.errorMessage = 'No se pudo conectar al servidor. Intenta de nuevo más tarde.';
            }

            }, 3000);
          }
        );

    } else {
      console.log('Formulario inválido. Por favor, revisa los campos.');
      this.registerForm.markAllAsTouched();
      this.showSendingAlert = false;
      this.showSuccessAlert = false;
      this.showErrorAlert = true;
      this.errorMessage = 'Por favor, completa todos los campos requeridos y asegúrate de que sean válidos.';
    }
  }
}