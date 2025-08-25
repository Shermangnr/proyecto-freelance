import { uploadSingleImage } from "../../middlewares/upload.js";
import fs from 'fs';
import path from "path";
import modelServices from "../models/modelServices.js";
import { error } from "console";


const controllerServices = {
    //Crear un nuevo servicio (añadir)
    // crearServicio: async(solicitud, respuesta)=> {
    //     try {
    //         uploadSingleImage(solicitud, respuesta, async(error)=>{
    //             if (error) {
    //                 respuesta.json({
    //                     result: 'Error',
    //                     message: 'Un error ha ocurrido mientras se cargaba la imagen',
    //                     data: error,
    //                 });
    //             }
    //             const nuevoServicio = new modelServices({
    //                 titulo: solicitud.body.titulo,
    //                 descripcion: solicitud.body.descripcion,
    //                 precio: solicitud.body.precio,
    //                 categoria: solicitud.body.categoria,
    //                 etiquetas: solicitud.body.etiquetas,
    //                 imagenes: solicitud.file ? [solicitud.file.filename] : [],
    //                 usuarioId: solicitud.body.usuarioId,
    //             });
    //             const savedServices = await nuevoServicio.save();
    //             respuesta.json({
    //                 result: 'Ok',
    //                 message: 'El servicio se ha creado exitosamente',
    //                 data: savedServices._id
    //             });
    //         });
    //     } catch (error) {
    //         respuesta.json({
    //             result: 'Error',
    //             message: 'Un error ha ocurrido mientras se creaba el servicio'
    //         });
    //     }
    // },


    crearServicio: async(solicitud, respuesta)=> {
        try {
            console.log('Controlador crearServicio: solicitud.user al inicio:', solicitud.user);
            const userId = solicitud.user.id; // <-- ¡OBTÉN EL ID DEL USUARIO DEL TOKEN AUTENTICADO!

            if (!userId) { // Una pequeña verificación de seguridad adicional
                return respuesta.status(401).json({
                    result: 'Error',
                    message: 'No autorizado: ID de usuario no disponible en la solicitud autenticada.',
                });
            }

            uploadSingleImage(solicitud, respuesta, async(error)=>{
                if (error) {
                    respuesta.json({
                        result: 'Error',
                        message: 'Un error ha ocurrido mientras se cargaba la imagen',
                        data: error,
                    });
                }
                const nuevoServicio = new modelServices({
                    titulo: solicitud.body.titulo,
                    descripcion: solicitud.body.descripcion,
                    precio: solicitud.body.precio,
                    categoria: solicitud.body.categoria,
                    etiquetas: solicitud.body.etiquetas,
                    imagenes: solicitud.file ? [solicitud.file.filename] : [],
                    usuarioId: userId, // <-- ¡USA EL userId OBTENIDO DEL TOKEN AQUÍ!
                });
                const savedServices = await nuevoServicio.save();
                respuesta.json({
                    result: 'Ok',
                    message: 'El servicio se ha creado exitosamente',
                    data: savedServices._id
                });
            });
        } catch (error) {
            console.error('Error al crear servicio:', error); // Para depuración
            respuesta.status(500).json({ // 500 Internal Server Error
                result: 'Error',
                message: 'Un error ha ocurrido mientras se creaba el servicio',
                data: error.message, // Mensaje de error para depuración
            });
        }
    },

    // Leer un servicio por ID
    leerServicio: async(solicitud, respuesta)=> {
        try {
            const serviceFound = await modelServices.findById(solicitud.params.id);
            if (serviceFound._id) {
                respuesta.json({
                    result: 'Ok',
                    message: 'Servicio encontrado',
                    data: serviceFound,
                });
            }
        } catch (error) {
            respuesta.json({
                result: 'Error',
                message: 'Un error ha ocurrido mientras se buscaba el servicio',
            });
        }
    },

    // Leer todos los servicios creados
    leerTodosServicios: async(solicitud, respuesta)=> {
        try {
            const allServiceFound = await modelServices.find().populate('usuarioId', 'nombre').lean(); // Asegúrate de que 'usuarioId' es el campo correcto en tu modelo
            respuesta.json({
                result: 'Ok',
                message: 'Todos los servicios se han encontrado',
                data: allServiceFound,
            });
        } catch (error) {
            respuesta.json({
                result: 'Error',
                message: 'Un error ha ocurrido mientras se buscaban todos los usuarios',
                data: error,
            });
        }
    },

    /**
     * @description Lee los servicios creados por el usuario autenticado.
     * @route GET /api/services/read-my-services
     * @access Private (requiere autenticación)
     */
    leerMisServicios: async (solicitud, respuesta) => {
        try {
            // **IMPORTANTE**: 'solicitud.user.id' proviene del middleware de autenticación
            // que decodifica el token JWT y adjunta el ID del usuario a la solicitud.
            const userId = solicitud.user.id;

            if (!userId) {
                return respuesta.status(401).json({
                    result: 'Error',
                    message: 'No autorizado: ID de usuario no proporcionado en la solicitud.',
                });
            }

            const myServices = await modelServices.find({ usuarioId: userId }).populate('usuarioId', 'nombre').lean();

            respuesta.json({
                result: 'Ok',
                message: 'Servicios del usuario encontrados exitosamente.',
                data: myServices,
            });
        } catch (error) {
            console.error('Error al leer los servicios del usuario:', error);
            respuesta.status(500).json({
                result: 'Error',
                message: 'Ha ocurrido un error al buscar tus servicios.',
                data: error.message, // Proporciona el mensaje del error para depuración
            });
        }
    },

    //Actualizar un servicio por ID
    actualizarServicio: async (solicitud, respuesta)=> {
        try {
            uploadSingleImage(solicitud, respuesta, async(error)=>{
                if (error) {
                    respuesta.json({
                        result: 'Error',
                        message: 'Error durante la carga de imagen en la actualizacion',
                        data: error
                    });
                }

                const servicioExistente = await modelServices.findById(solicitud.params.id);
                if (!servicioExistente) {
                    return respuesta.status(404).json({
                        result: 'Error',
                        message: 'El servicio no se ha encontrado',
                        data: null
                    });
                }

                if (solicitud.file) {
                    const rutaImagenAntigua = path.join('images', servicioExistente.image);
                    if (fs.existsSync(rutaImagenAntigua)) {
                        fs.unlinkSync(rutaImagenAntigua);
                    }
                }

                const nuevosDatos = {
                    titulo: solicitud.body.titulo,
                    descripcion: solicitud.body.descripcion,
                    precio: solicitud.body.precio,
                    categoria: solicitud.body.categoria,
                    etiquetas: solicitud.body.etiquetas,
                    imagenes: solicitud.file ? [solicitud.file.filename] : servicioExistente.imagenes,
                    usuarioId: solicitud.body.usuarioId,
                }

                const servicioActualizado = await modelServices.findByIdAndUpdate(solicitud.params.id, nuevosDatos, {new: true});
                respuesta.json({
                    result: 'Ok',
                    message: 'El servicio se ha actualizado correctamente',
                    data: servicioActualizado,
                });
            });
        } catch (error) {
            respuesta.json({
                result: 'Error',
                message: 'Un error ha ocurrido mientras se actualizaba el producto',
                data: error,
            });
        }
    },

    // Eliminar un servicio por ID
    eliminarServicio: async (solicitud, respuesta)=> {
        try {
            const serviceDelete = await modelServices.findByIdAndDelete(solicitud.params.id);
            if (serviceDelete) {
                // Si el servicio fue eliminado, elimina tambien la imagen del sistema existente
                if (serviceDelete.imagenes.length > 0) {
                    const rutaImagen = path.join('images', serviceDelete.imagenes[0]);
                    if (fs.existsSync(rutaImagen)) {
                        fs.unlinkSync(rutaImagen);
                    }
                }
                respuesta.json({
                    result: 'Ok',
                    message: 'El servicio se ha eliminado con exito',
                    data: serviceDelete._id,
                });
            } else {
                respuesta.status(404).json({
                    result: 'Error',
                    message: 'El servicio no fue encontrado',
                    data: error,
                });
            }
        } catch (error) {
            respuesta.json({
                result: 'Error',
                message: 'Un error ha ocurrido mientras se eliminaban los servicios',
                data: error,
            })
        }
    }
}

export default controllerServices;