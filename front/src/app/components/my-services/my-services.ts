import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core'; // Importa PLATFORM_ID
import { CommonModule, isPlatformBrowser } from '@angular/common'; // Importa isPlatformBrowser
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ServiceService } from '../../services/service-service';
import { LoginService } from '../../services/login-service';
import { Service, ServiceApiResponse } from '../../interfaces/service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-my-services',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './my-services.html',
  styleUrls: ['./my-services.css']
})
export class MyServices implements OnInit {

  router = inject(Router);
  serviceService = inject(ServiceService);
  loginService = inject(LoginService);
  fb = inject(FormBuilder);
  private platformId = inject(PLATFORM_ID);

  myServices: Service[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;
  userId: string | null = null;

  hasNoServices: boolean = false;

  showCreateForm: boolean = false;
  serviceForm: FormGroup;
  selectedFile: File | null = null;
  isSubmittingForm: boolean = false;
  formSuccessMessage: string | null = null;
  formErrorMessage: string | null = null;

  constructor() {
    this.serviceForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0.01)]],
      categoria: ['', Validators.required],
      etiquetas: [''],
      imagen: [null]
    });
  }

  ngOnInit(): void {
    // Solo intenta obtener el ID del usuario y cargar servicios si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      this.getUserIdFromToken();
      if (this.userId) {
        this.loadMyServices();
      } else {
        this.errorMessage = 'No se pudo obtener el ID del usuario. Por favor, inicia sesión de nuevo.';
        this.isLoading = false;
      }
    } else {
      // Si no estamos en el navegador (SSR), no intentes acceder a localStorage
      this.errorMessage = 'No se puede cargar el ID de usuario en este entorno (SSR).';
      this.isLoading = false;
    }
  }

  getUserIdFromToken(): void {
    // Accede a localStorage solo si isPlatformBrowser es verdadero
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken: any = this.loginService.decodeToken(token);
        if (decodedToken && decodedToken._id) {
          this.userId = decodedToken._id;
        }
      }
    }
  }


  loadMyServices(): void {
    this.isLoading = true; // Activa el estado de carga
    this.errorMessage = null; // Limpia cualquier mensaje de error previo
    this.hasNoServices = false; // Restablece el estado de no servicios

    this.serviceService.getMyServices().pipe(
      finalize(() => this.isLoading = false) // Esto asegura que isLoading siempre se ponga en false al finalizar (éxito o error)
    ).subscribe({
      next: (response) => {
        if (response.result === 'Ok' && response.data) {
          this.myServices = response.data as Service[];
          // Comprueba si la lista de servicios está vacía
          if (this.myServices.length === 0) {
            this.hasNoServices = true;
            this.errorMessage = 'Aún no tienes servicios creados. ¡Crea uno ahora!';
          } else {
            this.hasNoServices = false;
          }
        } else {
          // Si el resultado no es 'Ok' pero no hay un error HTTP, es un error lógico del backend
          this.errorMessage = response.message || 'No se pudieron cargar tus servicios.';
          this.myServices = []; // Asegura que la lista esté vacía en caso de error
          this.hasNoServices = true; // No hay servicios si hubo un error en la respuesta
        }
      },
      error: (error) => {
        // Manejo de errores de la solicitud HTTP
        console.error('Error al cargar mis servicios:', error);
        this.errorMessage = 'Hubo un error al conectar con el servidor para cargar tus servicios. Por favor, inténtalo de nuevo más tarde.';
        this.myServices = []; // Asegura que la lista esté vacía en caso de error
        this.hasNoServices = true; // No hay servicios si hubo un error de conexión
      }
    });
  }

  createNewService(): void {
    this.showCreateForm = true;
    this.serviceForm.reset();
    this.selectedFile = null;
    this.formSuccessMessage = null;
    this.formErrorMessage = null;
  }

  cancelCreateService(): void {
    this.showCreateForm = false;
    this.serviceForm.reset();
    this.selectedFile = null;
    this.formSuccessMessage = null;
    this.formErrorMessage = null;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  onSubmitCreateService(): void {
    this.isSubmittingForm = true;
    this.formSuccessMessage = null;
    this.formErrorMessage = null;

    if (this.serviceForm.invalid) {
      this.formErrorMessage = 'Por favor, completa todos los campos requeridos correctamente.';
      this.isSubmittingForm = false;
      return;
    }

    if (!this.userId) {
      this.formErrorMessage = 'No se pudo obtener el ID de usuario. Por favor, inicia sesión de nuevo.';
      this.isSubmittingForm = false;
      return;
    }

    const formData = new FormData();
    formData.append('titulo', this.serviceForm.get('titulo')?.value);
    formData.append('descripcion', this.serviceForm.get('descripcion')?.value);
    formData.append('precio', this.serviceForm.get('precio')?.value);
    formData.append('categoria', this.serviceForm.get('categoria')?.value);

    const etiquetas = this.serviceForm.get('etiquetas')?.value;
    if (etiquetas) {
      const etiquetasArray = etiquetas.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0);
      etiquetasArray.forEach((tag: string) => formData.append('etiquetas[]', tag));
    }

    if (this.selectedFile) {
      formData.append('imagen', this.selectedFile, this.selectedFile.name);
    }

    formData.append('usuarioId', this.userId);

    this.serviceService.createService(formData).pipe(
      finalize(() => this.isSubmittingForm = false)
    ).subscribe({
      next: (response: ServiceApiResponse) => {
        if (response.result === 'Ok') {
          this.formSuccessMessage = response.message || 'Servicio creado con éxito!';
          this.serviceForm.reset();
          this.selectedFile = null;
          this.loadMyServices();

          setTimeout(() => {
            this.showCreateForm = false;
            this.formSuccessMessage = null;
          }, 2000);

        } else {
          this.formErrorMessage = response.message || 'Error al crear el servicio.';
        }
      },
      error: (error) => {
        console.error('Error al enviar el servicio:', error);
        this.formErrorMessage = 'Hubo un error al conectar con el servidor para crear el servicio.';
      }
    });
  }

  editService(serviceId: string): void {
    console.log(`Editar servicio con ID: ${serviceId}`);
  }

  deleteService(serviceId: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este servicio? Esta acción no se puede deshacer.')) {
      this.isLoading = true;
      this.serviceService.deleteService(serviceId).pipe(
        finalize(() => this.isLoading = false)
      ).subscribe({
        next: (response) => {
          if (response.result === 'Ok') {
            console.log('Servicio eliminado con éxito:', serviceId);
            this.loadMyServices();
          } else {
            this.errorMessage = response.message || 'Error al eliminar el servicio.';
          }
        },
        error: (error) => {
          console.error('Error al eliminar servicio:', error);
          this.errorMessage = 'Hubo un error al conectar con el servidor para eliminar el servicio.';
        }
      });
    }
  }
}