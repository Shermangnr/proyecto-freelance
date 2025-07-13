import { Schema, model } from "mongoose";

const schemaService = new Schema({
    titulo: {type: String, required: true },
    descripcion: {type: String, required: true },
    precio: {type: Number, required: true},
    categoria: {type: String, required: true},
    etiquetas: {type: [String], default: []},
    imagenes: {type: [String], default: []},
    usuarioId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    fechaCreacion: {type: Date, default: Date.now}
});

export default model ("Service", schemaService);