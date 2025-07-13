import { Router } from "express";
import controllerServices from "../controllers/controllerServices.js";

const routerServices = Router();

routerServices.post('/', controllerServices.crearServicio);
routerServices.get('/:id', controllerServices.leerServicio);
routerServices.get('/', controllerServices.leerTodosServicios);
routerServices.put('/:id', controllerServices.actualizarServicio);
routerServices.delete('/:id', controllerServices.eliminarServicio);

export default routerServices;