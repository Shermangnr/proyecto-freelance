import bcrypt from "bcryptjs";
import { generarToken, verificarToken } from "../helpers/funciones.js";
import modelUsers from "../models/modelUsers.js";
import { token } from "morgan";

const controllerLogin = {
    iniciarSesion: async(solicitud, respuesta)=>{
        try {
            const {correo, contrasena}= solicitud.body;

            const correoNormalizado = correo.toLowerCase().trim();

            const userFound = await modelUsers.findOne({
                correo: correoNormalizado,
            });

            if (!userFound) {
                return respuesta.status(400).json({ // Status 400 Bad Request es apropiado aquí
                    result: "Error",
                    message: "Correo no encontrado o no está registrado.",
                    data: null,
                });
            }

            const contrasenaValidada = await bcrypt.compare(
                contrasena, //Este es el que ingresa el usuario cuando se loguea
                userFound.contrasena //Validaria la contraseña cifrada almacenada en la Base de datos
            );

            if (contrasenaValidada) {
                const token = await generarToken({
                    id: userFound._id.toString(),
                    nombre: userFound.nombre,
                });
                

                return respuesta.json({
                    result: "Ok",
                    message: "Acceso concedido",
                    token: token,
                    user: {
                        _id: userFound._id,
                        nombre: userFound.nombre,
                        token: token
                    }
                });
            } else {
                return respuesta.json({
                    result: "Error",
                    message: "Acceso denegado, contraseña incorrecta",
                    data: null,
                });
            }

        } catch (error) {
            respuesta.json({
                result: "Error",
                message: "Un error ha ocurrido mientras se iniciaba la sesión, correo no encontrado o no se encuentra registrado.",
                data: error,
            });
        }
    },

    validarToken: async(solicitud, respuesta)=> {
        try {
            const token = solicitud.params.token;
            const decodificado = await verificarToken(token);

            if (decodificado && decodificado.id) {
                respuesta.json({
                    result: "Ok",
                    message: "Token valido",
                    data: decodificado,
                });
            } else {
                respuesta.json({
                    result: "Error",
                    message: "Token Invalido",
                    data: null,
                })
            }

        } catch (error) {
            respuesta.json({
                result: "Error",
                message: "Ha ocurrido un error, Token invalido!",
                data: error,
            });
        }
    }
}

export default controllerLogin;
