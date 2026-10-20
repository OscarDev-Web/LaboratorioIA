import React, { useState, useEffect } from 'react';

// Default initial burgers in case server is not running or offline
const INITIAL_ADMIN_BURGERS = [
  {
    id: 1,
    name: 'Rey de las Burgers',
    category: 'A la Parrilla',
    specialty: 'Suprema Legendaria',
    specialtyBadge: '👑 Suprema Legendaria',
    price: 14.99,
    stock: 45,
    salesCount: 428,
    rating: 4.98,
    isAvailable: true,
    cookTime: '12-14 min',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80',
    description: 'Triple carne Angus (450g) flameada a la leña, triple cheddar fundido, cebolla al bourbon y panceta crocante.'
  },
  {
    id: 2,
    name: 'Burger Real Clásica',
    category: 'Clásicas de la Casa',
    specialty: 'Tradicional Oro',
    specialtyBadge: '⭐ Clásica Premium',
    price: 10.50,
    stock: 60,
    salesCount: 512,
    rating: 4.92,
    isAvailable: true,
    cookTime: '8-10 min',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop&q=80',
    description: 'Medallón Angus de 180g a la brasa, queso cheddar fundido, lechuga romana fresca, tomate y aderezo imperial.'
  },
  {
    id: 3,
    name: 'Burger Real Doble',
    category: 'Smash & Dobles',
    specialty: 'Master Double',
    specialtyBadge: '🔥 Doble Signature',
    price: 13.50,
    stock: 38,
    salesCount: 385,
    rating: 4.95,
    isAvailable: true,
    cookTime: '10-12 min',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=80',
    description: 'Doble smash caramelizado (300g), doble gouda fundido, bacon ahumado crujiente al manzano y finos aros de cebolla.'
  },
  {
    id: 4,
    name: 'Burger Doble Especial',
    category: 'Especialidades',
    specialty: 'Especial del Chef',
    specialtyBadge: '🏆 Alta Cocina',
    price: 15.99,
    stock: 30,
    salesCount: 294,
    rating: 4.97,
    isAvailable: true,
    cookTime: '12-15 min',
    image: 'https://images.unsplash.com/photo-1583032015879-a562141d3c01?w=500&auto=format&fit=crop&q=80',
    description: 'Carne madurada 21 días, huevo campero frito, provolone ahumado, panceta crocante y alioli de trufas negras.'
  },
  {
    id: 5,
    name: 'Smash Trufa Imperial',
    category: 'Gourmet Signature',
    specialty: 'Gourmet Trufada',
    specialtyBadge: '🍄 Trufa Negra',
    price: 16.50,
    stock: 25,
    salesCount: 210,
    rating: 4.99,
    isAvailable: true,
    cookTime: '10-12 min',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&auto=format&fit=crop&q=80',
    description: 'Carne Angus madurada smash, queso Brie francés fundido, portobellos salteados y mayonesa de trufa negra.'
  },
  {
    id: 6,
    name: 'Crispy Chicken Real Ranch',
    category: 'Pollo Crujiente',
    specialty: 'Pollo Crujiente',
    specialtyBadge: '🍗 Ultra Crispy 24h',
    price: 11.99,
    stock: 40,
    salesCount: 340,
    rating: 4.91,
    isAvailable: true,
    cookTime: '10 min',
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500&auto=format&fit=crop&q=80',
    description: 'Pechuga marinada 24h en suero de mantequilla, rebozado estilo sureño crujiente, ensalada coleslaw y aderezo ranch.'
  },
  {
    id: 7,
    name: 'Bacon Smokehouse BBQ',
    category: 'A la Parrilla',
    specialty: 'Ahumada al Roble',
    specialtyBadge: '🥓 Ahumada con Nogal',
    price: 13.99,
    stock: 50,
    salesCount: 395,
    rating: 4.93,
    isAvailable: true,
    cookTime: '11 min',
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500&auto=format&fit=crop&q=80',
    description: 'Carne Angus asada sobre brasas vivas, cuatro lonchas de panceta ahumada con nogal, queso monterey jack y salsa BBQ.'
  },
  {
    id: 8,
    name: 'Guacamole Spicy Fire',
    category: 'Especialidades',
    specialty: 'Fuego Tex-Mex',
    specialtyBadge: '🌶️ Tex-Mex Picante',
    price: 12.50,
    stock: 35,
    salesCount: 260,
    rating: 4.89,
    isAvailable: true,
    cookTime: '9 min',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&auto=format&fit=crop&q=80',
    description: 'Carne Angus marinada con chiles secos, queso pepper jack fundido, abundante guacamole rústico casero y salsa chipotle.'
  },
  {
    id: 9,
    name: 'Cuatro Quesos Nobles',
    category: 'Especialidades',
    specialty: 'Queso Fundido Oro',
    specialtyBadge: '🧀 Cascada 4 Quesos',
    price: 13.25,
    stock: 32,
    salesCount: 310,
    rating: 4.94,
    isAvailable: true,
    cookTime: '10 min',
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=500&auto=format&fit=crop&q=80',
    description: 'Carne jugosa de res combinada con queso Cheddar inglés madurado, Provolone hilado, crema Gorgonzola y Emmental.'
  },
  {
    id: 10,
    name: 'Veggie Royal Deluxe',
    category: 'Veggie & Saludable',
    specialty: 'Plant-Based Gourmet',
    specialtyBadge: '🌿 100% Plant-Based',
    price: 11.50,
    stock: 28,
    salesCount: 195,
    rating: 4.90,
    isAvailable: true,
    cookTime: '8 min',
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500&auto=format&fit=crop&q=80',
    description: 'Medallón de lentejas tostadas, setas portobello y quinoa real, queso vegetal cremoso, rúcula y alioli de aguacate.'
  }
];

