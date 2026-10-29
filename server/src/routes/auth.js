/**
 * Rutas de Autenticación iDempiere REST API v1
 * 
 * Reglas de Blindaje Técnico:
 * - Emisión: POST /api/v1/auth/tokens
 * - Headers: Content-Type: application/json, Accept: application/json
 * - Payload: { userName, password, parameters: { clientId, roleId, organizationId, warehouseId, language } }
 */

const express = require('express');
const router = express.Router();
const idempiereService = require('../services/idempiereService');
const config = require('../config/idempiere.config');
const { requireAuth } = require('../middleware/auth');

/**
 * POST /api/auth/login
 * Autentica al operador contra iDempiere ERP REST API v1
 */
router.post('/login', async (req, res) => {
  try {
    const { userName, password, parameters = {}, customBaseUrl, mode } = req.body;

    if (!userName || !password) {
      return res.status(400).json({
        success: false,
        error: 'Las credenciales userName y password son obligatorias.',
        requiredContract: {
          userName: 'admin @ gardenworld.com',
          password: 'TuPassword',
          parameters: {
            clientId: 11,
            roleId: 102,
            organizationId: 11,
            warehouseId: 103,
            language: 'en_US'
          }
        }
      });
    }

    // Regla Estricta: Mapear 'orgId' a 'organizationId' si el cliente lo envió erróneamente
    if (parameters.orgId !== undefined && parameters.organizationId === undefined) {
      parameters.organizationId = parameters.orgId;
      delete parameters.orgId;
    }

    const session = await idempiereService.authenticate({
      userName,
      password,
      parameters,
      customBaseUrl,
      mode
    });

    res.json({
      success: true,
      message: 'Autenticación con iDempiere exitosa',
      session
    });

  } catch (error) {
    console.error('[Auth Error]', error.message);
    res.status(401).json({
      success: false,
      error: error.message,
      targetEndpoint: config.routes.tokens,
      help: 'Verifique que la URL de iDempiere sea accesible y que las credenciales/contexto (Client, Rol, Organización, Bodega) sean válidos.'
    });
  }
});

/**
 * POST /api/auth/refresh
 * Refresca un token existente mediante PUT /api/v1/auth/tokens
 */
router.post('/refresh', async (req, res) => {
  try {
    const { token, refreshToken, customBaseUrl } = req.body;
    const session = await idempiereService.refreshToken(token, refreshToken, customBaseUrl);
    res.json({
      success: true,
      message: 'Token de iDempiere renovado',
      session
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/auth/logout
 * Revoca el token en iDempiere mediante DELETE /api/v1/auth/tokens
 */
router.post('/logout', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : req.body.token;
    const result = await idempiereService.logout(token, req.body.customBaseUrl);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/auth/verify
 * Verifica la validez de un token y devuelve el contexto activo
 */
router.get('/verify', requireAuth, (req, res) => {
  res.json({
    valid: true,
    user: req.user,
    session: req.erpSession
  });
});

/**
 * GET /api/auth/config
 * Devuelve la configuración pública por defecto de iDempiere
 */
router.get('/config', (req, res) => {
  res.json({
    baseUrl: config.baseUrl,
    timeoutMs: config.timeoutMs,
    defaults: config.defaults,
    canonicalEndpoint: config.routes.tokens,
    specRules: {
      endpoint: 'POST /api/v1/auth/tokens',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      requiredPayloadStructure: {
        userName: 'string',
        password: 'string',
        parameters: {
          clientId: 'number (ej: 11)',
          roleId: 'number (ej: 102)',
          organizationId: 'number (ej: 11) - OBLIGATORIO organizationId (NUNCA orgId)',
          warehouseId: 'number (ej: 103)',
          language: 'string (ej: "en_US")'
        }
      }
    }
  });
});

/**
 * GET /api/auth/erp-health
 * Prueba de conectividad en vivo hacia la instancia de iDempiere
 */
router.get('/erp-health', async (req, res) => {
  const customBaseUrl = req.query.url;
  const health = await idempiereService.pingErp(customBaseUrl);
  res.json(health);
});

module.exports = router;

