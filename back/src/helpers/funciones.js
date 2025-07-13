import jwt from 'jsonwebtoken';
import { token } from 'morgan';

export function generarToken(payload){
    return new Promise((resolver, rechazar)=>{
        jwt.sign(payload, 'Secret Key', {expiresIn: '30s'}, (error, token)=>{
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
        jwt.verify(token, 'Secret Key', (error, decodificado)=>{
            if (error) {
                rechazar(error);
            } else {
                resolver(decodificado);
            }
        });
    });
}