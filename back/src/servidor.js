import path from "path";
import express from "express";
import morgan from "morgan";
import cors from "cors";

const servidor = express();
servidor.use(cors());
servidor.use(morgan("dev"));
servidor.use(express.json());

export default servidor;