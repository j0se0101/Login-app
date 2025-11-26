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
