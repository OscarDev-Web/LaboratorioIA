import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { IDEMPIERE_SPEC, buildIdempierePayload } from '../services/idempiereAuth';

export default function LoginScreen() {
  const { login, isAuthenticating, authError, setAuthError, erpHealth, checkHealth } = useAuth();

  const [userName, setUserName] = useState('admin @ gardenworld.com');
  const [password, setPassword] = useState('GardenAdmin');
  const [showPassword, setShowPassword] = useState(false);

  // Parámetros de contexto ERP (Regla Estricta iDempiere v1)
  const [clientId, setClientId] = useState(11);
  const [roleId, setRoleId] = useState(102);
  const [organizationId, setOrganizationId] = useState(11);
  const [warehouseId, setWarehouseId] = useState(103);
  const [language, setLanguage] = useState('en_US');

  // Opciones avanzadas de conexión
  const [customBaseUrl, setCustomBaseUrl] = useState('');
  const [connectionMode, setConnectionMode] = useState('auto'); // 'auto' | 'live' | 'simulate'
  const [showAdvancedParams, setShowAdvancedParams] = useState(false);
  const [showPayloadPreview, setShowPayloadPreview] = useState(true);

  // Payload que se enviará en el cable (en tiempo real)
  const wirePayload = useMemo(() => {
    return buildIdempierePayload({
      userName,
      password: password ? '••••••••' : '',
      parameters: {
        clientId,
        roleId,
        organizationId,
        warehouseId,
        language
      }
    });
  }, [userName, password, clientId, roleId, organizationId, warehouseId, language]);

  // Manejar Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);

    try {
      await login(
        {
          userName,
          password,
          parameters: {
            clientId: Number(clientId),
            roleId: Number(roleId),
            organizationId: Number(organizationId),
            warehouseId: Number(warehouseId),
            language
          }
        },
        {
          mode: connectionMode,
          customBaseUrl: customBaseUrl.trim() || undefined
        }
      );
    } catch (err) {
      // El error ya queda seteado en el contexto
    }
  };

  const handleFillGardenWorld = () => {
    setUserName('admin @ gardenworld.com');
    setPassword('GardenAdmin');
    setClientId(11);
    setRoleId(102);
    setOrganizationId(11);
    setWarehouseId(103);
    setLanguage('en_US');
    setAuthError(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0c0c0e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      color: '#F8FAFC',
      fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
    }}>
      <div style={{
        maxWidth: '1050px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: window.innerWidth > 900 ? '1.1fr 1.1fr' : '1fr',
        gap: '24px',
        alignItems: 'stretch'
      }}>

        {/* Panel Izquierdo: Formulario de Autenticación */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.98)',
          borderRadius: '20px',
          padding: '36px',
          color: '#0F172A',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            {/* Header del Formulario */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              <div style={{
                fontSize: '2rem',
                background: '#FEF3C7',
                border: '1px solid #FDE68A',
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 6px -1px rgba(180, 83, 9, 0.1)'
              }}>
                🍔
              </div>
              <div>
                <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.02em', margin: 0 }}>
                  Hamburger Rapid
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    background: '#FEF3C7',
                    color: '#92400E',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    border: '1px solid #FDE68A'
                  }}>
                    iDempiere REST API v1
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    Acceso al Panel de Control
                  </span>
                </div>
              </div>
            </div>

            {/* Error Banner */}
            {authError && (
              <div style={{
                background: '#FEE2E2',
                border: '1px solid #FCA5A5',
                color: '#991B1B',
                padding: '12px 14px',
                borderRadius: '10px',
                fontSize: '0.82rem',
                marginBottom: '18px',
                lineHeight: 1.4
              }}>
                <div style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>⚠️ Fallo de Autenticación iDempiere</span>
                </div>
                <div style={{ marginTop: '4px' }}>{authError}</div>
                <div style={{ marginTop: '6px', fontSize: '0.75rem', color: '#7F1D1D' }}>
                  💡 Sugerencia: Puedes activar el <strong>Modo Sandbox Local</strong> abajo para probar el panel de inmediato.
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Username Input */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                  Usuario iDempiere (userName)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                    placeholder="admin @ gardenworld.com"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.88rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#334155' }}>
                    Contraseña (password)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '0.75rem',
                      color: '#B45309',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    {showPassword ? 'Ocultar' : 'Ver'}
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="GardenAdmin"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.88rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Quick Fill Button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <button
                  type="button"
                  onClick={handleFillGardenWorld}
                  style={{
                    background: '#F1F5F9',
                    border: '1px solid #E2E8F0',
                    color: '#334155',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  🌱 Cargar GardenWorld Demo
                </button>

                <button
                  type="button"
                  onClick={() => setShowAdvancedParams(!showAdvancedParams)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  {showAdvancedParams ? '▲ Ocultar Parámetros ERP' : '▼ Editar Parámetros ERP'}
                </button>
              </div>

              {/* Parámetros de Contexto Desplegables */}
              {showAdvancedParams && (
                <div style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '10px',
                  padding: '14px',
                  marginBottom: '18px'
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#0F172A', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    ⚙️ Contexto ERP iDempiere (parameters)
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#475569', marginBottom: '3px' }}>
                        Client ID (11: GardenWorld)
                      </label>
                      <input
                        type="number"
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value)}
                        style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#475569', marginBottom: '3px' }}>
                        Role ID (102: GardenAdmin)
                      </label>
                      <input
                        type="number"
                        value={roleId}
                        onChange={(e) => setRoleId(e.target.value)}
                        style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#B45309', marginBottom: '3px' }}>
                        organizationId (11: HQ) <span style={{ fontSize: '0.65rem', background: '#FEF3C7', padding: '1px 4px', borderRadius: '4px' }}>Obligatorio</span>
                      </label>
                      <input
                        type="number"
                        value={organizationId}
                        onChange={(e) => setOrganizationId(e.target.value)}
                        style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #F59E0B', fontSize: '0.8rem', boxSizing: 'border-box', fontWeight: 'bold' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#475569', marginBottom: '3px' }}>
                        Warehouse ID (103: Almacén)
                      </label>
                      <input
                        type="number"
                        value={warehouseId}
                        onChange={(e) => setWarehouseId(e.target.value)}
                        style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#475569', marginBottom: '3px' }}>
                        Idioma (language)
                      </label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem', boxSizing: 'border-box' }}
                      >
                        <option value="en_US">en_US (Inglés)</option>
                        <option value="es_ES">es_ES (Español)</option>
                        <option value="es_MX">es_MX (Español México)</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#475569', marginBottom: '3px' }}>
                        Host ERP URL (Opcional)
                      </label>
                      <input
                        type="text"
                        placeholder="http://localhost:8080"
                        value={customBaseUrl}
                        onChange={(e) => setCustomBaseUrl(e.target.value)}
                        style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Modo de Conexión Selector */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                  Modo de Operación de la Conexión:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setConnectionMode('auto')}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '8px',
                      fontSize: '0.76rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      border: connectionMode === 'auto' ? '2px solid #B45309' : '1px solid #E2E8F0',
                      background: connectionMode === 'auto' ? '#FEF3C7' : '#FFFFFF',
                      color: connectionMode === 'auto' ? '#92400E' : '#475569',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '2px'
                    }}
                  >
                    <span>⚡ Automático / Híbrido</span>
                    <span style={{ fontSize: '0.65rem', fontWeight: '500' }}>En vivo con fallback sandbox</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConnectionMode('simulate')}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '8px',
                      fontSize: '0.76rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      border: connectionMode === 'simulate' ? '2px solid #2563EB' : '1px solid #E2E8F0',
                      background: connectionMode === 'simulate' ? '#DBEAFE' : '#FFFFFF',
                      color: connectionMode === 'simulate' ? '#1E40AF' : '#475569',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '2px'
                    }}
                  >
                    <span>🛡️ Sandbox Local</span>
                    <span style={{ fontSize: '0.65rem', fontWeight: '500' }}>Ideal para demo sin ERP</span>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isAuthenticating}
                style={{
                  width: '100%',
                  background: isAuthenticating ? '#94A3B8' : '#B45309',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '13px 20px',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontWeight: '800',
                  cursor: isAuthenticating ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(180, 83, 9, 0.25)',
                  transition: 'background 0.2s, transform 0.1s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {isAuthenticating ? (
                  <>
                    <span style={{ animation: 'spin 1s infinite linear' }}>🔄</span>
                    Conectando con iDempiere REST API v1...
                  </>
                ) : (
                  <>
                    <span>🔐 Autenticar y Acceder al Panel</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* ERP Health Indicator Footer */}
          <div style={{
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.73rem',
            color: '#64748B'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: erpHealth?.reachable ? '#10B981' : '#F59E0B'
              }}></span>
              <span>
                {erpHealth?.reachable
                  ? `ERP Detectado (${erpHealth.latencyMs}ms)`
                  : 'Host ERP local no detectado (Fallback activo)'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => checkHealth(customBaseUrl)}
              style={{
                background: 'none',
                border: 'none',
                color: '#B45309',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '0.73rem'
              }}
            >
              🔄 Sondear ERP
            </button>
          </div>
        </div>

        {/* Panel Derecho: Inspector de Protocolo Wire iDempiere v1 */}
        <div style={{
          background: '#0B0F19',
          borderRadius: '20px',
          padding: '30px',
          border: '1px solid #1E293B',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>📜</span>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#F8FAFC', margin: 0 }}>
                  Blindaje Técnico iDempiere v1
                </h3>
              </div>
              <span style={{
                fontSize: '0.68rem',
                fontFamily: 'monospace',
                background: '#1E293B',
                color: '#38BDF8',
                padding: '3px 8px',
                borderRadius: '6px',
                border: '1px solid #334155'
              }}>
                RFC REST v1
              </span>
            </div>

            <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '16px', lineHeight: 1.5 }}>
              Para evitar errores <strong>HTTP 404</strong>, <strong>HTTP 400</strong> o excepciones Java (<code style={{ color: '#F43F5E', background: '#1E1E24', padding: '1px 4px', borderRadius: '3px' }}>LoginCredential</code>), este cliente implementa estrictamente las directivas técnicas:
            </div>

            {/* Directiva 1: Endpoint Plural */}
            <div style={{
              background: '#131B2E',
              border: '1px solid #1E293B',
              borderRadius: '8px',
              padding: '10px 12px',
              marginBottom: '10px',
              fontSize: '0.75rem'
            }}>
              <div style={{ fontWeight: '700', color: '#38BDF8', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>✅ Directiva A: Endpoint Base de Emisión</span>
              </div>
              <div style={{ fontFamily: 'monospace', color: '#F1F5F9', background: '#0F172A', padding: '6px 8px', borderRadius: '4px' }}>
                <span style={{ color: '#F43F5E', fontWeight: 'bold' }}>POST</span> {IDEMPIERE_SPEC.canonicalEndpoint}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '4px' }}>
                OBLIGATORIAMENTE en plural: <code style={{ color: '#38BDF8' }}>/tokens</code> (NUNCA /token).
              </div>
            </div>

            {/* Directiva 2: Headers HTTP */}
            <div style={{
              background: '#131B2E',
              border: '1px solid #1E293B',
              borderRadius: '8px',
              padding: '10px 12px',
              marginBottom: '10px',
              fontSize: '0.75rem'
            }}>
              <div style={{ fontWeight: '700', color: '#38BDF8', marginBottom: '4px' }}>
                ✅ Directiva B: Cabeceras HTTP Obligatorias
              </div>
              <div style={{ fontFamily: 'monospace', color: '#A5B4FC', background: '#0F172A', padding: '6px 8px', borderRadius: '4px', fontSize: '0.72rem' }}>
                Content-Type: application/json<br />
                Accept: application/json
              </div>
            </div>

            {/* Directiva 3: Payload JSON Interactivo */}
            <div style={{
              background: '#131B2E',
              border: '1px solid #1E293B',
              borderRadius: '8px',
              padding: '10px 12px',
              fontSize: '0.75rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ fontWeight: '700', color: '#38BDF8' }}>
                  ✅ Directiva C: Payload Wire Transmitido
                </div>
                <span style={{ fontSize: '0.65rem', background: '#059669', color: '#ECFDF5', padding: '1px 6px', borderRadius: '4px' }}>
                  Validador Activo
                </span>
              </div>

              <pre style={{
                fontFamily: 'monospace',
                background: '#070A10',
                color: '#34D399',
                padding: '10px',
                borderRadius: '6px',
                fontSize: '0.73rem',
                overflowX: 'auto',
                lineHeight: 1.4,
                margin: 0,
                border: '1px solid #1E293B'
              }}>
                {JSON.stringify(wirePayload, null, 2)}
              </pre>

              <div style={{ fontSize: '0.7rem', color: '#FBBF24', marginTop: '6px', lineHeight: 1.3 }}>
                ⚠️ Observa: El campo se llama <strong>"organizationId"</strong> (NUNCA "orgId") y reside dentro del objeto anidado <strong>"parameters"</strong>.
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '20px',
            paddingTop: '14px',
            borderTop: '1px solid #1E293B',
            fontSize: '0.72rem',
            color: '#64748B',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>Plataforma Hamburger Rapid &bull; Dokploy CI/CD</span>
            <a
              href="/"
              style={{
                color: '#F59E0B',
                textDecoration: 'none',
                fontWeight: '700'
              }}
            >
              ← Ir al Catálogo E-commerce
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