const INITIAL_ADMIN_CUSTOMERS = [
  {
    id: 'CUST-001',
    name: 'Valentina Restrepo',
    email: 'valentina.r@rapidmail.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    tier: 'VIP Diamond',
    tierBadge: '💎 Diamond VIP',
    badgeColor: '#581C87',
    badgeBg: '#F3E8FF',
    burgersConsumed: 38,
    totalSpent: 542.80,
    favoriteBurger: 'Rey de las Burgers',
    lastOrder: 'Hace 2 horas',
    ordersCount: 19,
    loyaltyPoints: 450
  },
  {
    id: 'CUST-002',
    name: 'Carlos Mendoza',
    email: 'carlos.m@techcorp.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    tier: 'VIP Diamond',
    tierBadge: '💎 Diamond VIP',
    badgeColor: '#581C87',
    badgeBg: '#F3E8FF',
    burgersConsumed: 29,
    totalSpent: 418.50,
    favoriteBurger: 'Burger Real Doble',
    lastOrder: 'Ayer',
    ordersCount: 14,
    loyaltyPoints: 380
  },
  {
    id: 'CUST-003',
    name: 'Lucía Fernández',
    email: 'lucia.f@creativearts.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    tier: 'Gold Gourmet',
    tierBadge: '🥇 Gold Gourmet',
    badgeColor: '#92400E',
    badgeBg: '#FEF3C7',
    burgersConsumed: 18,
    totalSpent: 264.20,
    favoriteBurger: 'Smash Trufa Imperial',
    lastOrder: 'Hace 3 días',
    ordersCount: 9,
    loyaltyPoints: 240
  },
  {
    id: 'CUST-004',
    name: 'Mateo Sandoval',
    email: 'mateo.s@devstudio.net',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    tier: 'Gold Gourmet',
    tierBadge: '🥇 Gold Gourmet',
    badgeColor: '#92400E',
    badgeBg: '#FEF3C7',
    burgersConsumed: 14,
    totalSpent: 198.00,
    favoriteBurger: 'Burger Doble Especial',
    lastOrder: 'Hace 4 días',
    ordersCount: 7,
    loyaltyPoints: 190
  },
  {
    id: 'CUST-005',
    name: 'Sofía Navarro',
    email: 'sofia.navarro@global.org',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    tier: 'Silver Regular',
    tierBadge: '🥈 Silver Regular',
    badgeColor: '#334155',
    badgeBg: '#E2E8F0',
    burgersConsumed: 8,
    totalSpent: 98.50,
    favoriteBurger: 'Crispy Chicken Real Ranch',
    lastOrder: 'Hace 1 semana',
    ordersCount: 4,
    loyaltyPoints: 95
  },
  {
    id: 'CUST-006',
    name: 'Javier Alarcón',
    email: 'javier.a@freelance.dev',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    tier: 'Silver Regular',
    tierBadge: '🥈 Silver Regular',
    badgeColor: '#334155',
    badgeBg: '#E2E8F0',
    burgersConsumed: 6,
    totalSpent: 79.90,
    favoriteBurger: 'Bacon Smokehouse BBQ',
    lastOrder: 'Hace 2 semanas',
    ordersCount: 3,
    loyaltyPoints: 75
  },
  {
    id: 'CUST-007',
    name: 'Elena Gómez',
    email: 'elena.g@fintech.co',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    tier: 'Nuevo Explorador',
    tierBadge: '🌱 Explorador',
    badgeColor: '#166534',
    badgeBg: '#DCFCE7',
    burgersConsumed: 2,
    totalSpent: 26.50,
    favoriteBurger: 'Burger Real Clásica',
    lastOrder: 'Hace 3 semanas',
    ordersCount: 1,
    loyaltyPoints: 30
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'burgers' | 'customers' | 'database'
  const [burgers, setBurgers] = useState(INITIAL_ADMIN_BURGERS);
  const [customers, setCustomers] = useState(INITIAL_ADMIN_CUSTOMERS);
  const [serverHealth, setServerHealth] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Search & Filter in Burgers Table
  const [burgerSearch, setBurgerSearch] = useState('');
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState('all');

  // Customer Filter
  const [customerTierFilter, setCustomerTierFilter] = useState('all');

  // Add Burger Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBurger, setNewBurger] = useState({
    name: '',
    category: 'Especialidades',
    specialty: 'Gourmet',
    specialtyBadge: '⭐ Novedad Gourmet',
    price: '',
    stock: '',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80',
    description: ''
  });

  // Fetch API Health & Stats
  const fetchHealthAndStats = () => {
    setIsLoading(true);
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setServerHealth(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.warn('API /api/health no disponible de inmediato, operando con telemetría local:', err.message);
        setIsLoading(false);
      });

    // Also attempt to sync product catalog from backend
    fetch('/api/products')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data && json.data.length > 0) {
          // Merge with local availability state
          setBurgers(prev => {
            return json.data.map(p => {
              const prevItem = prev.find(x => x.id === p.id || x.name === p.name);
              return {
                ...p,
                isAvailable: prevItem ? prevItem.isAvailable : true,
                salesCount: p.salesCount || prevItem?.salesCount || 150,
                rating: p.rating || 4.95
              };
            });
          });
        }
      })
      .catch(err => console.log('Products API local fallback:', err.message));
  };

  useEffect(() => {
    fetchHealthAndStats();
  }, []);

  // Stock Adjustment
  const adjustStock = (id, delta) => {
    setBurgers(prev => prev.map(b => {
      if (b.id === id) {
        const nextStock = Math.max(0, b.stock + delta);
        return { ...b, stock: nextStock };
      }
      return b;
    }));
  };

  // Toggle Burger Availability
  const toggleAvailability = (id) => {
    setBurgers(prev => prev.map(b => {
      if (b.id === id) {
        const nextState = !b.isAvailable;
        return { ...b, isAvailable: nextState };
      }
      return b;
    }));
  };

  // Handle Add New Burger
  const handleCreateBurger = (e) => {
    e.preventDefault();
    if (!newBurger.name || !newBurger.price) {
      alert('Por favor especifica al menos nombre y precio.');
      return;
    }

    const created = {
      id: Date.now(),
      name: newBurger.name,
      category: newBurger.category,
      specialty: newBurger.specialty,
      specialtyBadge: newBurger.specialtyBadge,
      price: parseFloat(newBurger.price) || 12.00,
      stock: parseInt(newBurger.stock, 10) || 25,
      salesCount: 0,
      rating: 5.0,
      isAvailable: true,
      cookTime: '10 min',
      image: newBurger.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80',
      description: newBurger.description || 'Nueva especialidad agregada desde el Panel de Operaciones.'
    };

    setBurgers(prev => [created, ...prev]);
    setIsAddModalOpen(false);
    setNewBurger({
      name: '',
      category: 'Especialidades',
      specialty: 'Gourmet',
      specialtyBadge: '⭐ Novedad Gourmet',
      price: '',
      stock: '',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80',
      description: ''
    });

    // Notify backend
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(created)
    }).catch(err => console.log('Backend notification omitted:', err.message));

    setStatusMessage('¡Hamburguesa agregada exitosamente al catálogo comercial!');
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // Reset Demo Catalog
  const handleResetCatalog = () => {
    if (confirm('¿Restablecer el catálogo y métricas demo de Hamburger Rapid?')) {
      fetch('/api/reset', { method: 'POST' })
        .then(() => {
          fetchHealthAndStats();
          setStatusMessage('Catálogo y métricas restablecidos a los valores oficiales.');
          setTimeout(() => setStatusMessage(null), 3500);
        })
        .catch(() => {
          setBurgers(INITIAL_ADMIN_BURGERS);
          setCustomers(INITIAL_ADMIN_CUSTOMERS);
          setStatusMessage('Datos restablecidos localmente.');
          setTimeout(() => setStatusMessage(null), 3500);
        });
    }
  };

  // Calculations
  const totalRevenue = customers.reduce((acc, c) => acc + c.totalSpent, 0) + 24200.00;
  const totalBurgersInStock = burgers.reduce((acc, b) => acc + b.stock, 0);
  const totalBurgersDispatched = burgers.reduce((acc, b) => acc + b.salesCount, 0) + 1800;
  const totalCustomersCount = customers.length * 90; // Projection factor

  // Consumption Segmentation Tiers
  const tierVipCount = customers.filter(c => c.burgersConsumed >= 25).length;
  const tierGoldCount = customers.filter(c => c.burgersConsumed >= 10 && c.burgersConsumed < 25).length;
  const tierSilverCount = customers.filter(c => c.burgersConsumed >= 4 && c.burgersConsumed < 10).length;
  const tierNewCount = customers.filter(c => c.burgersConsumed < 4).length;

  // Filtered Burgers
  const filteredBurgers = burgers.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(burgerSearch.toLowerCase()) ||
                          b.category.toLowerCase().includes(burgerSearch.toLowerCase());
    const matchesSpecialty = selectedSpecialtyFilter === 'all' || b.specialty.includes(selectedSpecialtyFilter);
    return matchesSearch && matchesSpecialty;
  });

  // Filtered Customers
  const filteredCustomers = customers.filter(c => {
    if (customerTierFilter === 'all') return true;
    if (customerTierFilter === 'diamond') return c.burgersConsumed >= 25;
    if (customerTierFilter === 'gold') return c.burgersConsumed >= 10 && c.burgersConsumed < 25;
    if (customerTierFilter === 'silver') return c.burgersConsumed >= 4 && c.burgersConsumed < 10;
    if (customerTierFilter === 'new') return c.burgersConsumed < 4;
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', color: '#0F172A', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navbar */}
      <header style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        padding: '14px 28px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              fontSize: '1.7rem',
              background: '#FEF3C7',
              border: '1px solid #FDE68A',
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              🍔
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.02em' }}>
                  Hamburger Rapid
                </h1>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: '800',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  background: '#FEF3C7',
                  color: '#92400E',
                  border: '1px solid #FDE68A'
                }}>
                  Operations Suite v1.0
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                Panel Administrativo &bull; Paleta Clara Premium
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Live DB Indicator */}
            <div style={{
              background: serverHealth?.database?.connected ? '#D1FAE5' : '#FEF3C7',
              border: '1px solid',
              borderColor: serverHealth?.database?.connected ? '#A7F3D0' : '#FDE68A',
              color: serverHealth?.database?.connected ? '#065F46' : '#92400E',
              padding: '6px 12px',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ fontSize: '0.6rem' }}>●</span>
              {serverHealth?.database?.mode === 'mysql' ? '🐬 MySQL Conectado' : '⚡ Memoria Activa (DB In-Memory)'}
            </div>

            <a
              href="/"
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                color: '#334155',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: '700',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              🌐 E-commerce
            </a>

            <a
              href="/app"
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                color: '#B45309',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: '700',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              📱 PWA Mobile
            </a>

            <button
              onClick={fetchHealthAndStats}
              style={{
                background: '#B45309',
                color: '#FFFFFF',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              🔄 {isLoading ? 'Cargando...' : 'Actualizar'}
            </button>
          </div>
        </div>
      </header>

      {/* Status Alert Banner */}
      {statusMessage && (
        <div style={{
          background: '#D1FAE5',
          borderBottom: '1px solid #A7F3D0',
          color: '#065F46',
          padding: '10px 24px',
          textAlign: 'center',
          fontSize: '0.85rem',
          fontWeight: '700'
        }}>
          ✔ {statusMessage}
        </div>
      )}

      {/* Main Container */}
      <div style={{ maxWidth: '1300px', margin: '0 auto', width: '100%', padding: '24px 28px', flex: 1 }}>
        
        {/* Navigation Tabs Bar */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid #E2E8F0',
          marginBottom: '24px',
          paddingBottom: '2px'
        }}>
          {[
            { id: 'overview', label: '📊 Vista General', badge: null },
            { id: 'burgers', label: '🍔 Catálogo de Hamburguesas', badge: burgers.length },
            { id: 'customers', label: '👥 Consumidores & Clientes', badge: customers.length },
            { id: 'database', label: '🗄️ Estado de la Base de Datos', badge: serverHealth?.database?.connected ? 'MySQL' : 'Memory' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? '#FFFFFF' : 'transparent',
                border: '1px solid',
                borderColor: activeTab === tab.id ? '#CBD5E1' : 'transparent',
                borderBottomColor: activeTab === tab.id ? '#FFFFFF' : 'transparent',
                color: activeTab === tab.id ? '#B45309' : '#64748B',
                padding: '10px 18px',
                borderTopLeftRadius: '10px',
                borderTopRightRadius: '10px',
                fontWeight: activeTab === tab.id ? '800' : '600',
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '-1px',
                transition: 'all 0.15s'
              }}
            >
              {tab.label}
              {tab.badge !== null && (
                <span style={{
                  fontSize: '0.7rem',
                  padding: '2px 6px',
                  borderRadius: '9999px',
                  background: activeTab === tab.id ? '#FEF3C7' : '#E2E8F0',
                  color: activeTab === tab.id ? '#92400E' : '#475569',
                  fontWeight: '700'
                }}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ==================== TAB 1: OVERVIEW ==================== */}
        {activeTab === 'overview' && (
          <div className="fade-in">
            {/* KPI Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '18px', marginBottom: '28px' }}>
              
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Ingresos Brutos</span>
                  <span style={{ fontSize: '1.2rem', background: '#D1FAE5', color: '#065F46', padding: '6px', borderRadius: '8px' }}>💰</span>
                </div>
                <div style={{ fontSize: '1.9rem', fontWeight: '800', color: '#0F172A', marginTop: '10px' }}>
                  ${totalRevenue.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: '700', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>↗ +18.4%</span>
                  <span style={{ color: '#94A3B8', fontWeight: '500' }}>vs mes anterior</span>
                </div>
              </div>

              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Burgers Despachadas</span>
                  <span style={{ fontSize: '1.2rem', background: '#FEF3C7', color: '#92400E', padding: '6px', borderRadius: '8px' }}>🍔</span>
                </div>
                <div style={{ fontSize: '1.9rem', fontWeight: '800', color: '#0F172A', marginTop: '10px' }}>
                  {totalBurgersDispatched.toLocaleString()} u.
                </div>
                <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: '700', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>↗ +12.6%</span>
                  <span style={{ color: '#94A3B8', fontWeight: '500' }}>alta demanda</span>
                </div>
              </div>

              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Consumidores Registrados</span>
                  <span style={{ fontSize: '1.2rem', background: '#DBEAFE', color: '#1E40AF', padding: '6px', borderRadius: '8px' }}>👥</span>
                </div>
                <div style={{ fontSize: '1.9rem', fontWeight: '800', color: '#0F172A', marginTop: '10px' }}>
                  {totalCustomersCount}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#2563EB', fontWeight: '700', marginTop: '6px' }}>
                  7 VIP Diamond identificados
                </div>
              </div>

              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Stock Total Cocina</span>
                  <span style={{ fontSize: '1.2rem', background: '#F3E8FF', color: '#6B21A8', padding: '6px', borderRadius: '8px' }}>📦</span>
                </div>
                <div style={{ fontSize: '1.9rem', fontWeight: '800', color: '#0F172A', marginTop: '10px' }}>
                  {totalBurgersInStock} unidades
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: '600', marginTop: '6px' }}>
                  En 10 variantes activas
                </div>
              </div>
            </div>

            {/* Quick Two-Column View */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
              
              {/* Top Selling Burgers */}
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F172A' }}>
                      🔥 Hamburguesas Más Demandadas
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: '#64748B' }}>Rendimiento en tiempo real por volumen de ventas</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('burgers')}
                    style={{ background: 'none', border: 'none', color: '#B45309', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer' }}
                  >
                    Ver todas (10) →
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {burgers.slice(0, 4).map((burger, i) => (
                    <div key={burger.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#94A3B8', width: '20px' }}>#{i+1}</span>
                        <img src={burger.image} alt={burger.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0F172A' }}>{burger.name}</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{burger.specialtyBadge} &bull; ${burger.price.toFixed(2)}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#B45309' }}>{burger.salesCount} ventas</div>
                        <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: '600' }}>Stock: {burger.stock} disp.</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consumption Segments Widget */}
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
                  👥 Segmentación de Consumidores
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '18px' }}>
                  Comportamiento según volumen de hamburguesas consumidas
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '700', color: '#581C87' }}>💎 Diamond VIP (&gt;25 burgers)</span>
                      <strong>{tierVipCount} clientes ({Math.round((tierVipCount/customers.length)*100)}%)</strong>
                    </div>
                    <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ width: `${(tierVipCount/customers.length)*100}%`, height: '100%', background: '#9333EA' }}></div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '700', color: '#92400E' }}>🥇 Gold Gourmet (10 - 24 burgers)</span>
                      <strong>{tierGoldCount} clientes ({Math.round((tierGoldCount/customers.length)*100)}%)</strong>
                    </div>
                    <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ width: `${(tierGoldCount/customers.length)*100}%`, height: '100%', background: '#D97706' }}></div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '700', color: '#334155' }}>🥈 Silver Regular (4 - 9 burgers)</span>
                      <strong>{tierSilverCount} clientes ({Math.round((tierSilverCount/customers.length)*100)}%)</strong>
                    </div>
                    <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ width: `${(tierSilverCount/customers.length)*100}%`, height: '100%', background: '#64748B' }}></div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '700', color: '#166534' }}>🌱 Exploradores (1 - 3 burgers)</span>
                      <strong>{tierNewCount} clientes ({Math.round((tierNewCount/customers.length)*100)}%)</strong>
                    </div>
                    <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ width: `${(tierNewCount/customers.length)*100}%`, height: '100%', background: '#10B981' }}></div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('customers')}
                  style={{
                    width: '100%',
                    marginTop: '20px',
                    background: '#F8FAFC',
                    border: '1px solid #CBD5E1',
                    color: '#334155',
                    padding: '10px',
                    borderRadius: '10px',
                    fontWeight: '700',
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  Ver Listado Completo de Consumidores →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: BURGERS CATALOG ==================== */}
        {activeTab === 'burgers' && (
          <div className="fade-in">
            {/* Header Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0F172A' }}>
                  Catálogo de 10 Variantes Disponibles
                </h2>
                <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
                  Gestión comercial de precios, especialidades, niveles de stock y disponibilidad en vivo
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  style={{
                    background: '#B45309',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 6px rgba(180, 83, 9, 0.25)'
                  }}
                >
                  <span>+</span> Nueva Hamburguesa
                </button>
              </div>
            </div>

            {/* Filters Bar */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '14px 18px',
              marginBottom: '18px',
              display: 'flex',
              gap: '14px',
              flexWrap: 'wrap',
              alignItems: 'center',
              boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
            }}>
              <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Buscar por nombre (ej: Rey de las Burgers, Clásica...)"
                  value={burgerSearch}
                  onChange={(e) => setBurgerSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 34px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                    fontFamily: 'inherit'
                  }}
                />
                <span style={{ position: 'absolute', left: '10px', top: '8px', color: '#94A3B8' }}>🔍</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748B' }}>Especialidad:</span>
                <select
                  value={selectedSpecialtyFilter}
                  onChange={(e) => setSelectedSpecialtyFilter(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                    fontFamily: 'inherit',
                    background: '#FFFFFF'
                  }}
                >
                  <option value="all">Todas las especialidades</option>
                  <option value="Legendaria">👑 Suprema Legendaria</option>
                  <option value="Tradicional">⭐ Tradicional Oro</option>
                  <option value="Master Double">🔥 Master Double</option>
                  <option value="Alta Cocina">🏆 Alta Cocina / Chef</option>
                  <option value="Trufada">🍄 Gourmet Trufada</option>
                  <option value="Crujiente">🍗 Pollo Crujiente</option>
                  <option value="Ahumada">🥓 Ahumada al Roble</option>
                  <option value="Tex-Mex">🌶️ Tex-Mex Picante</option>
                  <option value="Queso">🧀 Cascada 4 Quesos</option>
                  <option value="Plant-Based">🌿 Plant-Based</option>
                </select>
              </div>
            </div>

            {/* Burgers Table */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <th style={{ padding: '14px 18px' }}>Hamburguesa</th>
                    <th style={{ padding: '14px 18px' }}>Nivel de Especialidad</th>
                    <th style={{ padding: '14px 18px' }}>Precio</th>
                    <th style={{ padding: '14px 18px' }}>Stock Bodega</th>
                    <th style={{ padding: '14px 18px' }}>Ventas</th>
                    <th style={{ padding: '14px 18px' }}>Estado</th>
                    <th style={{ padding: '14px 18px', textAlign: 'right' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBurgers.map(b => (
                    <tr key={b.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.15s' }}>
                      <td style={{ padding: '12px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={b.image}
                            alt={b.name}
                            style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover' }}
                          />
                          <div>
                            <strong style={{ fontSize: '0.92rem', color: '#0F172A', display: 'block' }}>{b.name}</strong>
                            <span style={{ fontSize: '0.72rem', color: '#64748B' }}>{b.category}</span>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '12px 18px' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '800',
                          padding: '3px 10px',
                          borderRadius: '9999px',
                          background: '#FEF3C7',
                          color: '#92400E',
                          border: '1px solid #FDE68A'
                        }}>
                          {b.specialtyBadge}
                        </span>
                      </td>

                      <td style={{ padding: '12px 18px' }}>
                        <span style={{ fontSize: '1rem', fontWeight: '800', color: '#0F172A' }}>
                          ${b.price.toFixed(2)}
                        </span>
                      </td>

                      <td style={{ padding: '12px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            onClick={() => adjustStock(b.id, -5)}
                            style={{ width: '22px', height: '22px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: 'pointer', fontWeight: 'bold' }}
                          >
                            -
                          </button>
                          <span style={{
                            fontWeight: '800',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            background: b.stock < 15 ? '#FEE2E2' : b.stock < 30 ? '#FEF3C7' : '#D1FAE5',
                            color: b.stock < 15 ? '#991B1B' : b.stock < 30 ? '#92400E' : '#065F46'
                          }}>
                            {b.stock} u.
                          </span>
                          <button
                            onClick={() => adjustStock(b.id, 5)}
                            style={{ width: '22px', height: '22px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: 'pointer', fontWeight: 'bold' }}
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td style={{ padding: '12px 18px' }}>
                        <span style={{ fontWeight: '700', color: '#334155' }}>{b.salesCount}</span>
                      </td>

                      <td style={{ padding: '12px 18px' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          color: b.isAvailable ? '#059669' : '#DC2626',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <span>●</span> {b.isAvailable ? 'Disponible' : 'Pausada'}
                        </span>
                      </td>

                      <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                        <button
                          onClick={() => toggleAvailability(b.id)}
                          style={{
                            background: b.isAvailable ? '#F1F5F9' : '#FEF3C7',
                            border: '1px solid #CBD5E1',
                            color: b.isAvailable ? '#475569' : '#92400E',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          {b.isAvailable ? 'Pausar Venta' : 'Reactivar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: CUSTOMERS & CONSUMPTION METRICS ==================== */}
        {activeTab === 'customers' && (
          <div className="fade-in">
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0F172A' }}>
                Métricas de Consumidores y Clientes según Consumo
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
                Análisis de fidelidad comercial, volumen de hamburguesas consumidas, preferencias gastronómicas y ticket promedio
              </p>
            </div>

            {/* Consumption Tier Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              
              <div
                onClick={() => setCustomerTierFilter(customerTierFilter === 'diamond' ? 'all' : 'diamond')}
                style={{
                  background: '#FFFFFF',
                  border: customerTierFilter === 'diamond' ? '2px solid #9333EA' : '1px solid #E2E8F0',
                  borderRadius: '16px',
                  padding: '18px',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#581C87', background: '#F3E8FF', padding: '3px 8px', borderRadius: '6px' }}>
                    💎 VIP DIAMOND
                  </span>
                  <span style={{ fontSize: '1.2rem' }}>👑</span>
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0F172A', marginTop: '10px' }}>
                  {tierVipCount} Clientes
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
                  Consumo: <strong>&gt;25 hamburguesas</strong>. Ticket prom: $27.80.
                </div>
              </div>

              <div
                onClick={() => setCustomerTierFilter(customerTierFilter === 'gold' ? 'all' : 'gold')}
                style={{
                  background: '#FFFFFF',
                  border: customerTierFilter === 'gold' ? '2px solid #D97706' : '1px solid #E2E8F0',
                  borderRadius: '16px',
                  padding: '18px',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#92400E', background: '#FEF3C7', padding: '3px 8px', borderRadius: '6px' }}>
                    🥇 GOLD GOURMET
                  </span>
                  <span style={{ fontSize: '1.2rem' }}>⭐</span>
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0F172A', marginTop: '10px' }}>
                  {tierGoldCount} Clientes
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
                  Consumo: <strong>10 a 24 hamburguesas</strong>. Frecuencia semanal.
                </div>
              </div>

              <div
                onClick={() => setCustomerTierFilter(customerTierFilter === 'silver' ? 'all' : 'silver')}
                style={{
                  background: '#FFFFFF',
                  border: customerTierFilter === 'silver' ? '2px solid #64748B' : '1px solid #E2E8F0',
                  borderRadius: '16px',
                  padding: '18px',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#334155', background: '#E2E8F0', padding: '3px 8px', borderRadius: '6px' }}>
                    🥈 SILVER REGULAR
                  </span>
                  <span style={{ fontSize: '1.2rem' }}>🍔</span>
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0F172A', marginTop: '10px' }}>
                  {tierSilverCount} Clientes
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
                  Consumo: <strong>4 a 9 hamburguesas</strong>. Consumo quincenal.
                </div>
              </div>

              <div
                onClick={() => setCustomerTierFilter(customerTierFilter === 'new' ? 'all' : 'new')}
                style={{
                  background: '#FFFFFF',
                  border: customerTierFilter === 'new' ? '2px solid #10B981' : '1px solid #E2E8F0',
                  borderRadius: '16px',
                  padding: '18px',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#166534', background: '#DCFCE7', padding: '3px 8px', borderRadius: '6px' }}>
                    🌱 EXPLORADOR
                  </span>
                  <span style={{ fontSize: '1.2rem' }}>✨</span>
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0F172A', marginTop: '10px' }}>
                  {tierNewCount} Clientes
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
                  Consumo inicial: <strong>1 a 3 hamburguesas</strong>.
                </div>
              </div>
            </div>

            {/* Customers Table */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
            }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.95rem', color: '#0F172A' }}>
                  Registro Individual de Consumo ({filteredCustomers.length} Clientes)
                </strong>
                {customerTierFilter !== 'all' && (
                  <button
                    onClick={() => setCustomerTierFilter('all')}
                    style={{ background: 'none', border: 'none', color: '#B45309', fontWeight: '700', fontSize: '0.78rem', cursor: 'pointer' }}
                  >
                    Quitar filtro ({customerTierFilter})
                  </button>
                )}
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <th style={{ padding: '14px 18px' }}>Consumidor / Cliente</th>
                    <th style={{ padding: '14px 18px' }}>Nivel de Fidelidad</th>
                    <th style={{ padding: '14px 18px' }}>Burgers Consumidas</th>
                    <th style={{ padding: '14px 18px' }}>Burger Favorita</th>
                    <th style={{ padding: '14px 18px' }}>Gasto Acumulado</th>
                    <th style={{ padding: '14px 18px' }}>Puntos VIP</th>
                    <th style={{ padding: '14px 18px', textAlign: 'right' }}>Último Pedido</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map(c => (
                    <tr key={c.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={c.avatar}
                            alt={c.name}
                            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <strong style={{ fontSize: '0.92rem', color: '#0F172A', display: 'block' }}>{c.name}</strong>
                            <span style={{ fontSize: '0.72rem', color: '#64748B' }}>{c.email}</span>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '800',
                          padding: '3px 10px',
                          borderRadius: '9999px',
                          background: c.badgeBg,
                          color: c.badgeColor
                        }}>
                          {c.tierBadge}
                        </span>
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ fontSize: '1rem', fontWeight: '800', color: '#0F172A' }}>
                          {c.burgersConsumed}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#64748B', marginLeft: '4px' }}>burgers</span>
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ fontWeight: '700', color: '#B45309' }}>
                          🍔 {c.favoriteBurger}
                        </span>
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ fontWeight: '800', color: '#0F172A' }}>
                          ${c.totalSpent.toFixed(2)}
                        </span>
                        <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{c.ordersCount} órdenes</div>
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ fontWeight: '800', color: '#D97706' }}>
                          {c.loyaltyPoints} pts
                        </span>
                      </td>

                      <td style={{ padding: '14px 18px', textAlign: 'right', color: '#64748B', fontSize: '0.8rem' }}>
                        {c.lastOrder}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== TAB 4: DATABASE STATUS ==================== */}
        {activeTab === 'database' && (
          <div className="fade-in">
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0F172A' }}>
                🗄️ Estado de la Base de Datos & Telemetría
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
                Monitoreo en vivo de persistencia MySQL, latencia de consulta y redundancia in-memory
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
              
              {/* Main Status Card */}
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: '#64748B' }}>
                      Modo Operacional
                    </span>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: serverHealth?.database?.connected ? '#059669' : '#D97706', marginTop: '2px' }}>
                      {serverHealth?.database?.mode === 'mysql' ? '🐬 Conectado a MySQL (Dokploy/Docker)' : '⚡ Operando en Modo In-Memory Activo'}
                    </h3>
                  </div>

                  <span style={{
                    background: serverHealth?.database?.connected ? '#D1FAE5' : '#FEF3C7',
                    color: serverHealth?.database?.connected ? '#065F46' : '#92400E',
                    padding: '6px 12px',
                    borderRadius: '9999px',
                    fontSize: '0.78rem',
                    fontWeight: '800'
                  }}>
                    {serverHealth?.database?.connected ? 'ONLINE 100%' : 'FALLBACK SAFE'}
                  </span>
                </div>

                {/* Diagnostics Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '24px' }}>
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '14px', borderRadius: '12px' }}>
                    <small style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Host de BD</small>
                    <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>
                      {serverHealth?.database?.host || 'in-memory-storage'}
                    </div>
                  </div>

                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '14px', borderRadius: '12px' }}>
                    <small style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Esquema / BD</small>
                    <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>
                      {serverHealth?.database?.database || 'hamburger_rapid_db'}
                    </div>
                  </div>

                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '14px', borderRadius: '12px' }}>
                    <small style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Latencia Ping</small>
                    <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#059669', marginTop: '2px' }}>
                      {serverHealth?.database?.latencyMs || 1} ms (Ultrarrápido)
                    </div>
                  </div>

                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '14px', borderRadius: '12px' }}>
                    <small style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Registros Activos</small>
                    <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>
                      {burgers.length} burgers &bull; {customers.length} clientes
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={fetchHealthAndStats}
                    style={{
                      background: '#B45309',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '10px 18px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    🩺 Probar Conexión Ahora
                  </button>

                  <button
                    onClick={handleResetCatalog}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      color: '#475569',
                      padding: '10px 18px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    🔄 Restablecer Catálogo Oficial
                  </button>
                </div>
              </div>

              {/* Architecture Info Card */}
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#0F172A', marginBottom: '12px' }}>
                  🛡️ Resiliencia Arquitectónica
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: '1.6', marginBottom: '16px' }}>
                  Hamburger Rapid cuenta con failover automático transparente: si las credenciales de MySQL (Dokploy/Docker) están presentes, se conecta al pool; en caso contrario, conmuta instantáneamente a memoria en tiempo de ejecución para evitar cualquier interrupción de servicio.
                </p>

                <div style={{ background: '#FFFBEB', border: '1px solid #FEF3C7', padding: '12px', borderRadius: '10px', fontSize: '0.78rem', color: '#78350F' }}>
                  <strong>Uptime:</strong> {serverHealth?.uptime ? `${Math.round(serverHealth.uptime)} segundos` : 'En línea'}
                  <div style={{ marginTop: '4px' }}>
                    <strong>Plataforma:</strong> Dokploy CI/CD Live Suite
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ==================== ADD BURGER MODAL ==================== */}
      {isAddModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(6px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            maxWidth: '520px',
            width: '100%',
            padding: '26px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F172A' }}>
                🍔 Agregar Nueva Hamburguesa
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#94A3B8' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBurger} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#4B5563', display: 'block', marginBottom: '4px' }}>
                  Nombre de la Hamburguesa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej: Burger Real Suprema"
                  value={newBurger.name}
                  onChange={(e) => setNewBurger({ ...newBurger, name: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#4B5563', display: 'block', marginBottom: '4px' }}>
                    Categoría
                  </label>
                  <select
                    value={newBurger.category}
                    onChange={(e) => setNewBurger({ ...newBurger, category: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', background: '#FFFFFF' }}
                  >
                    <option value="A la Parrilla">A la Parrilla</option>
                    <option value="Clásicas de la Casa">Clásicas de la Casa</option>
                    <option value="Smash & Dobles">Smash & Dobles</option>
                    <option value="Especialidades">Especialidades</option>
                    <option value="Pollo Crujiente">Pollo Crujiente</option>
                    <option value="Veggie & Saludable">Veggie & Saludable</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#4B5563', display: 'block', marginBottom: '4px' }}>
                    Badge Especialidad
                  </label>
                  <input
                    type="text"
                    placeholder="ej: 👑 Edición Limitada"
                    value={newBurger.specialtyBadge}
                    onChange={(e) => setNewBurger({ ...newBurger, specialtyBadge: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#4B5563', display: 'block', marginBottom: '4px' }}>
                    Precio ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="ej: 13.50"
                    value={newBurger.price}
                    onChange={(e) => setNewBurger({ ...newBurger, price: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#4B5563', display: 'block', marginBottom: '4px' }}>
                    Stock Inicial
                  </label>
                  <input
                    type="number"
                    placeholder="ej: 40"
                    value={newBurger.stock}
                    onChange={(e) => setNewBurger({ ...newBurger, stock: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#4B5563', display: 'block', marginBottom: '4px' }}>
                  URL de Imagen Gastronómica
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newBurger.image}
                  onChange={(e) => setNewBurger({ ...newBurger, image: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#4B5563', display: 'block', marginBottom: '4px' }}>
                  Descripción de Ingredientes
                </label>
                <textarea
                  rows="2"
                  placeholder="Carne Angus, pan brioche, salsas de autor..."
                  value={newBurger.description}
                  onChange={(e) => setNewBurger({ ...newBurger, description: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontFamily: 'inherit' }}
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '10px 18px', borderRadius: '8px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ background: '#B45309', color: '#FFFFFF', border: 'none', padding: '10px 22px', borderRadius: '8px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Guardar Hamburguesa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        background: '#FFFFFF',
        borderTop: '1px solid #E2E8F0',
        padding: '18px 28px',
        fontSize: '0.8rem',
        color: '#64748B',
        textAlign: 'center',
        marginTop: 'auto'
      }}>
        Hamburger Rapid &bull; Operations Suite &bull; Astro + React + Node.js API + MySQL &bull; Dokploy CI/CD Ready
      </footer>
    </div>
  );
}
