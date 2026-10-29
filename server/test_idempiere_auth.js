/**
 * E2E Test Suite para Integración iDempiere REST API v1
 */

const http = require('http');

async function runTests() {
  console.log('--- Iniciando Test Suite iDempiere REST API v1 ---');
  
  // Levantar servidor temporalmente
  const app = require('./src/app');
  const server = http.createServer(app);
  
  await new Promise((resolve) => {
    server.listen(3099, resolve);
  });
  console.log('Servidor de pruebas escuchando en puerto 3099');

  const BASE = 'http://localhost:3099';

  try {
    // 1. Test GET /api/auth/config
    console.log('\n[TEST 1] Verificando especificación técnica pública /api/auth/config...');
    const configRes = await fetch(`${BASE}/api/auth/config`);
    const configJson = await configRes.json();
    console.log('Respuesta endpoint canónico:', configJson.canonicalEndpoint);
    if (configJson.canonicalEndpoint !== '/api/v1/auth/tokens') {
      throw new Error(`Endpoint canónico inválido: ${configJson.canonicalEndpoint}`);
    }
    console.log('✓ TEST 1 PASADO: Endpoint configurado como /api/v1/auth/tokens (plural).');

    // 2. Test POST /api/auth/login con parámetros estrictos
    console.log('\n[TEST 2] Verificando login directo con payload estricto...');
    const loginPayload = {
      userName: 'admin @ gardenworld.com',
      password: 'GardenAdmin',
      parameters: {
        clientId: 11,
        roleId: 102,
        organizationId: 11,
        warehouseId: 103,
        language: 'en_US'
      },
      mode: 'simulate' // Forzamos simulación para testing unitario local
    };

    const loginRes = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(loginPayload)
    });

    const loginJson = await loginRes.json();
    console.log('Login status:', loginRes.status, 'success:', loginJson.success);
    if (!loginJson.success || !loginJson.session?.token) {
      throw new Error(`Fallo en login: ${JSON.stringify(loginJson)}`);
    }
    
    // Validar contexto
    const session = loginJson.session;
    console.log('Token emitido:', session.token.substring(0, 30) + '...');
    console.log('Organization ID:', session.parameters.organizationId);
    if (session.parameters.organizationId !== 11) {
      throw new Error('organizationId no coincide');
    }
    console.log('✓ TEST 2 PASADO: Token emitido y contexto validado exitosamente.');

    // 3. Test GET /api/auth/verify con token Bearer
    console.log('\n[TEST 3] Verificando middleware requireAuth con Bearer token...');
    const verifyRes = await fetch(`${BASE}/api/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${session.token}`
      }
    });
    const verifyJson = await verifyRes.json();
    console.log('Verify status:', verifyRes.status, 'valid:', verifyJson.valid);
    if (!verifyJson.valid || verifyJson.user.userName !== 'admin @ gardenworld.com') {
      throw new Error(`Token verify falló: ${JSON.stringify(verifyJson)}`);
    }
    console.log('✓ TEST 3 PASADO: Middleware valida token Bearer emitido.');

    // 4. Test POST /api/auth/refresh
    console.log('\n[TEST 4] Verificando refresco de token...');
    const refreshRes = await fetch(`${BASE}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: session.token, refreshToken: session.refreshToken })
    });
    const refreshJson = await refreshRes.json();
    console.log('Refresh success:', refreshJson.success);
    if (!refreshJson.success || !refreshJson.session?.token) {
      throw new Error(`Fallo en refresco: ${JSON.stringify(refreshJson)}`);
    }
    console.log('✓ TEST 4 PASADO: Refresco de token completado.');

    // 5. Test POST /api/auth/logout
    console.log('\n[TEST 5] Verificando logout y revocación...');
    const logoutRes = await fetch(`${BASE}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshJson.session.token}`
      },
      body: JSON.stringify({ token: refreshJson.session.token })
    });
    const logoutJson = await logoutRes.json();
    console.log('Logout result:', logoutJson);
    if (!logoutJson.success) {
      throw new Error(`Fallo en logout: ${JSON.stringify(logoutJson)}`);
    }
    console.log('✓ TEST 5 PASADO: Sesión revocada y cerrada exitosamente.');

    // 6. Test Detección / Sanitización de 'orgId' erróneo
    console.log('\n[TEST 6] Verificando corrección automática si el cliente envía "orgId" en vez de "organizationId"...');
    const badPayload = {
      userName: 'admin @ gardenworld.com',
      password: 'GardenAdmin',
      parameters: {
        clientId: 11,
        roleId: 102,
        orgId: 11, // Campo erróneo intencional
        warehouseId: 103,
        language: 'en_US'
      },
      mode: 'simulate'
    };
    const badRes = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(badPayload)
    });
    const badJson = await badRes.json();
    if (badJson.session.parameters.organizationId !== 11 || badJson.session.parameters.orgId !== undefined) {
      throw new Error('No se normalizó orgId a organizationId');
    }
    console.log('✓ TEST 6 PASADO: orgId normalizado a organizationId para proteger iDempiere.');

    console.log('\n======================================================');
    console.log('🎯 TODOS LOS TESTS (6/6) PASARON CON ÉXITO ROTUNDO');
    console.log('======================================================\n');

  } finally {
    server.close();
  }
}

runTests().catch(err => {
  console.error('❌ Error en test suite:', err);
  process.exit(1);
});
