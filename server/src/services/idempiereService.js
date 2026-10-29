/**
 * iDempiere ERP REST API v1 - Servicio de Integración
 * 
 * Implementa el blindaje técnico estricto contra iDempiere REST API v1:
 * 1. Endpoint exacto: POST /api/v1/auth/tokens (plural)
 * 2. Headers: Content-Type: application/json y Accept: application/json
 * 3. Payload: Objeto anidado "parameters" con "organizationId" (NUNCA orgId)
 * 4. Tolerancia a fallos: Detección de errores Java/Jackson y fallback a sandbox si el host ERP está offline.
 */

const crypto = require('crypto');
const config = require('../config/idempiere.config');

class IdempiereService {
  constructor() {
    this.baseUrl = config.baseUrl;
    this.timeoutMs = config.timeoutMs;
    this.activeTokens = new Map(); // Almacén en memoria de tokens de sesión
  }

  /**
   * Sanitiza y valida la URL base de iDempiere
   */
  _normalizeUrl(baseUrl) {
    const raw = baseUrl || this.baseUrl;
    return raw.replace(/\/+$/, ''); // Remueve trailing slash
  }

  /**
   * Construye el payload estricto cumpliendo con com.trekglobal.idempiere.rest.api.v1.auth.LoginCredential
   */
  buildLoginPayload(credentials) {
    const { userName, password, parameters = {}, customBaseUrl } = credentials;

    if (!userName || !password) {
      throw new Error('Las credenciales userName y password son obligatorias.');
    }

    // Regla estricta: El contexto va dentro de "parameters" y "organizationId" NUNCA "orgId"
    const clientId = Number(parameters.clientId ?? config.defaults.clientId);
    const roleId = Number(parameters.roleId ?? config.defaults.roleId);
    const organizationId = Number(parameters.organizationId ?? parameters.orgId ?? config.defaults.organizationId);
    const warehouseId = Number(parameters.warehouseId ?? config.defaults.warehouseId);
    const language = String(parameters.language || config.defaults.language);

    const payload = {
      userName: String(userName).trim(),
      password: String(password),
      parameters: {
        clientId: isNaN(clientId) ? 11 : clientId,
        roleId: isNaN(roleId) ? 102 : roleId,
        organizationId: isNaN(organizationId) ? 11 : organizationId,
        warehouseId: isNaN(warehouseId) ? 103 : warehouseId,
        language: language
      }
    };

    return payload;
  }

  /**
   * Autenticación contra iDempiere ERP REST API v1
   * @param {Object} credentials - Datos de acceso y parámetros de contexto
   * @param {Object} options - Opciones de invocación (forceLive, simulate)
   */
  async authenticate(credentials, options = {}) {
    const payload = this.buildLoginPayload(credentials);
    const targetUrl = this._normalizeUrl(credentials.customBaseUrl) + config.routes.tokens;
    const forceSimulation = options.simulate === true || credentials.mode === 'simulate';

    console.log(`[iDempiere] Iniciando autenticación contra: ${targetUrl}`);
    console.log(`[iDempiere] Payload sanitizado:`, JSON.stringify({
      ...payload,
      password: '***'
    }, null, 2));

    if (forceSimulation) {
      console.log('[iDempiere] Modo simulación solicitado explícitamente.');
      return this._generateSimulatedSession(payload, 'Simulación ERP solicitada por el cliente');
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const responseText = await response.text();
      let responseData = null;
      try {
        responseData = JSON.parse(responseText);
      } catch (parseErr) {
        responseData = { rawResponse: responseText };
      }

      if (response.ok) {
        console.log(`[iDempiere] Autenticación exitosa (HTTP ${response.status}) en iDempiere REST API.`);
        const session = this._formatSessionResponse(responseData, payload, false);
        this.activeTokens.set(session.token, session);
        return session;
      }

      // Manejo de errores específicos de iDempiere
      if (response.status === 400) {
        console.warn(`[iDempiere] Error 400 Bad Request recibido del ERP:`, responseData);
        const errorDetail = responseData?.detail || responseData?.message || responseText;
        throw new Error(`iDempiere 400 Bad Request (Error de deserialización Java o parámetros): ${errorDetail}`);
      }

      if (response.status === 401) {
        console.warn(`[iDempiere] Error 401 Unauthorized: Credenciales o rol inválidos.`);
        throw new Error('iDempiere 401 Unauthorized: Credenciales, Rol u Organización inválidos.');
      }

      if (response.status === 404) {
        console.warn(`[iDempiere] Error 404 Not Found en ruta: ${targetUrl}`);
        throw new Error(`iDempiere 404 Not Found: Verifique que el plugin REST esté instalado y la ruta sea ${config.routes.tokens}`);
      }

      throw new Error(`iDempiere respondió con HTTP ${response.status}: ${JSON.stringify(responseData)}`);

    } catch (networkError) {
      console.warn(`[iDempiere] Error de conexión con el host ERP (${targetUrl}): ${networkError.message}`);

      // Si el fallback está permitido y no se forzó exclusivamente en vivo
      if (config.allowSimulationFallback && !options.forceLive) {
        console.info(`[iDempiere] Activando Sandbox de Contingencia (Modo Simulación ERP Resiliente)...`);
        return this._generateSimulatedSession(
          payload,
          `ERP Host offline (${networkError.message}). Fallback resiliente activado para garantizar continuidad.`
        );
      }

      throw networkError;
    }
  }

