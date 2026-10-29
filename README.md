# 🍔 Hamburger Rapid — Plataforma Comercial Full-Stack

[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Astro](https://img.shields.io/badge/Astro-4.16-BC52EE?logo=astro&logoColor=white)](https://astro.build/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Multi--Stage-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Dokploy](https://img.shields.io/badge/Deploy-Dokploy%20CI%2FCD-059669?logo=docker&logoColor=white)](https://dokploy.com/)

**Hamburger Rapid** es una solución integral y modular de comercio electrónico gastronómico de alta gama. El repositorio implementa una arquitectura monorepo desacoplada que fusiona **tres aplicaciones frontend especializadas** y una **API REST robusta** en un único servidor contenerizado y resiliente, listo para despliegues continuos con Docker y Dokploy.

---

## 🧭 Mapa de Navegación del Ecosistema

El servidor unificado distribuye las aplicaciones mediante enrutamiento inteligente bajo un único dominio y puerto:

| Módulo | Ruta URL | Tecnología | Rol y Enfoque Principal |
| :--- | :--- | :--- | :--- |
| **Landing E-commerce** | `/` | **Astro 4** (SSG) | Portal de marca, catálogo gourmet de 10 variedades, ingredientes, maridaje y conversión rápida. |
| **App Móvil PWA** | `/app` | **React 18 + Vite** | Aplicación web progresiva instalable con carrito interactivo, cupones, tracking de delivery en vivo y perfil VIP. |
| **Panel de Administración** | `/admin` | **React 18 + Vite** | Backoffice operativo: KPIs en tiempo real, gestión de catálogo y stock, CRM de clientes y monitor de base de datos. |
| **API REST & Telemetría** | `/api/*` | **Node.js + Express** | Endpoints de productos, pedidos, analíticas, clientes y healthcheck del sistema y MySQL. |

---

## 🏛️ Arquitectura del Sistema

```mermaid
flowchart TD
    subgraph Clientes ["🌐 Capa de Clientes"]
        UserWeb["💻 Usuario Web Desktop"]
        UserMobile["📱 Usuario Móvil (PWA)"]
        AdminUser["⚙️ Administrador / Operaciones"]
    end

    subgraph Servidor ["🚀 Servidor Central Unificado (Express / Node.js 20)"]
        Router["Express App Router (app.js)"]
        
        subgraph Frontends ["📦 Frontends Compilados (server/public)"]
            EcomBuild["Landing E-commerce (/)<br/>Astro SSG Build"]
            PwaBuild["PWA Mobile (/app)<br/>React + Vite + Service Worker"]
            AdminBuild["Admin Dashboard (/admin)<br/>React + Vite SPA"]
        end

        subgraph BackendAPI ["⚡ API REST (/api)"]
            HealthEP["/api/health<br/>(Telemetría y Estado)"]
            ProdEP["/api/products<br/>(CRUD Catálogo)"]
            CustEP["/api/customers<br/>(Métricas CRM)"]
            OrderEP["/api/orders<br/>(Gestión de Pedidos)"]
            StatsEP["/api/stats<br/>(Analítica Comercial)"]
        end

        subgraph CapaDatos ["💾 Capa de Persistencia Resiliente (db.js)"]
            DBPool["MySQL Connection Pool (mysql2)"]
            MemFallback["Fallback en Memoria<br/>(Resiliencia si MySQL cae)"]
        end
    end

    subgraph Persistencia ["🗄️ Base de Datos Externa"]
        MySQLDB[("MySQL 8.x<br/>Tabla: products")]
    end

    UserWeb -->|Acceso a /| EcomBuild
    UserMobile -->|Acceso a /app| PwaBuild
    AdminUser -->|Acceso a /admin| AdminBuild

    EcomBuild -.-> Router
    PwaBuild -->|Llamadas REST| BackendAPI
    AdminBuild -->|Llamadas REST| BackendAPI

    BackendAPI --> DBPool
    DBPool -->|Conectado| MySQLDB
    DBPool -.->|Fallo de Conexión| MemFallback
```

---

## 📦 Análisis Detallado de los Componentes

### 1. 🛍️ Landing Page E-commerce (`apps/ecommerce`)
* **Ubicación:** `apps/ecommerce/`
* **Punto de Montaje:** `http://localhost:3000/`
* **Stack:** Astro 4.16.x con generación de sitios estáticos (`output: 'static'`), HTML5 semántico, CSS moderno con variables personalizadas y tipografías *Bebas Neue*, *Caveat* y *Plus Jakarta Sans*.
* **Referencia Visual de Diseño:** Inspirado y modelado fielmente según el afiche gastronómico físico ubicado en [`assets-references/images/9754b9aa579fb8fcbee7519febf32758.jpg`](file:///c:/Users/User/LaboratorioIA/Clase_Intro/LaboratorioIA/assets-references/images/9754b9aa579fb8fcbee7519febf32758.jpg).

#### 🎨 Sistema de Diseño y Estilo Visual del Afiche:
- **Paleta de Colores de Pizarra Parrillera:**
  - Fondo Pizarra y Carbón Oscuro: `#0c0c0e` y `#18181c` con texturas de cuadrícula sutil y resplandor radial de brasas (`rgba(220, 38, 38, 0.15)`).
  - Rojo Fuego Parrillero: `#dc2626` y `#991b1b` para títulos, insignias y cintas de destaque.
  - Amarillo Mostaza y Dorado Brasa: `#facc15` y `#eab308` para flechas indicadoras, subtítulos y sellos festoneados.
  - Píldoras de Precios en Blanco Puro: `#ffffff` con texto negro en negrita ultra-densa (`#000000`) y borde de alto contraste.
- **Jerarquía Tipográfica Exclusiva:**
  - **Título Gigante Esténcil / Grunge:** `HAMBURGUESAS` con tipografía condensada *Bebas Neue*, sombra multicapa y efecto desgastado.
  - **Cabeceras Cursivas Caligráficas:** *Caveat / Yellowtail* para distinguir las secciones *"Clásicas"* (en rojo con destello blanco) y *"Especiales"* (en amarillo dorado cálido).
  - **Leyendas y Textos de Lectura:** *Plus Jakarta Sans* para garantizar accesibilidad, fichas nutricionales y fluidez.

#### 🍔 Elementos de la Carta Física Integrados:
- **Catálogo de 12 Variedades con Precios Oficiales en Soles (`S/`):**
  1. **Hamburguesa Clásica (`S/10.00`):** De res o pechuga a la brasa con ensalada fresca y aderezo especial.
  2. **Cheese Burguer (`S/15.00`):** Medallón a la parrilla con abundante queso cheddar fundido.
  3. **Royal (`S/17.00`):** Carne seleccionada, queso cheddar y huevo campero frito a la plancha.
  4. **Vegetariana (`S/15.00`):** Medallón artesanal de lentejas, queso derretido y ensalada, destacado con **banderola curva roja** y **sello festoneado amarillo**.
  5. **Con Chorizo / Choriburguer (`S/15.00`):** Fusión parrillera de carne de res, rodajas de chorizo ahumado y papas al hilo crujientes.
  6. **De Pollo / Pollo Crispy (`S/18.00`):** Pechuga con marinado de 24h, rebozado sureño ultra-crocante y queso cheddar, enmarcada con ilustraciones de llamas.
  7. **BBQ Especial (`S/22.00`):** Carne en salsa barbacoa artesanal con cerveza negra, cheddar y tocino crocante.
  8. **A lo Pobre (`S/17.00`):** Receta emblemática con carne a la parrilla, queso, huevo frito y plátano maduro dulce frito.
  9. **Bacon Burger (`S/20.00`):** Medallón a la leña, cuádruple loncha de tocino al nogal y queso fundido.
  10. **Mary's Burger (`S/15.00`):** Especial consentida de la casa con doble carne smash caramelizada, queso cheddar y tocino, destacada con **sello festoneado rojo**.
  11. **Rey de las Burgers (`S/28.00`):** Corona suprema de triple carne Angus (450g), cebolla al bourbon y cheddar añejo.
  12. **Smash Trufa Imperial (`S/26.00`):** Gourmet signature con queso Brie francés y mayonesa de trufa negra silvestre.

#### ✨ Elementos Gráficos y Experiencia Interactiva:
- **Viñetas de Flecha Dorada (`▶`):** Presentes antes del nombre en mayúsculas de cada variedad, tal como luce en el afiche.
- **Accentos Decorativos Flotantes Animados:** Rodajas de tomate flotante, hojas tiernas de albahaca, aros de cebolla morada y papas doradas con suaves micro-animaciones CSS.
- **Visor de la Carta Impresa Oficial:** Botón interactivo en el navbar (*"📜 Ver Carta Impresa"*) que despliega un modal en alta resolución con la fotografía real del afiche físico (`menu-referencia.jpg`), permitiendo comparar el diseño físico original con la plataforma interactiva.
- **Modal de Ficha Técnica Detallada:** Ventana emergente con tiempos de cocción, calorías, proteínas, lista de ingredientes y botón de pedido inmediato hacia la PWA.


---

### 2. 📱 Aplicación Web Progresiva — PWA Móvil (`apps/pwa`)
* **Ubicación:** `apps/pwa/`
* **Punto de Montaje:** `http://localhost:3000/app/`
* **Stack:** React 18, Vite 5 (`base: '/app/'`), Service Worker (`sw.js`), Web App Manifest (`manifest.json`).

#### Capacidades PWA y Soporte Offline:
- **Instalabilidad:** Cumple con todos los estándares PWA; detectable por navegadores móviles y de escritorio para añadir como aplicación nativa a la pantalla de inicio con banner interactivo (`beforeinstallprompt`).
- **Service Worker Inteligente (`sw.js`):**
  - **Estrategia Network-First para navegación:** Asegura que los usuarios siempre visualicen la versión más reciente del build HTML. En caso de corte de red, recurre automáticamente al contenedor en caché.
  - **Estrategia Cache-First / Stale-While-Revalidate para activos estáticos:** JS, CSS, iconos e imágenes se sirven con latencia mínima.
  - **Purga de Caché Automática:** Limpieza de versiones previas obsoletas durante el ciclo de vida `activate`.
  - **Bypass de API:** Las peticiones hacia `/api/*` se excluyen del Service Worker para garantizar datos frescos en todo momento.
- **Indicador de Conectividad:** Banner contextual en tiempo real que alerta si el dispositivo pierde la conexión a Internet (`navigator.onLine`).

#### Módulos y Experiencia de Usuario en la PWA:
1. **Pestaña Menú:**
   - Buscador en vivo por nombre o ingrediente.
   - Píldoras de filtrado por categoría de hamburguesas.
   - Tarjetas de producto táctiles con selector de adición directa al carrito.
2. **Pestaña Ofertas & Cupones:**
   - Tarjetas de promociones interactivas con códigos canjeables:
     - `RAPID20`: 20% de descuento directo en el total.
     - `DELIVERYFREE`: Envío bonificado a costo $0.00.
     - `COMBOREY`: Papas y bebida de cortesía ($4.00 de descuento).
   - Botón de un solo toque para copiar y aplicar el cupón automáticamente.
3. **Pestaña Órdenes & Tracking en Vivo:**
   - Seguimiento visual de 4 etapas: `1. Recibido` ➔ `2. En parrilla` ➔ `3. En camino con el delivery 🛵` ➔ `4. Entregado con éxito ✅`.
   - Estimación de tiempo restante (minutos) y datos del repartidor asignado (nombre, modelo de vehículo y placa).
4. **Pestaña Perfil & Fidelización:**
   - Monedero de fidelización **RapidPoints** acumulados por compras.
   - Libreta de direcciones de entrega predeterminadas.
   - Historial de pedidos anteriores y accesos a soporte.
5. **Carrito de Compras y Checkout Modal:**
   - Panel desplegable con contador de ítems, incremento/decremento y eliminación.
   - Input para validación de cupones con feedback visual de ahorro.
   - Cálculo automático de envío (gratis si la compra supera los $20 o con cupón).
   - Formulario de checkout: Dirección de entrega, selector de método de pago (*Apple Pay*, *Tarjeta de Crédito/Débito*, *Efectivo*) y notas para el repartidor.

---

### 3. ⚙️ Panel de Administración (`apps/admin`)
* **Ubicación:** `apps/admin/`
* **Punto de Montaje:** `http://localhost:3000/admin/`
* **Stack:** React 18, Vite 5 (`base: '/admin/'`), integración con la API REST de Express.

#### Módulos Operativos del Backoffice:
1. **Overview (Dashboard Analítico):**
   - **Tarjetas de KPIs Principales:** Ventas totales del día ($), volumen de pedidos procesados, ticket promedio por cliente y margen de ganancia operativo.
   - **Monitor de Salud del Backend:** Indicador de conexión en tiempo real con `/api/health`, tiempo de actividad (*uptime*), modo de base de datos activa y latencia de respuesta.
   - **Ránking de Productos:** Resumen de las variantes más vendidas y tasa de conversión.
2. **Burgers (Gestión de Catálogo y Menú):**
   - Tabla interactiva con búsqueda por texto y filtro por especialidad gastronómica.
   - **Control de Disponibilidad en Tiempo Real:** Switch interactivo para activar o pausar cualquier hamburguesa del menú público al instante.
   - Métricas de stock disponible, volumen de ventas acumuladas y valoración en estrellas (rating).
   - **Modal de Alta de Hamburguesa:** Formulario para registrar nuevas variantes culinarias con nombre, categoría, especialidad, precio, stock inicial, tiempo de cocción, calorías y URL de fotografía. Se sincroniza mediante `POST /api/products`.
3. **Customers (CRM & Fidelización):**
   - Directorio de clientes recurrentes segmentados por niveles de fidelidad:
     - 💎 **Diamond VIP** (Consumo superior a 25 burgers, trato preferencial).
     - 🥇 **Gold Gourmet** (10 - 24 burgers consumidas).
     - 🥈 **Silver Regular** (5 - 9 burgers consumidas).
     - 🌱 **Nuevo Explorador** (1 - 4 burgers consumidas).
   - Desglose por cliente: Total gastado ($), hamburguesa favorita, última compra registrada y puntos acumulados.
4. **Database (Monitor y Mantenimiento de Persistencia):**
   - Diagnóstico del pool de conexiones MySQL (`HOST`, `DATABASE`, `PORT`, conexiones activas).
   - Indicador de estado del modo resiliente (MySQL vs. In-Memory Fallback).
   - Botón de reinicio rápido de datos (`POST /api/reset`) para restaurar el catálogo maestro de 10 productos en ambientes de prueba o demostración.

5. **🔌 iDempiere ERP (Integración REST API v1 & Control de Acceso):**
   - **Blindaje Técnico Estricto:** Cumple con POST /api/v1/auth/tokens (plural), cabeceras Content-Type: application/json y Accept: application/json.
   - **Estructura Wire Canónica:** Parámetros anidados en parameters con organizationId estricto (evita excepción Java LoginCredential).
   - **Gestión de Sesión:** Token Bearer persistido en sesión, decodificación de contexto, y soporte de refresco (PUT) y revocación (DELETE).
   - **Resiliencia & Sandbox:** Permite alternar entre enlace directo al ERP y sandbox simulado para operación continua.

---

### 4. ⚡ Servidor Backend y API REST (`server`)
* **Ubicación:** `server/`
* **Archivo Principal:** `server/src/app.js`
* **Módulo de Datos:** `server/src/db.js`
* **Rutas API:** `server/src/routes/api.js`
* **Stack:** Node.js, Express 4.19, MySQL2 (Promises & Connection Pool), CORS.

#### Características Clave del Servidor:
- **Servidor Estático Unificado y SPA Routing:** Resuelve de forma transparente las rutas directas hacia `/` (Astro), `/app/*` (PWA) y `/admin/*` (Admin), gestionando los assets estáticos y entregando los archivos `index.html` correspondientes sin colisiones.
- **Arquitectura de Persistencia Resiliente (`db.js`):**
  - **Soporte Nativo MySQL:** Lee variables de entorno estándar (`DATABASE_URL`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`).
  - **Migración y Auto-Seeding Automático:** Al iniciar, crea la tabla `products` si no existe y siembra automáticamente las 10 hamburguesas maestras con sus datos nutricionales y precios.
  - **Fallback en Memoria con Cero Caídas:** Si no se proporcionan credenciales de base de datos o si el contenedor de MySQL no está disponible, el sistema conmuta de manera transparente a una réplica profunda en memoria (`In-Memory Mode`), permitiendo que las aplicaciones sigan funcionando sin interrupciones.

#### Referencia de la API REST (`/api`):

| Método | Endpoint | Descripción | Payload / Parámetros |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Diagnóstico de salud, uptime, métricas y estado del pool MySQL. | Ninguno |
| `GET` | `/api/products` | Retorna el catálogo completo de hamburguesas con stock y estado. | Ninguno |
| `POST` | `/api/products` | Registra una nueva hamburguesa en la base de datos. | `{ name, category, specialty, specialtyBadge, price, stock, image, description, cookTime, calories }` |
| `DELETE` | `/api/products/:id` | Elimina una hamburguesa por su identificador numérico. | `id` en URL |
| `GET` | `/api/customers` | Retorna el listado de clientes del CRM con métricas de consumo. | Ninguno |
| `GET` | `/api/stats` | Estadísticas consolidadas de ventas, pedidos y facturación. | Ninguno |
| `GET` | `/api/orders` | Retorna las órdenes registradas en el sistema. | Ninguno |
| `POST` | `/api/orders` | Recibe y procesa un nuevo pedido generado desde la PWA. | `{ customer, items, total }` |
| `POST` | `/api/reset` | Restablece el catálogo a las 10 hamburguesas maestras predeterminadas. | Ninguno |

---

## 📂 Estructura del Proyecto

```text
LaboratorioIA/
├── apps/
│   ├── ecommerce/               # 🛍️ Landing Page Comercial (Astro 4 SSG)
│   │   ├── astro.config.mjs     # Configuración de compilación estática
│   │   ├── package.json         # Dependencias de Astro
│   │   ├── public/              # Activos estáticos públicos
│   │   │   └── images/
│   │   │       └── menu-referencia.jpg # Copia web del afiche oficial para el visor modal
│   │   └── src/
│   │       ├── env.d.ts
│   │       └── pages/
│   │           └── index.astro  # Catálogo inspirado en el afiche: 12 variedades, modal y filtros
│   │
│   ├── pwa/                     # 📱 App Móvil PWA (React 18 + Vite)
│   │   ├── index.html           # Punto de entrada HTML con viewport móvil
│   │   ├── package.json         # Dependencias de React y Vite
│   │   ├── vite.config.js       # Configuración con base: '/app/'
│   │   ├── public/
│   │   │   ├── manifest.json    # Manifiesto PWA (standalone, colores, nombres)
│   │   │   ├── sw.js            # Service Worker (Network-First + Cache-First)
│   │   │   ├── icon-192.svg     # Icono estándar PWA
│   │   │   └── icon-512.svg     # Icono de alta resolución PWA
│   │   └── src/
│   │       ├── App.jsx          # Menú, cupones, carrito, checkout, tracking y perfil
│   │       ├── index.css        # Estilos base y tokens
│   │       └── main.jsx         # Montaje del árbol React
│   │
│   └── admin/                   # ⚙️ Panel de Administración (React 18 + Vite)
│       ├── index.html           # Punto de entrada HTML
│       ├── package.json         # Dependencias de React y Vite
│       ├── vite.config.js       # Configuración con base: '/admin/'
│       └── src/
│           ├── App.jsx          # Dashboard KPIs, CRUD burgers, CRM clientes y DB monitor
│           ├── index.css        # Estilos del panel de control
│           └── main.jsx         # Montaje del árbol React
│
├── server/                      # ⚡ Servidor Backend y API REST
│   ├── package.json             # Dependencias (Express, cors, mysql2)
│   ├── public/                  # 📦 Directorio de artefactos compilados
│   │   ├── ecommerce/           # Build sincronizado de apps/ecommerce/dist
│   │   ├── pwa/                 # Build sincronizado de apps/pwa/dist
│   │   └── admin/               # Build sincronizado de apps/admin/dist
│   └── src/
│       ├── app.js               # Enrutador Express, SPAs y servidor HTTP
│       ├── db.js                # Conexión MySQL, migraciones y fallback in-memory
│       └── routes/
│           └── api.js           # Endpoints REST (/api/*)
│
├── assets-references/           # 🎨 Activos e Imágenes de Referencia de Diseño
│   └── images/
│       └── 9754b9aa579fb8fcbee7519febf32758.jpg # Afiche físico oficial (benchmark de diseño y carta de precios)
│
├── .dockerignore                # Archivos excluidos del contexto Docker
├── .gitignore                   # Archivos ignorados por Git
├── Dockerfile                   # Construcción multi-stage de 4 etapas optimizada
├── package.json                 # Scripts de orquestación global del monorepo
└── README.md                    # Documentación técnica integral del repositorio
```

---

## 🚀 Guía de Instalación y Ejecución Local

### Prerrequisitos
- **Node.js:** Versión 18.x o 20.x LTS recomendada.
- **npm:** Versión 9.x o superior.
- *(Opcional)* **MySQL 8.x:** Si deseas persistir datos fuera de la memoria.
- *(Opcional)* **Docker:** Para compilar y ejecutar contenedores localmente.

---

### Opción 1: Ejecución Rápida con Node.js (Monorepo)

1. **Clonar el repositorio:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd LaboratorioIA
   ```

2. **Instalar todas las dependencias del proyecto:**
   Ejecuta el script raíz que instala automáticamente las dependencias de los 3 frontends y del backend:
   ```bash
   npm run install:all
   ```

3. **Compilar y sincronizar las 3 aplicaciones:**
   Este comando construye `apps/ecommerce`, `apps/pwa` y `apps/admin`, y copia sus distribuciones a `server/public`:
   ```bash
   npm run build:all
   ```

4. **Iniciar el servidor central:**
   ```bash
   npm start
   ```

5. **Abrir en tu navegador:**
   - 🛍️ **Landing E-commerce:** [http://localhost:3000/](http://localhost:3000/)
   - 📱 **PWA Móvil:** [http://localhost:3000/app](http://localhost:3000/app)
   - ⚙️ **Panel de Administración:** [http://localhost:3000/admin](http://localhost:3000/admin)
   - 🩺 **Health Check API:** [http://localhost:3000/api/health](http://localhost:3000/api/health)

---

### Opción 2: Desarrollo Individual por Módulo (Hot Reload)

Puedes levantar cada frontend de manera independiente con su propio servidor de desarrollo:

- **E-commerce (Astro):**
  ```bash
  cd apps/ecommerce
  npm run dev
  # Disponible en http://localhost:4321/
  ```

- **PWA Móvil (Vite):**
  ```bash
  cd apps/pwa
  npm run dev
  # Disponible en http://localhost:5173/app/
  ```

- **Panel de Administración (Vite):**
  ```bash
  cd apps/admin
  npm run dev
  # Disponible en http://localhost:5174/admin/
  ```

- **Backend Express (API):**
  ```bash
  cd server
  npm start
  # Disponible en http://localhost:3000/api/health
  ```

---

## 🐳 Despliegue con Docker y Dokploy

El proyecto incluye un `Dockerfile` optimizado en **4 etapas de compilación (Multi-Stage)** sobre `node:20-alpine`:

1. **`builder-ecommerce`:** Instala dependencias y compila Astro estático.
2. **`builder-pwa`:** Compila la PWA de React con base `/app/`.
3. **`builder-admin`:** Compila el Dashboard administrativo con base `/admin/`.
4. **`runner`:** Imagen final ligera de producción que instala solo las dependencias de producción de Node.js, copia los 3 artefactos compilados y expone el puerto 3000.

### Construir la imagen Docker manualmente:
```bash
docker build -t hamburger-rapid:latest .
```

### Ejecutar el contenedor:
```bash
docker run -d \
  -p 3000:3000 \
  -e PORT=3000 \
  -e DB_HOST=host.docker.internal \
  -e DB_USER=root \
  -e DB_PASSWORD=tu_password \
  -e DB_NAME=hamburger_rapid \
  --name hamburger-rapid-app \
  hamburger-rapid:latest
```

---

### ⚙️ Variables de Entorno

Puedes configurar estas variables en un archivo `.env` o en el panel de **Dokploy**:

| Variable | Tipo | Valor por Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `PORT` | Número | `3000` | Puerto HTTP donde escuchará el servidor Express. |
| `NODE_ENV` | Texto | `production` | Entorno de ejecución (`development` o `production`). |
| `DATABASE_URL` | URL | *(Opcional)* | Cadena de conexión completa para MySQL (ej. `mysql://user:pass@host:3306/db`). |
| `DB_HOST` | Texto | `localhost` | Host o IP del servidor MySQL. |
| `DB_PORT` | Número | `3306` | Puerto de conexión a MySQL. |
| `DB_USER` | Texto | `root` | Usuario con permisos en la base de datos. |
| `DB_PASSWORD` | Texto | `""` | Contraseña del usuario MySQL. |
| `DB_NAME` | Texto | `demo` | Nombre de la base de datos a utilizar. |

> [!NOTE]
> **Modo Resiliente:** Si no se declaran `DB_HOST` ni `DATABASE_URL`, el sistema iniciará automáticamente en **modo In-Memory**, garantizando que la plataforma funcione al 100% para pruebas, clases, masterclasses y demostraciones en vivo sin requerir una base de datos externa obligatoria.

---

## 🛠️ Resumen de Scripts Disponibles

En la raíz del proyecto (`package.json`):

| Script | Comando Real | Propósito |
| :--- | :--- | :--- |
| `npm run install:all` | Instala en cascada en las 4 carpetas | Prepara todas las dependencias del monorepo. |
| `npm run build:ecommerce` | `npm run build --prefix apps/ecommerce` | Compila únicamente la landing en Astro. |
| `npm run build:pwa` | `npm run build --prefix apps/pwa` | Compila únicamente la PWA en Vite. |
| `npm run build:admin` | `npm run build --prefix apps/admin` | Compila únicamente el panel de administración. |
| `npm run build:all` | Ejecuta los 3 builds y copia a `server/public` | Compilación total y sincronización de activos. |
| `npm run server` | `node server/src/app.js` | Inicia el servidor backend. |
| `npm start` | `node server/src/app.js` | Comando estándar para inicio en producción. |

---

## 📄 Licencia

Este proyecto se encuentra bajo la licencia **MIT**. Eres libre de usarlo, modificarlo y distribuirlo con propósitos comerciales, educativos o demostrativos.


