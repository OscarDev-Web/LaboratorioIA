const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const db = require('./db');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Endpoints
app.use('/api', apiRoutes);

// Define paths for the 3 compiled frontends
const pwaPath = path.join(__dirname, '../public/pwa');
const adminPath = path.join(__dirname, '../public/admin');
const ecommercePath = path.join(__dirname, '../public/ecommerce');

function hasBuild(dir) {
  return fs.existsSync(path.join(dir, 'index.html'));
}

// 1. Mobile PWA under /app
if (hasBuild(pwaPath)) {
  app.use('/app', express.static(pwaPath));
  app.get(['/app', '/app/*'], (req, res) => {
    // Si la petición es por un archivo estático no encontrado (.js, .css, etc.), retornar 404
    if (path.extname(req.path)) {
      return res.status(404).send('Asset not found');
    }
    res.sendFile(path.join(pwaPath, 'index.html'));
  });
} else {
  app.get('/app*', (req, res) => {
    res.send(`
      <div style="font-family:'Plus Jakarta Sans',sans-serif;text-align:center;padding:50px;background:#faf8f5;min-height:100vh;color:#1e293b;">
        <h2>📱 PWA Mobile de Hamburger Rapid aún no compilada</h2>
        <p>Ejecuta <code>npm run build:pwa</code> o compila con Docker para generar los archivos en <code>public/pwa</code>.</p>
        <p><a href="/" style="color:#b45309;font-weight:bold;">Volver al inicio</a> | <a href="/admin" style="color:#b45309;font-weight:bold;">Panel Admin</a></p>
      </div>
    `);
  });
}

// 2. Control Panel under /admin
if (hasBuild(adminPath)) {
  app.use('/admin', express.static(adminPath));
  app.get(['/admin', '/admin/*'], (req, res) => {
    if (path.extname(req.path)) {
      return res.status(404).send('Asset not found');
    }
    res.sendFile(path.join(adminPath, 'index.html'));
  });
} else {
  app.get('/admin*', (req, res) => {
    res.send(`
      <div style="font-family:'Plus Jakarta Sans',sans-serif;text-align:center;padding:50px;background:#faf8f5;min-height:100vh;color:#1e293b;">
        <h2>⚙️ Panel Admin de Hamburger Rapid aún no compilado</h2>
        <p>Ejecuta <code>npm run build:admin</code> o compila con Docker para generar los archivos en <code>public/admin</code>.</p>
        <p><a href="/" style="color:#b45309;font-weight:bold;">Volver al inicio</a> | <a href="/app" style="color:#b45309;font-weight:bold;">PWA Mobile</a></p>
      </div>
    `);
  });
}

// 3. E-commerce Portal on Root /
if (hasBuild(ecommercePath)) {
  app.use(express.static(ecommercePath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(ecommercePath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <title>Hamburger Rapid - Plataforma Comercial</title>
        <style>
          body { font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; background: #faf8f5; color: #1e293b; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
          .card { background: #ffffff; padding: 2.5rem; border-radius: 1.25rem; max-width: 650px; text-align: center; border: 1px solid #f1e9df; box-shadow: 0 20px 40px rgba(0,0,0,0.06); }
          h1 { color: #b45309; margin-bottom: 0.5rem; font-size: 2.2rem; }
          .badge { display: inline-block; background: #fef3c7; color: #b45309; border: 1px solid #fde68a; padding: 0.35rem 0.85rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 700; margin-bottom: 1.5rem; }
          .links { display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; flex-wrap: wrap; }
          .btn { background: #b45309; color: white; text-decoration: none; padding: 0.75rem 1.25rem; border-radius: 0.5rem; font-weight: 600; transition: background 0.2s; }
          .btn:hover { background: #92400e; }
          .status { text-align: left; background: #fffbeb; padding: 1rem; border-radius: 0.5rem; border: 1px solid #fef3c7; font-family: monospace; font-size: 0.85rem; margin-top: 1.5rem; color: #78350f; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>🍔 Hamburger Rapid</h1>
          <div class="badge">🔥 Edición Comercial v1.0</div>
          <p>Servidor backend activo. Si estás viendo esta pantalla localmente, ejecuta <code>npm run build:all</code> para sincronizar las 3 aplicaciones compiladas en <code>server/public</code>.</p>
          <div class="links">
            <a class="btn" href="/app">📱 PWA Mobile</a>
            <a class="btn" style="background:#1e293b;" href="/admin">⚙️ Panel Admin</a>
            <a class="btn" style="background:#059669;" href="/api/health">🩺 Health Check</a>
            <a class="btn" style="background:#d97706;" href="/api/products">🍔 API Hamburguesas</a>
          </div>
          <div class="status">
            <div>• Puerto: ${PORT}</div>
            <div>• Estado DB: ${db.getDbStatus().mode}</div>
            <div>• Entorno: ${process.env.NODE_ENV || 'development'}</div>
          </div>
        </div>
      </body>
      </html>
    `);
  });
}

// Start server and initialize DB
async function start() {
  await db.initDB();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`🍔 Hamburger Rapid Platform ejecutándose en puerto ${PORT}`);
    console.log(`   - E-commerce:  http://localhost:${PORT}/`);
    console.log(`   - PWA Mobile:  http://localhost:${PORT}/app`);
    console.log(`   - Panel Admin: http://localhost:${PORT}/admin`);
    console.log(`   - API Health:  http://localhost:${PORT}/api/health`);
    console.log(`=======================================================`);
  });
}

start();
