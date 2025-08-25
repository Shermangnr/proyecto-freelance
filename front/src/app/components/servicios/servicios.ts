// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';

// @Component({
//   selector: 'app-servicios',
//   standalone: true,
//   imports: [CommonModule, RouterModule],
//   templateUrl: './servicios.html',
//   styleUrl: './servicios.css'
// })
// export class Servicios {
//   constructor() { }
// }

// src/app/components/servicios/servicios.component.ts
import { Component, OnInit, inject } from '@angular/core'; // Importa OnInit, inject
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ServiceService } from '../../services/service-service'; // Importa tu ServiceService
import { Service } from '../../interfaces/service'; // Importa la interfaz Service
import { finalize } from 'rxjs/operators'; // Para manejar el isLoading de forma limpia

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule // Si planeas tener enlaces a detalles de servicio
  ],
  templateUrl: './servicios.html', // Asegúrate que el nombre del archivo HTML sea correcto
  styleUrls: ['./servicios.css']
})
export class Servicios implements OnInit { // Implementa OnInit
  serviceService = inject(ServiceService); // Inyecta el ServiceService

  allServices: Service[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;
  hasNoServices: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.loadAllServices(); // Llama a la función para cargar los servicios al iniciar el componente
  }

  loadAllServices(): void {
    this.isLoading = true; // Establece el estado de carga a true
    this.errorMessage = null; // Resetea cualquier mensaje de error anterior
    this.hasNoServices = false; // Resetea el estado de no servicios

    this.serviceService.getAllServices() // Llama al método para obtener todos los servicios
      .pipe(
        finalize(() => this.isLoading = false) // Detiene el indicador de carga cuando la petición finaliza (éxito o error)
      )
      .subscribe({
        next: (response) => {
          if (response.result === 'Ok' && response.data) {
            this.allServices = response.data;
            if (this.allServices.length === 0) {
              this.hasNoServices = true;
              this.errorMessage = 'No hay servicios disponibles actualmente.';
            }
          } else {
            this.errorMessage = response.message || 'Error al cargar los servicios.';
            this.hasNoServices = true; // Si hay un error, también indica que no hay servicios para mostrar
          }
        },
        error: (error) => {
          console.error('Error al obtener todos los servicios:', error);
          this.errorMessage = 'No se pudieron cargar los servicios. Intenta de nuevo más tarde.';
          this.hasNoServices = true; // En caso de error, no hay servicios que mostrar
        }
      });
  }
}