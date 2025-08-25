// // src/app/services/service.service.ts
// import { Injectable, inject, PLATFORM_ID } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { isPlatformBrowser } from '@angular/common'; // Importa isPlatformBrowser

// // Importa las interfaces que definiremos a continuación
// import { Service, ServiceApiResponse, ServiceListApiResponse } from '../interfaces/service';

// @Injectable({
//   providedIn: 'root'
// })
// export class ServiceService {
//   private http = inject(HttpClient);
//   private platformId = inject(PLATFORM_ID); // Inyecta PLATFORM_ID
//   private API_URL = 'http://localhost:3000/api/services'; // Asegúrate de que esta sea la URL correcta de tu backend

//   constructor() { }

//   // Método auxiliar para obtener el token del localStorage de forma segura en el navegador
//   private getToken(): string | null {
//     if (isPlatformBrowser(this.platformId)) {
//       return localStorage.getItem('token');
//     }
//     return null;
//   }

//   // Método auxiliar para crear HttpHeaders con el token de autorización
//   private getAuthHeaders(): HttpHeaders {
//     let headers = new HttpHeaders();
//     const token = this.getToken();
//     if (token) {
//       headers = headers.set('Authorization', `Bearer ${token}`);
//     }
//     return headers;
//   }

//   /**
//    * Crea un nuevo servicio.
//    * @param serviceData FormData que contiene los campos del servicio y la imagen.
//    * @returns Un Observable con la respuesta de la API.
//    */
//   createService(serviceData: FormData): Observable<ServiceApiResponse> {
//     const headers = this.getAuthHeaders(); // Se requieren headers de autorización
//     return this.http.post<ServiceApiResponse>(`${this.API_URL}/create`, serviceData, { headers });
//   }

//   /**
//    * Obtiene un servicio por su ID.
//    * @param id El ID del servicio.
//    * @returns Un Observable con la respuesta de la API.
//    */
//   getServiceById(id: string): Observable<ServiceApiResponse> {
//     // Dependiendo de tu backend, esta ruta podría requerir autenticación o ser pública
//     const headers = this.getAuthHeaders();
//     return this.http.get<ServiceApiResponse>(`${this.API_URL}/read/${id}`, { headers });
//   }

//   /**
//    * Obtiene todos los servicios disponibles (generalmente una vista pública).
//    * @returns Un Observable con la lista de servicios.
//    */
//   getAllServices(): Observable<ServiceListApiResponse> {
//     return this.http.get<ServiceListApiResponse>(`${this.API_URL}/read-all`);
//   }

//   /**
//    * Obtiene los servicios creados por el usuario actualmente autenticado.
//    * @returns Un Observable con la lista de servicios del usuario.
//    */
//   getMyServices(): Observable<ServiceListApiResponse> {
//     const headers = this.getAuthHeaders(); // Esta ruta SÍ requiere autenticación
//     return this.http.get<ServiceListApiResponse>(`${this.API_URL}/read-my-services`, { headers });
//   }

//   /**
//    * Actualiza un servicio existente por su ID.
//    * @param id El ID del servicio a actualizar.
//    * @param serviceData FormData con los datos actualizados y/o la nueva imagen.
//    * @returns Un Observable con la respuesta de la API.
//    */
//   updateService(id: string, serviceData: FormData): Observable<ServiceApiResponse> {
//     const headers = this.getAuthHeaders(); // Se requieren headers de autorización
//     return this.http.put<ServiceApiResponse>(`${this.API_URL}/update/${id}`, serviceData, { headers });
//   }

//   /**
//    * Elimina un servicio por su ID.
//    * @param id El ID del servicio a eliminar.
//    * @returns Un Observable con la respuesta de la API.
//    */
//   deleteService(id: string): Observable<ServiceApiResponse> {
//     const headers = this.getAuthHeaders(); // Se requieren headers de autorización
//     return this.http.delete<ServiceApiResponse>(`${this.API_URL}/delete/${id}`, { headers });
//   }
// }

// src/app/services/service-service.ts
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common'; // Importa isPlatformBrowser

// Importa las interfaces que definiremos a continuación
import { Service, ServiceApiResponse, ServiceListApiResponse } from '../interfaces/service';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID); // Inyecta PLATFORM_ID
  private API_URL = 'http://3.94.208.93:3000/api/services'; // Asegúrate de que esta sea la URL correcta de tu backend

  constructor() { }

  // Método auxiliar para obtener el token del localStorage de forma segura en el navegador
  private getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  // Método auxiliar para crear HttpHeaders con el token de autorización
  private getAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const token = this.getToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  /**
   * Crea un nuevo servicio.
   * @param serviceData FormData que contiene los campos del servicio y la imagen.
   * @returns Un Observable con la respuesta de la API.
   */
  createService(serviceData: FormData): Observable<ServiceApiResponse> {
    const headers = this.getAuthHeaders(); // Se requieren headers de autorización
    // Tu routerServices.js tiene '/create' para POST
    return this.http.post<ServiceApiResponse>(`${this.API_URL}/create`, serviceData, { headers });
  }

  /**
   * Obtiene un servicio por su ID.
   * @param id El ID del servicio.
   * @returns Un Observable con la respuesta de la API.
   */
  getServiceById(id: string): Observable<ServiceApiResponse> {
    // routerServices.js tiene GET /:id
    // Dependiendo de tu backend, esta ruta podría requerir autenticación o ser pública
    // Actualmente, en tu routerServices.js, es pública.
    return this.http.get<ServiceApiResponse>(`${this.API_URL}/${id}`);
  }

  /**
   * Obtiene todos los servicios disponibles (generalmente una vista pública).
   * @returns Un Observable con la lista de servicios.
   */
  getAllServices(): Observable<ServiceListApiResponse> {
    // routerServices.js tiene GET / para leerTodosServicios
    return this.http.get<ServiceListApiResponse>(this.API_URL);
  }

  /**
   * Obtiene los servicios creados por el usuario actualmente autenticado.
   * @returns Un Observable con la lista de servicios del usuario.
   */
  getMyServices(): Observable<ServiceListApiResponse> {
    const headers = this.getAuthHeaders(); // Esta ruta SÍ requiere autenticación
    // Tu routerServices.js tiene '/read-my-services' para GET
    return this.http.get<ServiceListApiResponse>(`${this.API_URL}/read-my-services`, { headers });
  }

  /**
   * Actualiza un servicio existente por su ID.
   * @param id El ID del servicio a actualizar.
   * @param serviceData FormData con los datos actualizados y/o la nueva imagen.
   * @returns Un Observable con la respuesta de la API.
   */
  updateService(id: string, serviceData: FormData): Observable<ServiceApiResponse> {
    const headers = this.getAuthHeaders(); // Se requieren headers de autorización
    // routerServices.js tiene PUT /:id
    return this.http.put<ServiceApiResponse>(`${this.API_URL}/${id}`, serviceData, { headers });
  }

  /**
   * Elimina un servicio por su ID.
   * @param id El ID del servicio a eliminar.
   * @returns Un Observable con la respuesta de la API.
   */
  deleteService(id: string): Observable<ServiceApiResponse> {
    const headers = this.getAuthHeaders(); // Se requieren headers de autorización
    // routerServices.js tiene DELETE /:id
    return this.http.delete<ServiceApiResponse>(`${this.API_URL}/${id}`, { headers });
  }
}