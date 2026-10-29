/**
 * iDempiere ERP REST API v1 - Configuración Centralizada
 * 
 * Reglas de Blindaje Técnico:
 * - Endpoint de Tokens: /api/v1/auth/tokens (plural)
 * - Headers: Content-Type: application/json, Accept: application/json
 * - Payload: { userName, password, parameters: { clientId, roleId, organizationId, warehouseId, language } }
 */

module.exports = {
  // URL base del servidor iDempiere (puede ser sobreescrita por variable de entorno)
  baseUrl: process.env.IDEMPIERE_BASE_URL || 'http://localhost:8080',
  
  // Timeout para peticiones HTTP al ERP (en milisegundos)
  timeoutMs: parseInt(process.env.IDEMPIERE_TIMEOUT_MS || '8000', 10),

  // Parámetros por defecto para GardenWorld (entorno estándar de iDempiere)
  defaults: {
    userName: process.env.IDEMPIERE_DEFAULT_USER || 'admin @ gardenworld.com',
    clientId: parseInt(process.env.IDEMPIERE_CLIENT_ID || '11', 10),
    roleId: parseInt(process.env.IDEMPIERE_ROLE_ID || '102', 10),
    organizationId: parseInt(process.env.IDEMPIERE_ORG_ID || '11', 10),
    warehouseId: parseInt(process.env.IDEMPIERE_WAREHOUSE_ID || '103', 10),
    language: process.env.IDEMPIERE_LANGUAGE || 'en_US'
  },

  // Rutas canónicas del API REST v1 de iDempiere
  routes: {
    tokens: '/api/v1/auth/tokens',
    roles: '/api/v1/auth/roles',
    organizations: '/api/v1/auth/organizations',
    warehouses: '/api/v1/auth/warehouses',
    ping: '/api/v1/auth/tokens'
  },

  // Permitir fallback a modo simulación cuando el ERP externo no está disponible
  allowSimulationFallback: process.env.IDEMPIERE_ALLOW_FALLBACK !== 'false'
};

