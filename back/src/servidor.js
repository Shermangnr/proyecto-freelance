import path from "path";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import routerUsers from './routers/routerUsers.js';

const servidor = express();
servidor.use(cors());
servidor.use(morgan("dev"));
servidor.use(express.json());
servidor.use('/usuarios', routerUsers);

export default servidor;