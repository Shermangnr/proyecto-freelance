import jwt from 'jsonwebtoken';
import { token } from 'morgan';

const JWT_SECRET_KEY = '1qaz2wsx3edc4rfv5tgb6yhn7ujm8ik9ol';

export function generarToken(payload){
    return new Promise((resolver, rechazar)=>{
        jwt.sign(payload, JWT_SECRET_KEY, {expiresIn: '1h'}, (error, token)=>{
            if (error) {
                rechazar(error);
            } else {
                resolver(token);
            }
        });
    });
}

export function verificarToken(token){
    return new Promise((resolver, rechazar)=>{
        jwt.verify(token, JWT_SECRET_KEY, (error, decodificado)=>{
            if (error) {
                rechazar(error);
            } else {
                resolver(decodificado);
            }
        });
    });
}