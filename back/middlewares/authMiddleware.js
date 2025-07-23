import jwt from 'jsonwebtoken';

const SECRET_KEY = '1qaz2wsx3edc4rfv5tgb6yhn7ujm8ik9ol';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(403).json({ message: 'Acceso denegado: No se proporcionó token de autenticación.' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado: Formato de token inválido.' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            // Si el token no es válido o ha expirado
            return res.status(401).json({ message: 'Acceso denegado: Token no válido o expirado.' });
        }
        
        req.user = {
            id: user.id,
            nombre: user.nombre
        }
        console.log('Middleware authMiddleware.js: req.user después de decodificar:', req.user);
        
        next();
    });
};