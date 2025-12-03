# Login App (Node.js + React)

Autenticación con JWT en cookie httpOnly. Backend: Express/MongoDB. Frontend: React/Vite/Tailwind.

## Requisitos
- Node.js 18+
- MongoDB Atlas (o URI compatible)

## Configuración
1. Copia `.env.example` a `.env` en la raíz y completa valores:
```
PORT=3000
MONGODB_URI=...
JWT_SECRET=...
JWT_EXPIRE=24h
COOKIE_EXPIRE=24
CLIENT_ORIGIN=http://localhost:5173
```
2. Instala dependencias backend y frontend:
```
npm run install:all
```

## Desarrollo
Levanta backend y frontend en paralelo:
```
npm run dev
```
- Backend: http://localhost:3000
- Frontend: http://localhost:5173
- Proxy Vite reenvía `/api/*` al backend.

## Endpoints principales
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me` (protegido)
- GET `/api/auth/logout` (protegido)
- PUT `/api/auth/update` (protegido)
- DELETE `/api/auth/delete` (protegido)

## Seguridad
- Cookies httpOnly, sameSite=lax, secure en producción.
- `helmet` y `express-rate-limit` configurados.
- CORS parametrizable con `CLIENT_ORIGIN`.

Sugerencias pendientes:
- Validación de entrada (p.ej. express-validator).
- CSRF si se mantienen cookies en producción.

## Scripts NPM
- `npm run install:all` instala dependencias raíz y frontend.
- `npm run dev` corre backend (nodemon) y frontend (Vite) concurrentemente.
- `npm start` arranca solo el backend.

## Notas
- No subas `.env` al repositorio. Usa `.env.example`.
- Si expusiste credenciales anteriormente, rota la contraseña del usuario de MongoDB Atlas.

## Deployment en Render

### Backend (API)

1. **Preparar MongoDB Atlas:**
   - Accede a MongoDB Atlas → Network Access
   - Agregar IP: `0.0.0.0/0` (permitir todas las IPs)
   - Copia tu `MONGODB_URI`

2. **Subir a GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <tu-repo-url>
   git push -u origin main
   ```

3. **Crear servicio en Render:**
   - Ve a [dashboard.render.com](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Conecta tu repositorio GitHub
   - Configuración:
     - **Name:** `login-backend` (o el que prefieras)
     - **Region:** Oregon (Free)
     - **Branch:** `main`
     - **Root Directory:** (dejar vacío)
     - **Environment:** `Node`
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
     - **Plan:** Free

4. **Variables de entorno en Render:**
   - NODE_ENV = `production`
   - MONGODB_URI = `tu_cadena_de_mongodb_atlas`
   - JWT_SECRET = `genera_un_secreto_seguro_aleatorio`
   - JWT_EXPIRE = `24h`
   - COOKIE_EXPIRE = `24`
   - CLIENT_ORIGIN = `https://tu-frontend-url.vercel.app` (actualizar después)

5. **Desplegar:**
   - Click "Create Web Service"
   - Espera 3-5 minutos
   - Tu URL será: `https://tu-app.onrender.com`

### Frontend (Vercel)

1. **Preparar el proyecto:**
   ```bash
   cd frontend
   npm run build  # Verificar que el build funciona
   ```

2. **Subir frontend a GitHub:**
   
   Si el frontend está en la misma carpeta que el backend:
   ```bash
   # Desde la raíz del proyecto
   git add .
   git commit -m "feat: Preparar frontend para deployment en Vercel"
   git push origin main
   ```

3. **Crear proyecto en Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Click en "Add New..." → "Project"
   - Importa tu repositorio de GitHub
   - Configuración:
     - **Framework Preset:** `Vite`
     - **Root Directory:** `frontend`
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`
     - **Install Command:** `npm install`

4. **Variables de entorno en Vercel:**
   - En "Environment Variables" agrega:
     - `VITE_API_URL` = `https://login-app-u8gf.onrender.com`

5. **Deploy:**
   - Click "Deploy"
   - Espera 2-3 minutos
   - Tu URL será: `https://tu-proyecto.vercel.app`

6. **Actualizar CLIENT_ORIGIN en Render:**
   - Ve a Render → tu servicio backend → Environment
   - Edita `CLIENT_ORIGIN`:
     ```
     https://tu-proyecto.vercel.app
     ```
   - Guarda (se redesplegará automáticamente)

### Notas importantes:

- **Plan Free de Render:** El servicio "duerme" después de 15 minutos de inactividad. Primera petición puede tardar 30-50 segundos.
- **Health Check:** Render hace ping a `/` cada cierto tiempo.
- **Logs:** Accede desde el dashboard de Render para debug.
- **Auto-deploy:** Vercel redespliega automáticamente cada push a `main`
- **Preview deploys:** Cada PR genera un preview único
- **Custom domain:** Puedes agregar tu dominio en Settings
