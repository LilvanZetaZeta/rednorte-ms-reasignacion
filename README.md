# RedNorte - Microservicio de Reasignaciones (ms-reasignacion)

El Microservicio de Reasignaciones se encarga de optimizar los tiempos de espera de los pacientes mediante un algoritmo automatizado de cupos liberados. Administra la lista de espera global de **RedNorte** y genera ofertas dinámicas cuando se libera una cita de forma imprevista.

## Características Principales

*   **Procesador de Cupos Liberados**: Escucha eventos de cancelaciones de citas e identifica pacientes elegibles en la lista de espera basándose en centro, especialidad y prioridad.
*   **Gestión de Ofertas Temporales**: Crea ofertas de reasignación con un tiempo límite de respuesta para los pacientes seleccionados.
*   **Transiciones de Estado Automatizadas**: Si un paciente acepta la oferta, el microservicio coordina la reasignación de la cita directamente contra `ms-gestion` y notifica al paciente.
*   **Monitoreo de Expiraciones**: Un planificador de tareas (Scheduler) monitorea y expira ofertas que no fueron respondidas a tiempo, reasignando el cupo al siguiente paciente en la lista.

## Tecnologías Utilizadas

*   **Node.js & Express**
*   **JavaScript (ES6 Modules)**
*   **Supabase Database (Postgres Client)**
*   **Axios** (para comunicación REST a otros microservicios)
*   **Node-Cron** (para planificación de expiraciones)
*   **Jest & Supertest** (suite de pruebas unitarias y de integración)

## Requisitos Previos

*   Node.js v18 o superior.
*   Conexión a internet para comunicarse con Supabase.
*   Archivo de variables de entorno `.env` en este directorio.

## Variables de Entorno (.env)

Crea un archivo `.env` en la raíz de este directorio con la siguiente estructura de variables (reemplaza los valores entre `<>` con tus configuraciones correspondientes):

```env
# Puerto en el que se ejecutará el microservicio de Reasignación (por defecto 8083)
PORT=<puerto_ms_reasignacion>

# URL base de tu proyecto de Supabase (ej: https://<project-id>.supabase.co)
SUPABASE_URL=<url_proyecto_supabase>

# URL base del API Gateway (ej: http://localhost:8080)
MS_APIGATEWAY_URL=<url_api_gateway>

# URL base del Microservicio de Gestión (ej: http://localhost:8081)
MS_GESTION_URL=<url_microservicio_gestion>

# URL base del Microservicio Portal (ej: http://localhost:8082)
MS_PORTAL_URL=<url_microservicio_portal>

# URL base del Microservicio de Reasignación (ej: http://localhost:8083)
MS_REASIGNACION_URL=<url_microservicio_reasignacion>

# URL base del Microservicio de Notificaciones (ej: http://localhost:8085)
MS_NOTIFICACIONES_URL=<url_microservicio_notificaciones>

# URL base de la Aplicación Frontend (ej: http://localhost:5173)
MS_FRONTEND_URL=<url_frontend>

# Secreto JWT para la firma de tokens de Supabase (utilizado en autenticación y validación de tokens)
SUPABASE_JWT_SECRET=<jwt_secret_supabase>

# URL JDBC de conexión a PostgreSQL (ej: jdbc:postgresql://<host>:<port>/<dbname>)
DB_URL=<jdbc_conexion_postgresql>

# Nombre de usuario para la base de datos PostgreSQL
DB_USERNAME=<usuario_database>

# Contraseña del usuario de la base de datos PostgreSQL
DB_PASSWORD=<password_database>

# URL de los JWKs de Supabase para validar los tokens JWT
SUPABASE_JWKS_URI=<url_supabase_jwks>

# URI del emisor de tokens (issuer) de Supabase
issuer-uri=<uri_emisor_tokens_supabase>

# Clave de servicio de Supabase (Service Role Key) para realizar operaciones administrativas bypass de RLS
SUPABASE_KEY=<service_role_key_supabase>
```

## Instrucciones de Ejecución

### 1. Instalar Dependencias

```bash
npm install
# o con pnpm
pnpm install
```

### 2. Iniciar en Modo Desarrollo

Levanta el servidor local en el puerto `8083`:

```bash
npm run dev
# o con pnpm
pnpm dev
```

### 3. Ejecutar Pruebas

Para correr el suite de pruebas:

```bash
npm test
# o con pnpm
pnpm test
```

## Dockerización

Construir la imagen de Docker:

```bash
docker build -t rednorte-ms-reasignacion .
```
