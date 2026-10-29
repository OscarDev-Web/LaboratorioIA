/**
 * iDempiere ERP REST API v1 - Cliente de Autenticación Frontend
 * 
 * Reglas de Blindaje Técnico:
 * 1. Endpoint: POST /api/v1/auth/tokens (plural)
 * 2. Headers: Content-Type: application/json, Accept: application/json
 * 3. Payload estricto con parameters anidados y organizationId
 */

const STORAGE_KEY = 'hamburger_rapid_erp_session';

export const IDEMPIERE_SPEC = {
  canonicalEndpoint: '/api/v1/auth/tokens',
  method: 'POST',
  requiredHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  defaultContext: {
    userName: 'admin @ gardenworld.com',
    password: 'GardenAdmin',
    parameters: {
      clientId: 11,
      roleId: 102,
      organizationId: 11,
      warehouseId: 103,
      language: 'en_US'
    }
  }
};

/**
 * Construye el payload canónico garantizando la estructura requerida por iDempiere
 */
export function buildIdempierePayload(credentials) {
  const { userName, password, parameters = {} } = credentials;

  // Sanitizar y validar organizationId (NUNCA orgId)
  const organizationId = parameters.organizationId !== undefined 
    ? Number(parameters.organizationId)
    : (parameters.orgId !== undefined ? Number(parameters.orgId) : 11);

  return {
    userName: (userName || '').trim(),
    password: password || '',
    parameters: {
      clientId: Number(parameters.clientId ?? 11),
      roleId: Number(parameters.roleId ?? 102),
      organizationId: organizationId,
      warehouseId: Number(parameters.warehouseId ?? 103),
      language: parameters.language || 'en_US'
    }
  };
}

/**
 * Realiza la autenticación contra el backend proxy o directamente contra iDempiere
 */
export async function authenticateIdempiere(credentials, options = {}) {
  const payload = buildIdempierePayload(credentials);
  const mode = options.mode || 'auto'; // 'auto' | 'live' | 'simulate'

  // Usamos el endpoint del backend /api/auth/login para evitar problemas de CORS y añadir resiliencia
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      ...payload,
      mode: mode,
      customBaseUrl: options.customBaseUrl
    })
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    const errorMsg = data.error || `Error HTTP ${response.status} al autenticar con iDempiere`;
    throw new Error(errorMsg);
  }

  // Guardar en sesión
  saveStoredSession(data.session);
  return data.session;
}

/**
 * Prueba la conectividad en vivo con iDempiere
 */
export async function testErpConnectivity(customUrl) {
  try {
    const query = customUrl ? `?url=${encodeURIComponent(customUrl)}` : '';
    const response = await fetch(`/api/auth/erp-health${query}`);
    return await response.json();
  } catch (err) {
    return {
      reachable: false,
      error: err.message,
      targetUrl: customUrl || 'default'
    };
  }
}

/**
 * Refresca el token de sesión (PUT /api/v1/auth/tokens)
 */
export async function refreshIdempiereToken(token, refreshToken) {
  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ token, refreshToken })
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'No fue posible refrescar el token de iDempiere');
  }

  saveStoredSession(data.session);
  return data.session;
}

/**
 * Cierre de sesión y revocación en iDempiere (DELETE /api/v1/auth/tokens)
 */
export async function logoutIdempiere(token) {
  try {
    if (token) {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ token })
      });
    }
  } catch (e) {
    console.warn('Error al notificar revocación de sesión:', e);
  } finally {
    clearStoredSession();
  }
}

/**
 * Almacenamiento de sesión en sessionStorage
 */
export function getStoredSession() {
  try {
    const item = sessionStorage.getItem(STORAGE_KEY);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    return null;
  }
}

export function saveStoredSession(session) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (e) {
    console.error('Error al persistir sesión:', e);
  }
}

export function clearStoredSession() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Error al limpiar sesión:', e);
  }
}

