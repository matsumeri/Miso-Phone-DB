# Miso Phone DB

Aplicacion web PWA instalable para gestionar contactos telefonicos y de WhatsApp con acceso restringido a tres usuarios, auditoria completa y soporte para soft delete.

## Stack recomendado

- Next.js 16 + App Router + TypeScript
- Auth.js con login por credenciales
- Prisma ORM
- PostgreSQL en Railway
- Tailwind CSS 4

## Por que esta combinacion

- PostgreSQL en Railway evita operar infraestructura extra y encaja mejor que MySQL para este caso.
- Prisma simplifica el modelo de datos, migraciones y consultas de busqueda.
- Auth.js con provider de credenciales permite limitar el acceso solo a usuarios existentes en la base de datos.
- Next.js permite tener frontend, backend y PWA en un solo proyecto Node.js.

## Funcionalidades incluidas

- Login restringido a tres usuarios sembrados en la base de datos
- Dashboard con CRUD de contactos
- Campos: nombre completo, nick, telefono, WhatsApp, categoria, nacionalidad, localidad, fecha de contacto, fecha de creacion, fecha de edicion, fecha de eliminacion y observacion
- Campo quien informa enlazado a usuario de la base de datos
- Soft delete con restauracion
- Busqueda general y filtro por categoria/estado
- Historial de altas, ediciones, eliminaciones, restauraciones e intentos de login
- Manifest PWA e iconos para instalacion en movil

## Variables de entorno

Copia los valores de [.env.example](.env.example) hacia tu configuracion real. Necesitas definir:

- DATABASE_URL
- AUTH_SECRET
- AUTH_URL (opcional, recomendado en despliegue)
- AUTH_TRUST_HOST
- NEXT_SERVER_ACTIONS_ALLOWED_ORIGINS (opcional)
- NEXT_ALLOWED_DEV_ORIGINS (opcional, solo desarrollo)
- SEED_USER_1_NAME, SEED_USER_1_EMAIL, SEED_USER_1_PASSWORD
- SEED_USER_2_NAME, SEED_USER_2_EMAIL, SEED_USER_2_PASSWORD
- SEED_USER_3_NAME, SEED_USER_3_EMAIL, SEED_USER_3_PASSWORD

## Inicio local

1. Instala dependencias:

```bash
npm install
```

2. Configura PostgreSQL local o usa una base de Railway.

3. Ejecuta migraciones:

```bash
npm run prisma:migrate -- --name init
```

4. Inserta los tres usuarios permitidos:

```bash
npm run prisma:seed
```

5. Inicia el entorno de desarrollo:

```bash
npm run dev
```

## Despliegue sugerido en Railway

1. Crea un proyecto en Railway.
2. Agrega un servicio PostgreSQL.
3. Agrega un servicio Node.js conectado a este repositorio.
4. Configura las variables de entorno del servicio web con los valores del bloque anterior.
5. Define tambien estas variables con los valores de tu dominio publico de Railway:

```bash
AUTH_URL="https://tu-app.up.railway.app"
NEXT_SERVER_ACTIONS_ALLOWED_ORIGINS="tu-app.up.railway.app"
```

6. El repositorio ya incluye [railway.json](railway.json), asi que Railway usara estos comandos automaticamente:

```bash
npm run build
npm run start:railway
```

7. En el arranque, la app ejecuta las migraciones pendientes con `prisma migrate deploy` antes de levantar Next.js.

8. Ejecuta el seed una sola vez tras el primer despliegue correcto desde la consola del servicio:

```bash
npm run prisma:seed
```

9. Verifica el healthcheck publico en esta ruta:

```bash
https://tu-app.up.railway.app/api/health
```

## Estado actual para produccion

- GitHub Pages solo publica una portada estatica informativa.
- La aplicacion funcional debe correr en Railway u otro hosting con Node.js.
- El endpoint [src/app/api/health/route.ts](src/app/api/health/route.ts) queda disponible para healthchecks.
- La configuracion de Railway queda declarada en [railway.json](railway.json).

## Estructura principal

- [src/app/login/page.tsx](src/app/login/page.tsx): pantalla de acceso
- [src/app/dashboard/page.tsx](src/app/dashboard/page.tsx): dashboard principal y mantenedor
- [src/app/dashboard/history/page.tsx](src/app/dashboard/history/page.tsx): modulo de historial
- [src/app/dashboard/actions.ts](src/app/dashboard/actions.ts): acciones del servidor para CRUD y logout
- [src/auth.ts](src/auth.ts): configuracion de autenticacion
- [prisma/schema.prisma](prisma/schema.prisma): modelo de datos

## Notas operativas

- El acceso queda limitado a los usuarios existentes en la tabla User.
- Si quieres cambiar las tres credenciales permitidas, modifica el seed o administra esos usuarios en PostgreSQL.
- El soft delete no borra datos, solo completa deletedAt.
- El historial se guarda en AuditLog.
- Si aparece el error "Invalid Server Actions request", define AUTH_URL con tu dominio publico o agrega el host de acceso en NEXT_SERVER_ACTIONS_ALLOWED_ORIGINS y NEXT_ALLOWED_DEV_ORIGINS.
- En Railway, no dejes `AUTH_URL` vacio: debe coincidir con el dominio publico real del servicio.
