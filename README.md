# NexusJob

Plataforma web que conecta a freelancers de diferentes áreas (desarrollo, diseño, QA, análisis de datos, entre otros) con potenciales clientes.  
Los usuarios pueden **registrar sus servicios, mostrar proyectos previos y compartir su CV**, mientras que los empleadores pueden **buscar y elegir candidatos** de manera sencilla y segura.

---

## 🚀 Características principales

- Registro y autenticación de usuarios mediante **JWT (JSON Web Token)**.  
- Diferenciación de roles de usuario (freelancer / empleador).  
- Publicación de servicios y proyectos por parte de los freelancers.  
- Visualización de perfiles, proyectos y CV por parte de los empleadores.  
- Página pública para consultar servicios sin necesidad de registro.  
- Arquitectura **MEAN Stack (MongoDB, Express, Angular, Node.js)**.  
- Despliegue en **AWS (EC2 para backend y Angular, S3 para archivos estáticos)**.  
- Pruebas unitarias e integración realizadas con **Jest y Supertest**.  

---

## 🛠️ Tecnologías utilizadas

- **Frontend:** Angular, HTML5, CSS3, Bootstrap  
- **Backend:** Node.js, Express  
- **Base de datos:** MongoDB (NoSQL)  
- **Autenticación:** JWT + bcrypt  
- **Pruebas:** Jest, Supertest  
- **Despliegue:** AWS (EC2, S3)  

---

## 📂 Estructura del proyecto

```
NexusJob/
├── backend/           # API con Node.js + Express
├── frontend/          # Aplicación Angular
├── tests/             # Pruebas unitarias con Jest y Supertest
├── docs/              # Documentación y recursos
└── README.md          # Este archivo
```

---

## ⚙️ Instalación y ejecución local

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/Shermangnr/proyecto-freelance.git
   ```

2. Instalar dependencias del backend:
   ```bash
   cd back
   npm install
   ```

3. Instalar dependencias del frontend:
   ```bash
   cd front
   npm install
   ```

4. Configurar variables de entorno (`.env`) en el backend:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/proyecto-freelance
   JWT_SECRET=
   ```

5. Ejecutar backend y frontend:
   ```bash
   # En backend/
   npm run dev

   # En frontend/
   ng s
   ```

6. Acceder en el navegador:
   ```
   http://localhost:4200
   ```

---

## ✅ Pruebas

Ejecutar pruebas unitarias con **Jest y Supertest**:

```bash
cd backend
npm test
```

---

## 📌 Estado del proyecto

Actualmente en fase académica/prototipo. El objetivo principal fue el **aprendizaje y consolidación de conocimientos en el stack MEAN**, integración de autenticación con JWT, pruebas unitarias y despliegue en AWS.

---

## 👨‍💻 Autor

**German Alirio Bermúdez Buitrago**  
Desarrollador Web Full Stack | [LinkedIn](https://www.linkedin.com/in/german-bermudez-desarrolladorfullstack/) | [Portafolio](https://github.com/Shermangnr)  

---
