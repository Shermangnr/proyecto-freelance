import { Schema, model } from 'mongoose';

const schemaUser = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String, 
        required: true,
        match: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, "email invalid."]
    },
    password: {
        type: String,
        required: true, 
        minlength: [7, "The password must have least seven characters"], 
        trim: true, // Elimina los espacios en blanco del inicio y final
        match:[/^(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`])\S+$/, "Password invalid. The password must have a special character."] // Validacion que tenga lo indicado
    },
});

export default model ("User", schemaUser);
