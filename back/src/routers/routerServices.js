import { Router } from "express";
import controllerServices from "../controllers/controllerServices.js";
import { verifyToken } from "../../middlewares/authMiddleware.js";

const routerServices = Router();

// routerServices.post('/', verifyToken, controllerServices.crearServicio);
routerServices.post('/create', verifyToken, controllerServices.crearServicio);
routerServices.get('/:id', controllerServices.leerServicio);
routerServices.get('/', controllerServices.leerTodosServicios);
routerServices.put('/:id', verifyToken, controllerServices.actualizarServicio);
routerServices.get('/read-my-services', verifyToken, controllerServices.leerMisServicios);
routerServices.delete('/:id', verifyToken, controllerServices.eliminarServicio);

export default routerServices;