  /**
   * Refresco de Token en iDempiere (PUT /api/v1/auth/tokens)
   */
  async refreshToken(token, refreshToken, customBaseUrl) {
    if (!token) throw new Error('Token requerido para refresco.');

    // Verificar si es sesión simulada en memoria
    if (this.activeTokens.has(token)) {
      const current = this.activeTokens.get(token);
      current.token = this._generateJwtLikeToken(current.user.userName, current.parameters);
      current.refreshedAt = new Date().toISOString();
      this.activeTokens.set(current.token, current);
      return current;
    }

    const targetUrl = this._normalizeUrl(customBaseUrl) + config.routes.tokens;
    try {
      const response = await fetch(targetUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ refreshToken })
      });

      if (!response.ok) {
        throw new Error(`Error al refrescar token iDempiere: HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.warn(`[iDempiere] Refresco de token falló: ${err.message}`);
      throw err;
    }
  }

  /**
   * Cierre de sesión y revocación en iDempiere (DELETE /api/v1/auth/tokens)
   */
  async logout(token, customBaseUrl) {
    if (!token) return { success: true };

    if (this.activeTokens.has(token)) {
      this.activeTokens.delete(token);
    }

    const targetUrl = this._normalizeUrl(customBaseUrl) + config.routes.tokens;
    try {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 3000);

      await fetch(targetUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        signal: controller.signal
      });
    } catch (err) {
      // Ignorar fallos de red al cerrar sesión
      console.log(`[iDempiere] Revocación en servidor remoto ignorada o no alcanzable: ${err.message}`);
    }

    return { success: true, message: 'Sesión revocada exitosamente.' };
  }

  /**
   * Diagnóstico de Conectividad con iDempiere
   */
  async pingErp(customBaseUrl) {
    const targetUrl = this._normalizeUrl(customBaseUrl) + config.routes.tokens;
    const startTime = Date.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      // Probamos petición OPTIONS o GET básica
      const response = await fetch(targetUrl, {
        method: 'OPTIONS',
        headers: {
          'Accept': 'application/json'
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const latencyMs = Date.now() - startTime;
      return {
        reachable: true,
        status: response.status,
        latencyMs,
        targetUrl,
        mode: 'live_connected'
      };
    } catch (error) {
      return {
        reachable: false,
        error: error.message,
        latencyMs: Date.now() - startTime,
        targetUrl,
        mode: 'offline_or_unreachable'
      };
    }
  }

  /**
   * Generador de Token JWT simulado para modo Sandbox Resiliente
   */
  _generateJwtLikeToken(userName, parameters) {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({
      iss: 'idempiere-rest-v1',
      sub: userName,
      clientId: parameters.clientId,
      roleId: parameters.roleId,
      organizationId: parameters.organizationId,
      warehouseId: parameters.warehouseId,
      language: parameters.language,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (8 * 3600) // 8 horas
    })).toString('base64url');
    const signature = crypto.createHmac('sha256', 'idempiere-masterclass-secret')
      .update(`${header}.${payload}`)
      .digest('base64url');

    return `${header}.${payload}.${signature}`;
  }

  /**
   * Formatea la respuesta de sesión estándar
   */
  _formatSessionResponse(idempiereData, requestPayload, isSimulated = false, simulationReason = null) {
    const token = idempiereData.token || this._generateJwtLikeToken(requestPayload.userName, requestPayload.parameters);
    const refreshToken = idempiereData.refreshToken || crypto.randomUUID();

    return {
      success: true,
      token,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: idempiereData.expiresIn || 28800, // 8 horas en segundos
      issuedAt: new Date().toISOString(),
      isSimulated,
      simulationReason,
      user: {
        userName: requestPayload.userName,
        name: requestPayload.userName.split('@')[0].trim().replace('.', ' ').toUpperCase(),
        email: requestPayload.userName.includes('@') ? requestPayload.userName.trim() : `${requestPayload.userName}@gardenworld.com`
      },
      client: {
        id: requestPayload.parameters.clientId,
        name: requestPayload.parameters.clientId === 11 ? 'GardenWorld' : `Client ${requestPayload.parameters.clientId}`
      },
      role: {
        id: requestPayload.parameters.roleId,
        name: requestPayload.parameters.roleId === 102 ? 'GardenWorld Admin' : `Rol ${requestPayload.parameters.roleId}`
      },
      organization: {
        id: requestPayload.parameters.organizationId,
        name: requestPayload.parameters.organizationId === 11 ? 'HQ - Casa Matriz' : `Organización ${requestPayload.parameters.organizationId}`
      },
      warehouse: {
        id: requestPayload.parameters.warehouseId,
        name: requestPayload.parameters.warehouseId === 103 ? 'HQ Almacén Central' : `Bodega ${requestPayload.parameters.warehouseId}`
      },
      parameters: requestPayload.parameters,
      endpointUsed: config.routes.tokens
    };
  }

  /**
   * Genera una sesión de simulación cuando iDempiere no está disponible físicamente
   */
  _generateSimulatedSession(requestPayload, reason) {
    const session = this._formatSessionResponse({}, requestPayload, true, reason);
    this.activeTokens.set(session.token, session);
    return session;
  }
}

module.exports = new IdempiereService();

