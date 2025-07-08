import mongoose from "mongoose";
mongoose

.connect(process.env.BD_PROY_FREELANCE)
.then((dato)=>{
    console.log("Conectado a la Base de Datos");
}). catch((error)=>{
    console.log("Sin conexión a la Base de Datos");
})