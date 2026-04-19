# Grupo 7

Repositorio del *Grupo 7* (anteriormente Grupo 11) para Ingeniería de Software (inf-225).
Continuación del proyecto iniciado en Análisis y Diseño de Software (inf-236, 2025-2): sistema de préstamos de consumo completamente online.

**Integrantes:**
- Catalina González — 202373062-9
- Javier Martínez — 202373050-5
- Gabriel Lira — 202373054-8
- Benjamin Cegarra — 202373006-8
- **Tutor:** Moisés Villarroel

---

## Cómo levantar el proyecto

### Requisitos previos
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y **corriendo**
- Git

### Pasos

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd analisis-main/proyecto-base-main

# 2. Construir y levantar todos los contenedores
docker compose up --build
```

Espera a que aparezca en la terminal:

```
proyecto-base-main  | Servidor corriendo en puerto 5000
api_tramitacion     | Server running!
api_validaciones    | Server running!
```

> La primera vez MySQL tarda ~30 segundos en inicializarse. Las APIs esperan automáticamente hasta que esté lista.

### Acceder a la aplicación

| Servicio | URL |
|---|---|
| Aplicación web | http://localhost:5000 |
| API Tramitación | http://localhost:8080 |
| API Validaciones | http://localhost:8081 |

### Detener el proyecto

```bash
# Detener sin borrar datos
docker compose stop

# Detener y eliminar contenedores (los datos de la BD se conservan)
docker compose down

# Detener y eliminar TODO, incluyendo la base de datos
docker compose down -v
```

---

### Base de datos

MySQL crea automáticamente las siguientes bases de datos al primer arranque:

- **BD11_TRAMITACION** — tabla `solicitante` con datos de prueba
- **BD11_VALIDACIONES** — tabla `user`

Los datos se persisten en un volumen Docker (`mysql_data`) y **no se pierden** al reiniciar los contenedores.

---

## Flujo de usuario

1. Ingresar RUT en la página principal (`/`)
2. Simular el préstamo en el simulador (`/simulator`)
3. Hacer clic en "Contratar" → verificar nombre
4. Completar el formulario de crédito (`/credito_form`)
5. Subir documentos PDF (`/subir_documentos`)
6. Revisar detalle y firmar (`/credito`)
7. Proceso completado (`/final`)

### Usuarios de prueba (cargados automáticamente)

| RUT | Nombre |
|---|---|
| 20.798.317-9 | Chayanne Campos |
| 20.075.943-5 | Al Goritmo Perez |

---

## Links

- [Wiki del proyecto](https://gitlab.com/TwelveJupiter/analisis/-/wikis/home)
- [Revisión de requisitos](https://gitlab.com/TwelveJupiter/analisis/-/wikis/Revisi%C3%B3n-de-requisitos)
