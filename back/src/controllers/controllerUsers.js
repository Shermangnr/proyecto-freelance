import bcrypt from "bcryptjs"; // Encriptacion de contraseña
import modelUsers from "../models/modelUsers.js"; // Controlar el esquema de usuarios o hacer uso del esquema
import crypto from 'crypto';
// import nodemailer from 'nodemailer';
import { model } from "mongoose";
import { text } from "stream/consumers";

const controllerUsers = {
    createUser: async(solicitud , respuesta)=> {
        try {
            const {name, email, password} = solicitud.body;
            console.log(solicitud.body);
            const passwordProtected = await bcrypt.hash(password, 10);
            const newUser = new modelUsers({
                name,
                email,
                password: passwordProtected,
            });
            console.log(newUser);

        const userCreate = await newUser.save();
        if(userCreate._id){
            respuesta.json({
                result: 'Ok',
                message: '¡El usuario se ha creado con exito!',
                data: userCreate._id,
            });
        }
        } catch (error) {
            respuesta.json({
                result: 'Error',
                message: 'Un error ha ocurrido mientras se creaba el usuario.',
                data: error,
            });
        }
    },

    readUser: async(solicitud, respuesta)=> {
        try {
            const userFound = await modelUsers.findById(
                solicitud.params.id
            );
            if (userFound._id) {
                respuesta.json({
                    result: 'Ok',
                    message: 'Usuario encontrado',
                    data: userFound,
                });
            }
        } catch (error) {
            respuesta.json({
                result: 'Error',
                message: 'Un error ha ocurrido mientras se buscaba el usuario',
                data: error,
            });
        }
    },

    readUserAll: async(solicitud, respuesta)=> {
        try {
            const allUsersFound = await modelUsers.find();
            respuesta.json({
                result: 'Ok',
                message: 'Todos los usuarios se han encotrado',
                data: allUsersFound,
            });
        } catch (error) {
            respuesta.json({
                result: 'Error',
                message: 'Un error ha ocurrido mientras se buscaban todos los usuarios',
                data: error,
            });
        }
    },
    
    updateUser: async (solicitud, respuesta) => {
        try {
            const userUpdate = await modelUsers.findByIdAndUpdate(
                solicitud.params.id,
                solicitud.body
            );
            if (userUpdate._id) {
                respuesta.json({
                    result: 'Ok',
                    message: 'El usuario se ha actualizado',
                    data: userUpdate._id,
            });
            }
        } catch (error) {
            respuesta.json({
                result: 'Error',
                message: 'Un error ha ocurrido mientras se actualizaba el usuario',
                data: error,
            });
        }
    },

    deleteUser: async (solicitud, respuesta) => {
        try {
            const userDelete = await modelUsers.findByIdAndDelete(
                solicitud.params.id
            );
            if (userDelete._id) {
                respuesta.json({
                    result: 'Ok',
                    message: 'Se ha eliminado el usuario',
                    data: null,
                });
            }
        } catch (error) {
            respuesta.json({
                result: 'Error',
                message: 'Un error ha ocurrido al intentar eliminar el usuario',
                data: error,
            });
        }
    }

};

// Funcion para crear una contraseña aleatoria
function generarContrasenaAleatoria() {
    return crypto.randomBytes(6).toString('hex');
}

export const forgotPassword = async (solicitud, respuesta) => {
    try {
        const { email } = solicitud.body
        const user = await modelUsers.findOne({email});
        if (!user) {
            return respuesta.status(404).json({
                message: "No se encontro el correo registrado en la Base de Datos"
            })
        } 
        const nuevaPassword = generarContrasenaAleatoria();
        const hashedPassword = await bcrypt.hash(nuevaPassword, 10);

        user.password = hashedPassword;
        await user.save();

        // Configuracion del servicio de correo
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.email_node, //email_node viene del archivo .env
                pass: process.env.pass_node //pass_node viene del archivo .env
            },
        });

        // contenido del correo
        const mailOptions ={
            from: 'shermangnr@gmail.com',
            to: email,
            subject: 'Recuperación de contraseña',
            text: `Hola! ${user.name}, \n\Tu nueva contraseña es: ${nuevaPassword} \n\ Recuerda actualizar tu contraseña en tu perfil por seguridad. \n\ ¡Saludos desde el area de soporte!`
        }

        // Envio de correo
        await transporter.sendMail(mailOptions);

        // Responder al usuario

        respuesta.status(200).json({
            message: "Se ha enviado una nueva contraseña al correo registrado."
        });

    } catch (error) {
        console.error("Error al recuperar la contraseña", error);
        respuesta.status(500).json({
            message: "Error interno en el servidor", error: error.message
        })
    }
}

export default controllerUsers;
