import { Schema, model } from 'mongoose';
import { type } from 'os';

const schemaUser = new Schema({
    nombre: {
        type: String,
        required: true,
    },
    correo: {
        type: String, 
        required: true,
        match: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, "email invalid."]
    },
    contrasena: {
        type: String,
        required: true, 
        minlength: [3, "The password must have least seven characters"], 
        trim: true, // Elimina los espacios en blanco del inicio y final
        // match:[/^(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`])\S+$/, "Password invalid. The password must have a special character."] // Validacion que tenga lo indicado
    },
    imagenPerfil: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    ubicacion: {
        type: String,
        default: ''
    },
    habilidades: {
        type: [String],
        default: []
    },
    profesion: {
        type: String,
        default: ''
    },
    precioServicioHora: {
        type: Number,
        default: 0
    },
    linksRedes: {
        linkedin: {
            type: String,
            default: ''
        },
        github: {
            type: String,
            default: ''
        },
        portafolio: {
            type: String,
            default: ''
        }
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }

});

export default model ("User", schemaUser);
