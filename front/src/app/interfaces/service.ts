// src/app/interfaces/service.ts

/**
 * Interfaz que representa la estructura de un documento de Servicio en tu base de datos.
 * Coincide con tu modelServices.js
 */
export interface Service {
    _id?: string; // El ID generado por MongoDB
    titulo: string;
    descripcion: string;
    precio: number;
    categoria: string;
    etiquetas?: string[]; // Opcional, ya que tiene un default en el modelo
    imagenes?: string[]; // Opcional, ya que tiene un default en el modelo
    usuarioId: string; // El ID del usuario que creó el servicio
    fechaCreacion?: Date; // Opcional, ya que tiene un default en el modelo
    // Otros campos que tu backend pueda devolver (ej. __v)
}

/**
 * Interfaz genérica para una respuesta de la API que contiene un solo objeto Service.
 */
export interface ServiceApiResponse {
    result: string; // 'Ok' o 'Error'
    message?: string; // Mensaje de éxito o error
    data?: Service | string; // El objeto de servicio o el ID del servicio creado/eliminado
}

/**
 * Interfaz genérica para una respuesta de la API que contiene una lista de objetos Service.
 */
export interface ServiceListApiResponse {
    result: string; // 'Ok' o 'Error'
    message?: string; // Mensaje de éxito o error
    data?: Service[]; // Un array de objetos de servicio
}