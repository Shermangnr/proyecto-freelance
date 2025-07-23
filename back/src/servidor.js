import path from "path";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import routerUsers from './routers/routerUsers.js';
import routerServices from "./routers/routerServices.js";
import routerLogin from "./routers/routerLogin.js";

const servidor = express();
servidor.use(cors());
servidor.use(morgan("dev"));
servidor.use(express.json());
servidor.use('/usuarios', routerUsers);
servidor.use('/inicio-sesion', routerLogin);//login
servidor.use('/api/services', routerServices);
servidor.use('/servicios', routerServices);
servidor.use('/images', express.static(path.resolve('images')));

export default servidor;