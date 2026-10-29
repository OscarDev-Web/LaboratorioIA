/**
 * Middleware de Autenticación para Hamburger Rapid Admin & API
 * Valida Tokens Bearer emitidos por iDempiere REST API v1
 */

const idempiereService = require('../services/idempiereService');

/**
 * Middleware para rutas estrictamente protegidas
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Acceso no autorizado: Token Bearer requerido.',
      code: 'AUTH_TOKEN_MISSING'
    });
  }

  const token = authHeader.substring(7).trim();
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Token Bearer malformado o vacío.',
      code: 'AUTH_TOKEN_EMPTY'
    });
  }

  // Verificar si está registrado en el servicio o es un token iDempiere
  const session = idempiereService.activeTokens.get(token);
  if (session) {
    req.user = session.user;
    req.erpSession = session;
    return next();
  }

  // Si no está en el mapa pero tiene formato JWT (posible token directo de iDempiere)
  try {
    const parts = token.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
      req.user = { userName: payload.sub || 'admin' };
      req.erpSession = { parameters: payload };
      return next();
    }
  } catch (e) {
    // Fallback: token inválido
  }

  return res.status(401).json({
    success: false,
    error: 'Sesión expirada o token iDempiere inválido.',
    code: 'AUTH_TOKEN_INVALID'
  });
}

/**
 * Middleware opcional para inyectar usuario si el token está presente
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    const session = idempiereService.activeTokens.get(token);
    if (session) {
      req.user = session.user;
      req.erpSession = session;
    }
  }
  next();
}

module.exports = {
  requireAuth,
  optionalAuth
};

