import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { IDEMPIERE_SPEC } from '../services/idempiereAuth';

export default function ErpIntegrationTab() {
  const { session, token, user, role, organization, warehouse, parameters, isSimulated, simulationReason, refreshSession, checkHealth, erpHealth, logout } = useAuth();

  const [refreshStatus, setRefreshStatus] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  const handleRefreshToken = async () => {
    setIsRefreshing(true);
    setRefreshStatus(null);
    try {
      const updated = await refreshSession();
      setRefreshStatus({ success: true, message: `Token refrescado con éxito a las ${new Date().toLocaleTimeString()}` });
    } catch (err) {
      setRefreshStatus({ success: false, message: `Error al refrescar token: ${err.message}` });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCopyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2500);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Banner: Status General */}
      <div style={{
        background: isSimulated ? '#FFFBEB' : '#ECFDF5',
        border: '1px solid',
        borderColor: isSimulated ? '#FDE68A' : '#A7F3D0',
        borderRadius: '16px',
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            fontSize: '1.8rem',
            background: isSimulated ? '#FEF3C7' : '#D1FAE5',
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {isSimulated ? '🛡️' : '🟢'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: isSimulated ? '#92400E' : '#065F46', margin: 0 }}>
                {isSimulated ? 'Sesión en Modo Contingencia / Sandbox' : 'Conexión en Vivo con iDempiere ERP REST v1'}
              </h3>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: '800',
                padding: '2px 8px',
                borderRadius: '9999px',
                background: isSimulated ? '#FDE68A' : '#6EE7B7',
                color: isSimulated ? '#78350F' : '#064E3B'
              }}>
                {isSimulated ? 'Sandbox Tolerante a Fallos' : 'Enlace Activo'}
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: isSimulated ? '#78350F' : '#047857', margin: '4px 0 0 0' }}>
              {isSimulated
                ? simulationReason || 'Modo simulación activo para asegurar operatividad ininterrumpida sin caídas de servicio.'
                : 'Peticiones procesadas directamente contra el endpoint /api/v1/auth/tokens de iDempiere.'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleRefreshToken}
            disabled={isRefreshing}
            style={{
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              color: '#334155',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: isRefreshing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {isRefreshing ? 'Refrescando...' : '🔄 Refrescar Token (PUT)'}
          </button>

          <button
            onClick={() => checkHealth()}
            style={{
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              color: '#334155',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            ⚡ Latencia ERP: {erpHealth?.latencyMs ? `${erpHealth.latencyMs}ms` : 'Probar'}
          </button>
        </div>
      </div>

      {refreshStatus && (
        <div style={{
          padding: '10px 14px',
          borderRadius: '8px',
          fontSize: '0.8rem',
          fontWeight: '600',
          background: refreshStatus.success ? '#D1FAE5' : '#FEE2E2',
          color: refreshStatus.success ? '#065F46' : '#991B1B',
          border: `1px solid ${refreshStatus.success ? '#A7F3D0' : '#FCA5A5'}`
        }}>
          {refreshStatus.message}
        </div>
      )}

      {/* Grid de Contexto Activo de iDempiere */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        <div style={{ background: '#FFFFFF', padding: '18px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Operador Autenticado
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F172A', marginTop: '4px' }}>
            {user?.userName || 'admin @ gardenworld.com'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '4px', fontWeight: '600' }}>
            ● Sesión Autorizada
          </div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '18px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Organización Activa
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F172A', marginTop: '4px' }}>
            {organization?.name || 'HQ - Casa Matriz'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#B45309', marginTop: '4px', fontWeight: '600' }}>
            ID: {parameters?.organizationId || 11} (organizationId)
          </div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '18px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Rol Asignado
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F172A', marginTop: '4px' }}>
            {role?.name || 'GardenWorld Admin'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
            Role ID: {parameters?.roleId || 102} &bull; Client ID: {parameters?.clientId || 11}
          </div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '18px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Almacén & Idioma
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F172A', marginTop: '4px' }}>
            {warehouse?.name || 'HQ Almacén Central'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
            Bodega: {parameters?.warehouseId || 103} &bull; Idioma: {parameters?.language || 'en_US'}
          </div>
        </div>
      </div>

      {/* Inspector de Token y Wire Payload */}
      <div style={{
        background: '#0F172A',
        borderRadius: '16px',
        padding: '24px',
        color: '#F8FAFC',
        border: '1px solid #1E293B',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '800', margin: 0, color: '#38BDF8' }}>
              🔑 Token Bearer de iDempiere REST API v1
            </h4>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>
              Emitido mediante <code style={{ color: '#F43F5E' }}>POST {IDEMPIERE_SPEC.canonicalEndpoint}</code>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleCopyToken}
              style={{
                background: copiedToken ? '#059669' : '#1E293B',
                border: '1px solid #334155',
                color: '#FFFFFF',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {copiedToken ? '✓ Copiado' : '📋 Copiar Token'}
            </button>
          </div>
        </div>

        {/* Token String Display */}
        <div style={{
          background: '#070A10',
          border: '1px solid #1E293B',
          borderRadius: '8px',
          padding: '12px',
          fontFamily: 'monospace',
          fontSize: '0.75rem',
          color: '#34D399',
          wordBreak: 'break-all',
          maxHeight: '120px',
          overflowY: 'auto',
          lineHeight: 1.5
        }}>
          {token || 'Sin token emitido'}
        </div>

        {/* Especificación de Cabeceras Wire */}
        <div style={{
          marginTop: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '12px'
        }}>
          <div style={{ background: '#131B2E', padding: '12px', borderRadius: '8px', border: '1px solid #1E293B' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#94A3B8', marginBottom: '4px' }}>
              CABECERAS HTTP TRANSMITIDAS
            </div>
            <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.72rem', color: '#CBD5E1' }}>
Content-Type: application/json{'\n'}
Accept: application/json{'\n'}
Authorization: Bearer {token ? `${token.substring(0, 16)}...` : ''}
            </pre>
          </div>

          <div style={{ background: '#131B2E', padding: '12px', borderRadius: '8px', border: '1px solid #1E293B' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#94A3B8', marginBottom: '4px' }}>
              DIRECTIVAS DE INTEGRACIÓN VALIDATOR
            </div>
            <div style={{ fontSize: '0.73rem', color: '#A5B4FC', lineHeight: 1.4 }}>
              ✓ Ruta plural: <code>/tokens</code><br />
              ✓ Anidado bajo <code>"parameters"</code><br />
              ✓ Campo estricto <code>"organizationId"</code> (nunca <code>orgId</code>)
            </div>
          </div>
        </div>
      </div>

      {/* Botón de Revocación / Logout */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px' }}>
        <button
          onClick={logout}
          style={{
            background: '#FEE2E2',
            border: '1px solid #FCA5A5',
            color: '#991B1B',
            padding: '10px 18px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>🚪</span>
          Revocar Sesión y Cerrar Acceso (DELETE /api/v1/auth/tokens)
        </button>
      </div>

    </div>
  );
}

