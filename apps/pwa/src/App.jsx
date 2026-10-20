import React, { useState, useEffect } from 'react';

// 10 Official Featured Burgers
const BURGER_CATALOG = [
  {
    id: 1,
    name: 'Rey de las Burgers',
    category: 'parrilla',
    categoryName: 'A la Parrilla',
    specialtyLevel: 'Suprema Legendaria',
    specialtyBadge: '👑 Suprema',
    badgeBg: '#FEF3C7',
    badgeColor: '#92400E',
    price: 14.99,
    rating: 4.98,
    calories: '920 kcal',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80',
    description: 'Triple carne Angus (450g) flameada a la leña, triple cheddar fundido, cebolla caramelizada al bourbon y panceta crocante.'
  },
  {
    id: 2,
    name: 'Burger Real Clásica',
    category: 'clasicas',
    categoryName: 'Clásica',
    specialtyLevel: 'Tradicional Oro',
    specialtyBadge: '⭐ Clásica',
    badgeBg: '#DBEAFE',
    badgeColor: '#1E40AF',
    price: 10.50,
    rating: 4.92,
    calories: '710 kcal',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop&q=80',
    description: 'Medallón Angus de 180g a la brasa, queso cheddar artesanal, lechuga romana fresca, tomate y aderezo especial de la casa.'
  },
  {
    id: 3,
    name: 'Burger Real Doble',
    category: 'dobles',
    categoryName: 'Doble Smash',
    specialtyLevel: 'Master Double',
    specialtyBadge: '🔥 Doble Sign.',
    badgeBg: '#FFEDD5',
    badgeColor: '#9A3412',
    price: 13.50,
    rating: 4.95,
    calories: '860 kcal',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=80',
    description: 'Doble smash con costra caramelizada (300g), doble gouda fundido, bacon ahumado crujiente al manzano y finos aros de cebolla.'
  },
  {
    id: 4,
    name: 'Burger Doble Especial',
    category: 'especiales',
    categoryName: 'Especial Chef',
    specialtyLevel: 'Alta Cocina',
    specialtyBadge: '🏆 Del Chef',
    badgeBg: '#EDE9FE',
    badgeColor: '#5B21B6',
    price: 15.99,
    rating: 4.97,
    calories: '980 kcal',
    image: 'https://images.unsplash.com/photo-1583032015879-a562141d3c01?w=500&auto=format&fit=crop&q=80',
    description: 'Carne madurada 21 días, huevo campero frito a la plancha, queso provolone ahumado, bacon crocante y reducción de alioli trufado.'
  },
  {
    id: 5,
    name: 'Smash Trufa Imperial',
    category: 'especiales',
    categoryName: 'Especial Chef',
    specialtyLevel: 'Gourmet Trufada',
    specialtyBadge: '🍄 Trufa Negra',
    badgeBg: '#CCFBF1',
    badgeColor: '#115E59',
    price: 16.50,
    rating: 4.99,
    calories: '840 kcal',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&auto=format&fit=crop&q=80',
    description: 'Medallón smash de res madurada, queso Brie francés fundido, champiñones portobello al tomillo y mayonesa de trufa negra.'
  },
  {
    id: 6,
    name: 'Crispy Chicken Real Ranch',
    category: 'pollo-veggie',
    categoryName: 'Pollo Crispy',
    specialtyLevel: 'Pollo Crujiente',
    specialtyBadge: '🍗 Ultra Crispy',
    badgeBg: '#FEF3C7',
    badgeColor: '#92400E',
    price: 11.99,
    rating: 4.91,
    calories: '760 kcal',
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500&auto=format&fit=crop&q=80',
    description: 'Pechuga marinada 24h en buttermilk, rebozado extra crujiente estilo sureño, ensalada coleslaw con manzana verde y aderezo ranch.'
  },
  {
    id: 7,
    name: 'Bacon Smokehouse BBQ',
    category: 'parrilla',
    categoryName: 'A la Parrilla',
    specialtyLevel: 'Ahumada al Roble',
    specialtyBadge: '🥓 Ahumada',
    badgeBg: '#FFE4E6',
    badgeColor: '#9F1239',
    price: 13.99,
    rating: 4.93,
    calories: '890 kcal',
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500&auto=format&fit=crop&q=80',
    description: 'Carne Angus a las brasas vivas, cuatro tiras de panceta al nogal, monterey jack derretido y salsa BBQ artesanal de cerveza negra.'
  },
  {
    id: 8,
    name: 'Guacamole Spicy Fire',
    category: 'especiales',
    categoryName: 'Especial Chef',
    specialtyLevel: 'Fuego Tex-Mex',
    specialtyBadge: '🌶️ Spicy Fire',
    badgeBg: '#FEE2E2',
    badgeColor: '#991B1B',
    price: 12.50,
    rating: 4.89,
    calories: '810 kcal',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&auto=format&fit=crop&q=80',
    description: 'Carne Angus con costra de chiles secos, queso pepper jack fundido, abundante guacamole rústico casero y salsa chipotle brava.'
  },
  {
    id: 9,
    name: 'Cuatro Quesos Nobles',
    category: 'especiales',
    categoryName: 'Especial Chef',
    specialtyLevel: 'Queso Fundido Oro',
    specialtyBadge: '🧀 4 Quesos',
    badgeBg: '#FEF9C3',
    badgeColor: '#854D0E',
    price: 13.25,
    rating: 4.94,
    calories: '905 kcal',
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=500&auto=format&fit=crop&q=80',
    description: 'Carne jugosa de res envuelta en queso Cheddar inglés, Provolone hilado, crema Gorgonzola y costra exterior de queso Emmental gratinado.'
  },
  {
    id: 10,
    name: 'Veggie Royal Deluxe',
    category: 'pollo-veggie',
    categoryName: 'Plant-Based',
    specialtyLevel: 'Plant-Based Gourmet',
    specialtyBadge: '🌿 Veggie 100%',
    badgeBg: '#DCFCE7',
    badgeColor: '#166534',
    price: 11.50,
    rating: 4.90,
    calories: '610 kcal',
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500&auto=format&fit=crop&q=80',
    description: 'Medallón artesanal de quinoa, setas portobello y lentejas tostadas, queso vegetal cremoso, rúcula fresca y alioli de aguacate.'
  }
];

const INITIAL_OFFERS = [
  {
    id: 'off-1',
    code: 'RAPID20',
    title: '20% de Descuento Especial',
    description: 'Aplica en tu pedido actual sin mínimo de compra.',
    discountPercent: 20,
    badge: '🔥 MÁS POPULAR',
    expiresIn: 'Vence hoy a las 23:59'
  },
  {
    id: 'off-2',
    code: 'DELIVERYFREE',
    title: 'Envío 100% Gratis',
    description: 'Delivery sin costo en pedidos superiores a $15.',
    discountFixed: 2.50,
    badge: '🛵 DELIVERY ZERO',
    expiresIn: 'Válido toda la semana'
  },
  {
    id: 'off-3',
    code: 'COMBOREY',
    title: 'Papas & Bebida Gratis',
    description: 'Con la compra de "Rey de las Burgers", papas trufadas de cortesía.',
    discountFixed: 4.00,
    badge: '👑 EXCLUSIVO VIP',
    expiresIn: 'Válido hoy'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'ofertas' | 'ordenes' | 'perfil'
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Cart State
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState(null);

  // Checkout State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Datos & Pago, 2: Confirmación éxtiosa
  const [deliveryAddress, setDeliveryAddress] = useState('Av. Principal 450, Depto 8B (Santiago Centro)');
  const [paymentMethod, setPaymentMethod] = useState('applepay'); // 'applepay' | 'card' | 'cash'
  const [orderNotes, setOrderNotes] = useState('Tocar timbre 8B o dejar en conserjería.');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Customer Profile & Orders State
  const [rapidPoints, setRapidPoints] = useState(450);
  const [orders, setOrders] = useState([
    {
      id: 'HR-8421',
      date: '2026-10-20 15:30',
      items: [
        { name: 'Rey de las Burgers', quantity: 2, price: 14.99 },
        { name: 'Burger Real Clásica', quantity: 1, price: 10.50 }
      ],
      total: 40.48,
      statusStage: 3, // 1: Recibido, 2: En parrilla, 3: En camino, 4: Entregado
      statusLabel: 'En camino con el delivery 🛵',
      estimatedTime: '8 minutos',
      driverName: 'Marco Delgado (Honda CB190 - Placa BK-82)'
    },
    {
      id: 'HR-7930',
      date: '2026-10-18 20:15',
      items: [
        { name: 'Burger Doble Especial', quantity: 1, price: 15.99 },
        { name: 'Smash Trufa Imperial', quantity: 1, price: 16.50 }
      ],
      total: 32.49,
      statusStage: 4,
      statusLabel: 'Entregado con éxito ✅',
      estimatedTime: 'Finalizado',
      driverName: 'Ana Morales'
    }
  ]);

  // Network & PWA Install Listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
    };
  }, []);

  // Cart Calculations
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discountAmount = (cartSubtotal * appliedCoupon.discountPercent) / 100;
    } else if (appliedCoupon.discountFixed) {
      discountAmount = appliedCoupon.discountFixed;
    }
  }

  const deliveryFee = cartSubtotal > 20 || appliedCoupon?.code === 'DELIVERYFREE' ? 0.00 : 2.50;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + deliveryFee);

  // Cart Functions
  const addToCart = (burger) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === burger.id);
      if (existing) {
        return prev.map(item => item.id === burger.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...burger, quantity: 1 }];
    });
  };

  const updateQuantity = (burgerId, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === burgerId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const applyCouponCode = (code) => {
    const found = INITIAL_OFFERS.find(o => o.code.toUpperCase() === code.trim().toUpperCase());
    if (found) {
      setAppliedCoupon(found);
      setCouponFeedback({ success: true, message: `¡Cupón ${found.code} aplicado con éxito!` });
    } else {
      setCouponFeedback({ success: false, message: 'Código no válido o expirado.' });
    }
  };

  // Simulate Purchase Checkout
  const handleConfirmOrder = () => {
    if (cart.length === 0) return;

    const newOrderId = `HR-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: newOrderId,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      items: [...cart],
      total: parseFloat(cartTotal.toFixed(2)),
      statusStage: 2, // 2: En la parrilla
      statusLabel: 'En la parrilla de carbón 🔥',
      estimatedTime: '15-18 minutos',
      driverName: 'Soporte Rapid Delivery (Asignando repartidor...)'
    };

    // Update state
    setOrders(prev => [newOrder, ...prev]);
    setRapidPoints(prev => prev + 35); // Earn points
    setCart([]);
    setAppliedCoupon(null);
    setCheckoutStep(2); // Show success celebration

    // Also attempt to push to server api if running
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: 'Valentina Restrepo',
        items: newOrder.items,
        total: newOrder.total
      })
    }).catch(err => console.log('Offline/Local order simulation:', err.message));
  };

  // Simulate Order Tracking Advancement
  const advanceOrderStatus = (orderId) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const nextStage = Math.min(4, order.statusStage + 1);
        let nextLabel = order.statusLabel;
        let nextTime = order.estimatedTime;
        if (nextStage === 2) {
          nextLabel = 'En la parrilla de carbón 🔥';
          nextTime = '12 minutos';
        } else if (nextStage === 3) {
          nextLabel = 'En camino con el delivery 🛵';
          nextTime = '6 minutos';
        } else if (nextStage === 4) {
          nextLabel = 'Entregado con éxito ✅';
          nextTime = '¡Buen provecho!';
        }
        return {
          ...order,
          statusStage: nextStage,
          statusLabel: nextLabel,
          estimatedTime: nextTime
        };
      }
      return order;
    }));
  };

  // Filter Catalog
  const filteredBurgers = BURGER_CATALOG.filter(burger => {
    const matchesCategory = selectedCategory === 'all' || burger.category === selectedCategory;
    const matchesSearch = burger.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          burger.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#FAF7F2' }}>
      
      {/* Top App Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #E8DFD5',
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            fontSize: '1.4rem',
            background: '#FEF3C7',
            border: '1px solid #FDE68A',
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            🍔
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1F2937', lineHeight: '1.2' }}>
              Hamburger Rapid
            </div>
            <div style={{ fontSize: '0.72rem', color: '#B45309', fontWeight: '700' }}>
              📍 Sucursal Centro &bull; 15-20 min
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Online status indicator */}
          <span style={{
            fontSize: '0.7rem',
            padding: '4px 8px',
            borderRadius: '12px',
            fontWeight: '700',
            background: isOnline ? '#D1FAE5' : '#FEE2E2',
            color: isOnline ? '#065F46' : '#991B1B',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span style={{ fontSize: '0.55rem' }}>●</span>
            {isOnline ? 'Online' : 'Offline'}
          </span>

          {/* Cart Icon Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            style={{
              position: 'relative',
              background: '#B45309',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '1.1rem',
              boxShadow: '0 4px 10px rgba(180, 83, 9, 0.25)'
            }}
            aria-label="Abrir carrito"
          >
            🛒
            {cartItemCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                background: '#DC2626',
                color: '#FFFFFF',
                fontSize: '0.7rem',
                fontWeight: '800',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #FFFFFF'
              }}>
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Rendered by Tab */}
      <main style={{ flex: 1, padding: '16px 18px' }} className="fade-in">
        
        {/* ==================== TAB 1: MENÚ ==================== */}
        {activeTab === 'menu' && (
          <div>
            {/* Greeting Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
              border: '1px solid #FDE68A',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  💎 Gourmet Gold Member
                </div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#78350F', marginTop: '2px' }}>
                  ¿Qué burger se te antoja hoy?
                </h2>
                <div style={{ fontSize: '0.78rem', color: '#B45309', marginTop: '4px' }}>
                  Saldo: <strong>{rapidPoints} RapidPoints</strong> (Canjea a los 500)
                </div>
              </div>
              <div style={{ fontSize: '2.4rem' }}>👑</div>
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', marginBottom: '14px' }}>
              <input
                type="text"
                placeholder="Buscar por nombre o ingrediente..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 40px',
                  background: '#FFFFFF',
                  border: '1px solid #E8DFD5',
                  borderRadius: '12px',
                  fontSize: '0.88rem',
                  fontFamily: 'inherit',
                  color: '#1F2937',
                  outline: 'none',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                }}
              />
              <span style={{ position: 'absolute', left: '14px', top: '12px', fontSize: '1rem', color: '#94A3B8' }}>
                🔍
              </span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: '12px', top: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', fontSize: '1rem' }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '8px',
              marginBottom: '16px',
              scrollbarWidth: 'none'
            }}>
              {[
                { id: 'all', label: 'Todas (10)' },
                { id: 'parrilla', label: '🔥 A la Parrilla' },
                { id: 'clasicas', label: '⭐ Clásicas' },
                { id: 'dobles', label: '🍔 Smash & Dobles' },
                { id: 'especiales', label: '🏆 Especiales Chef' },
                { id: 'pollo-veggie', label: '🍗 Pollo & Veggie' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    flexShrink: 0,
                    padding: '8px 14px',
                    borderRadius: '9999px',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    fontFamily: 'inherit',
                    border: '1px solid',
                    borderColor: selectedCategory === cat.id ? '#B45309' : '#E8DFD5',
                    background: selectedCategory === cat.id ? '#B45309' : '#FFFFFF',
                    color: selectedCategory === cat.id ? '#FFFFFF' : '#4B5563',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Burgers List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filteredBurgers.map(burger => {
                const inCart = cart.find(item => item.id === burger.id);
                return (
                  <div
                    key={burger.id}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E8DFD5',
                      borderRadius: '16px',
                      padding: '12px',
                      display: 'flex',
                      gap: '12px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                      position: 'relative'
                    }}
                  >
                    <div style={{ width: '105px', height: '105px', flexShrink: 0, borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
                      <img
                        src={burger.image}
                        alt={burger.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        loading="lazy"
                      />
                      <span style={{
                        position: 'absolute',
                        bottom: '4px',
                        left: '4px',
                        background: 'rgba(255,255,255,0.92)',
                        padding: '2px 6px',
                        borderRadius: '6px',
                        fontSize: '0.65rem',
                        fontWeight: '800',
                        color: '#1F2937'
                      }}>
                        ⭐ {burger.rating}
                      </span>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: '800',
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            background: burger.badgeBg,
                            color: burger.badgeColor
                          }}>
                            {burger.specialtyBadge}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{burger.calories}</span>
                        </div>
                        <h3 style={{ fontSize: '0.98rem', fontWeight: '800', color: '#0F172A', lineHeight: '1.2' }}>
                          {burger.name}
                        </h3>
                        <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '3px', lineHeight: '1.35', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {burger.description}
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                        <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#B45309' }}>
                          ${burger.price.toFixed(2)}
                        </span>

                        {inCart ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FEF3C7', borderRadius: '20px', padding: '3px 8px' }}>
                            <button
                              onClick={() => updateQuantity(burger.id, -1)}
                              style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#FFFFFF', border: 'none', fontWeight: '800', cursor: 'pointer', color: '#B45309' }}
                            >
                              -
                            </button>
                            <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#78350F' }}>
                              {inCart.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(burger.id, 1)}
                              style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#B45309', border: 'none', fontWeight: '800', cursor: 'pointer', color: '#FFFFFF' }}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(burger)}
                            style={{
                              background: '#B45309',
                              color: '#FFFFFF',
                              border: 'none',
                              padding: '6px 14px',
                              borderRadius: '20px',
                              fontSize: '0.78rem',
                              fontWeight: '700',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              boxShadow: '0 2px 6px rgba(180, 83, 9, 0.25)'
                            }}
                          >
                            <span>+</span> Agregar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== TAB 2: OFERTAS ==================== */}
        {activeTab === 'ofertas' && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0F172A' }}>
                🏷️ Ofertas & Cupones Rapid
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '2px' }}>
                Aprovecha descuentos exclusivos directamente en tu simulación de pedido.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {INITIAL_OFFERS.map(offer => {
                const isCurrentApplied = appliedCoupon?.code === offer.code;
                return (
                  <div
                    key={offer.id}
                    style={{
                      background: '#FFFFFF',
                      border: isCurrentApplied ? '2px solid #10B981' : '1px solid #E8DFD5',
                      borderRadius: '16px',
                      padding: '16px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: '800',
                        background: '#FEF3C7',
                        color: '#92400E',
                        padding: '3px 8px',
                        borderRadius: '6px'
                      }}>
                        {offer.badge}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{offer.expiresIn}</span>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F172A', marginTop: '8px' }}>
                      {offer.title}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '4px', lineHeight: '1.4' }}>
                      {offer.description}
                    </p>

                    <div style={{
                      marginTop: '14px',
                      paddingTop: '12px',
                      borderTop: '1px dashed #E8DFD5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{
                        background: '#F8FAFC',
                        border: '1px solid #CBD5E1',
                        borderRadius: '8px',
                        padding: '4px 10px',
                        fontFamily: 'monospace',
                        fontWeight: '800',
                        fontSize: '0.9rem',
                        color: '#0F172A'
                      }}>
                        {offer.code}
                      </div>

                      <button
                        onClick={() => {
                          applyCouponCode(offer.code);
                          setIsCartOpen(true);
                        }}
                        style={{
                          background: isCurrentApplied ? '#10B981' : '#B45309',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '7px 16px',
                          borderRadius: '20px',
                          fontSize: '0.78rem',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        {isCurrentApplied ? '✔ Aplicado al Carrito' : 'Aplicar Cupón 👉'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== TAB 3: ÓRDENES ==================== */}
        {activeTab === 'ordenes' && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0F172A' }}>
                📦 Seguimiento de Órdenes
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '2px' }}>
                Rastrea tus hamburguesas en la parrilla y simula el avance en tiempo real.
              </p>
            </div>

            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8DFD5' }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🍔</div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#1F2937' }}>Aún no tienes órdenes activas</h3>
                <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '4px', marginBottom: '16px' }}>
                  Elige tus hamburguesas favoritas en el menú para simular tu primer pedido.
                </p>
                <button
                  onClick={() => setActiveTab('menu')}
                  style={{
                    background: '#B45309',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '20px',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Ir al Menú de Hamburguesas
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {orders.map((order, idx) => (
                  <div
                    key={order.id}
                    style={{
                      background: '#FFFFFF',
                      border: idx === 0 ? '2px solid #FDE68A' : '1px solid #E8DFD5',
                      borderRadius: '16px',
                      padding: '16px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <div>
                        <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0F172A' }}>{order.id}</span>
                        <span style={{ fontSize: '0.72rem', color: '#94A3B8', marginLeft: '8px' }}>{order.date}</span>
                      </div>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: '800',
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        background: order.statusStage === 4 ? '#D1FAE5' : '#FEF3C7',
                        color: order.statusStage === 4 ? '#065F46' : '#92400E'
                      }}>
                        {order.statusLabel}
                      </span>
                    </div>

                    {/* Live Tracker Stages Bar */}
                    <div style={{ background: '#FAF7F2', padding: '12px', borderRadius: '12px', margin: '12px 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '8px' }}>
                        {[
                          { stage: 1, label: 'Cocina', icon: '👨‍🍳' },
                          { stage: 2, label: 'Parrilla', icon: '🔥' },
                          { stage: 3, label: 'Delivery', icon: '🛵' },
                          { stage: 4, label: 'Entregado', icon: '🍔' }
                        ].map(st => (
                          <div key={st.stage} style={{ textAlign: 'center', zIndex: 2, flex: 1 }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              margin: '0 auto 4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.9rem',
                              background: order.statusStage >= st.stage ? '#B45309' : '#E2E8F0',
                              color: order.statusStage >= st.stage ? '#FFFFFF' : '#94A3B8',
                              transition: 'all 0.3s'
                            }}>
                              {st.icon}
                            </div>
                            <span style={{
                              fontSize: '0.68rem',
                              fontWeight: order.statusStage >= st.stage ? '800' : '500',
                              color: order.statusStage >= st.stage ? '#78350F' : '#94A3B8'
                            }}>
                              {st.label}
                            </span>
                          </div>
                        ))}
                      </div>

                      {order.statusStage < 4 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E8DFD5', paddingTop: '8px', marginTop: '4px' }}>
                          <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                            Tiempo estimado: <strong>{order.estimatedTime}</strong>
                          </span>
                          <button
                            onClick={() => advanceOrderStatus(order.id)}
                            style={{
                              background: '#FFFFFF',
                              border: '1px solid #B45309',
                              color: '#B45309',
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontSize: '0.7rem',
                              fontWeight: '700',
                              cursor: 'pointer'
                            }}
                          >
                            ⚡ Avanzar Estado Simulado
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Items List */}
                    <div style={{ fontSize: '0.8rem', color: '#4B5563', margin: '8px 0' }}>
                      {order.items.map((it, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                          <span>{it.quantity}x {it.name}</span>
                          <span style={{ fontWeight: '600' }}>${(it.price * it.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1E9DF', paddingTop: '10px', marginTop: '8px' }}>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Total abonado:</span>
                        <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F172A', marginLeft: '6px' }}>
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          order.items.forEach(it => {
                            const found = BURGER_CATALOG.find(b => b.name === it.name);
                            if (found) addToCart(found);
                          });
                          setIsCartOpen(true);
                        }}
                        style={{
                          background: '#F4EFEB',
                          border: '1px solid #E8DFD5',
                          color: '#78350F',
                          padding: '6px 12px',
                          borderRadius: '14px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        🔄 Repetir Pedido
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 4: PERFIL ==================== */}
        {activeTab === 'perfil' && (
          <div>
            {/* VIP Card */}
            <div style={{
              background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
              color: '#FFFFFF',
              borderRadius: '20px',
              padding: '20px',
              marginBottom: '18px',
              boxShadow: '0 8px 20px rgba(15, 23, 42, 0.25)',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80"
                    alt="Valentina Restrepo"
                    style={{ width: '54px', height: '54px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #FDE68A' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', lineHeight: '1.2' }}>Valentina Restrepo</h3>
                    <span style={{ fontSize: '0.72rem', color: '#FDE68A', fontWeight: '700' }}>💎 Diamond VIP Member</span>
                  </div>
                </div>
                <div style={{ fontSize: '1.6rem' }}>👑</div>
              </div>

              {/* Points Progress */}
              <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                  <span style={{ color: '#94A3B8' }}>RapidPoints Acumulados</span>
                  <span style={{ fontWeight: '800', color: '#FDE68A' }}>{rapidPoints} / 500 pts</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.15)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, (rapidPoints / 500) * 100)}%`, height: '100%', background: 'linear-gradient(90deg, #D97706, #FDE68A)', borderRadius: '9999px' }}></div>
                </div>
                <span style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '4px', display: 'block' }}>
                  Faltan solo {Math.max(0, 500 - rapidPoints)} puntos para tu próxima burger gratis.
                </span>
              </div>
            </div>

            {/* Consumption Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              marginBottom: '18px'
            }}>
              <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '14px', border: '1px solid #E8DFD5', textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#B45309' }}>38</div>
                <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: '600' }}>Hamburguesas</div>
              </div>
              <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '14px', border: '1px solid #E8DFD5', textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#B45309' }}>19</div>
                <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: '600' }}>Órdenes Totales</div>
              </div>
              <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '14px', border: '1px solid #E8DFD5', textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#10B981' }}>$86.50</div>
                <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: '600' }}>Ahorrado</div>
              </div>
            </div>

            {/* Preferences Section */}
            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8DFD5', padding: '16px', marginBottom: '18px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0F172A', marginBottom: '12px' }}>
                📍 Preferencias Guardadas
              </h4>
              <div style={{ fontSize: '0.8rem', color: '#4B5563', marginBottom: '10px' }}>
                <strong>Dirección habitual:</strong>
                <p style={{ color: '#64748B', marginTop: '2px' }}>{deliveryAddress}</p>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#4B5563', marginBottom: '10px' }}>
                <strong>Burger Favorita:</strong>
                <p style={{ color: '#B45309', fontWeight: '700', marginTop: '2px' }}>👑 Rey de las Burgers (Parrilla)</p>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#4B5563' }}>
                <strong>Método preferido:</strong>
                <p style={{ color: '#64748B', marginTop: '2px' }}>Apple Pay (Touch ID vinculado)</p>
              </div>
            </div>

            {/* Navigation & Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {deferredPrompt && (
                <button
                  onClick={() => {
                    deferredPrompt.prompt();
                    deferredPrompt.userChoice.then(() => setDeferredPrompt(null));
                  }}
                  style={{
                    background: '#B45309',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  📲 Instalar App en Pantalla de Inicio
                </button>
              )}

              <a
                href="/"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E8DFD5',
                  color: '#1F2937',
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  textAlign: 'center',
                  textDecoration: 'none',
                  display: 'block'
                }}
              >
                🌐 Ir a Landing E-commerce
              </a>

              <a
                href="/admin"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E8DFD5',
                  color: '#1F2937',
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  textAlign: 'center',
                  textDecoration: 'none',
                  display: 'block'
                }}
              >
                ⚙️ Ir a Panel de Control Admin
              </a>
            </div>
          </div>
        )}
      </main>

      {/* ==================== CART DRAWER / MODAL ==================== */}
      {isCartOpen && (
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
          justifyContent: 'center',
          alignItems: 'flex-end'
        }}>
          <div style={{
            background: '#FFFFFF',
            width: '100%',
            maxWidth: '480px',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 -10px 30px rgba(0,0,0,0.15)',
            borderTop: '1px solid #E8DFD5'
          }}>
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #E8DFD5',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>🛒</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F172A' }}>
                  Tu Carrito ({cartItemCount})
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#64748B' }}
              >
                ✕
              </button>
            </div>

            {/* Items List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 10px' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🛍️</div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#1F2937' }}>El carrito está vacío</h4>
                  <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '4px' }}>
                    Agrega algunas de nuestras 10 variantes maestras de hamburguesas.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {cart.map(item => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingBottom: '12px',
                        borderBottom: '1px solid #F1E9DF'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0F172A' }}>{item.name}</div>
                          <div style={{ fontSize: '0.78rem', color: '#B45309', fontWeight: '700' }}>
                            ${item.price.toFixed(2)} c/u
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#F1E9DF', border: 'none', fontWeight: '800', cursor: 'pointer', color: '#1F2937' }}
                        >
                          -
                        </button>
                        <span style={{ fontSize: '0.88rem', fontWeight: '800', width: '18px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#B45309', border: 'none', fontWeight: '800', cursor: 'pointer', color: '#FFFFFF' }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Coupon Input Box */}
                  <div style={{ marginTop: '10px', background: '#FAF7F2', padding: '12px', borderRadius: '12px', border: '1px solid #E8DFD5' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#78350F', marginBottom: '6px' }}>
                      🏷️ ¿Tienes un código promocional?
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder="ej: RAPID20"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        style={{
                          flex: 1,
                          padding: '8px 10px',
                          border: '1px solid #CBD5E1',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          fontFamily: 'inherit',
                          textTransform: 'uppercase'
                        }}
                      />
                      <button
                        onClick={() => applyCouponCode(couponInput)}
                        style={{
                          background: '#B45309',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        Aplicar
                      </button>
                    </div>

                    {couponFeedback && (
                      <div style={{
                        fontSize: '0.72rem',
                        marginTop: '6px',
                        color: couponFeedback.success ? '#065F46' : '#991B1B',
                        fontWeight: '600'
                      }}>
                        {couponFeedback.message}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Summary & Checkout CTA */}
            {cart.length > 0 && (
              <div style={{ padding: '16px 20px', borderTop: '1px solid #E8DFD5', background: '#FFFFFF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#64748B', marginBottom: '4px' }}>
                  <span>Subtotal productos:</span>
                  <span>${cartSubtotal.toFixed(2)}</span>
                </div>

                {appliedCoupon && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#059669', fontWeight: '700', marginBottom: '4px' }}>
                    <span>Descuento ({appliedCoupon.code}):</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#64748B', marginBottom: '8px' }}>
                  <span>Envío a domicilio:</span>
                  <span>{deliveryFee === 0 ? '¡GRATIS!' : `$${deliveryFee.toFixed(2)}`}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: '800', color: '#0F172A', borderTop: '1px dashed #E8DFD5', paddingTop: '8px', marginBottom: '14px' }}>
                  <span>Total Final:</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                    setCheckoutStep(1);
                  }}
                  style={{
                    width: '100%',
                    background: '#B45309',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '14px',
                    borderRadius: '14px',
                    fontSize: '0.95rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(180, 83, 9, 0.3)'
                  }}
                >
                  Continuar al Pago &bull; ${cartTotal.toFixed(2)}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== CHECKOUT SIMULATOR MODAL ==================== */}
      {isCheckoutOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(8px)',
          zIndex: 110,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '16px'
        }}>
          <div style={{
            background: '#FFFFFF',
            width: '100%',
            maxWidth: '440px',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            border: '1px solid #E8DFD5'
          }}>
            {checkoutStep === 1 ? (
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0F172A' }}>
                    Simulación de Compra 🍔
                  </h3>
                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#94A3B8' }}
                  >
                    ✕
                  </button>
                </div>

                {/* Delivery Address */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#4B5563', display: 'block', marginBottom: '4px' }}>
                    📍 Dirección de Entrega
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.85rem',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                {/* Delivery Notes */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#4B5563', display: 'block', marginBottom: '4px' }}>
                    📝 Indicaciones para el Delivery
                  </label>
                  <input
                    type="text"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.85rem',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                {/* Payment Method Selector */}
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#4B5563', display: 'block', marginBottom: '6px' }}>
                    💳 Método de Pago Simulado
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {[
                      { id: 'applepay', label: '🍎 Pay', sub: 'Touch ID' },
                      { id: 'card', label: '💳 Tarjeta', sub: '**** 4819' },
                      { id: 'cash', label: '💵 Efectivo', sub: 'Al recibir' }
                    ].map(pm => (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPaymentMethod(pm.id)}
                        style={{
                          padding: '10px 4px',
                          borderRadius: '10px',
                          border: paymentMethod === pm.id ? '2px solid #B45309' : '1px solid #CBD5E1',
                          background: paymentMethod === pm.id ? '#FFFBEB' : '#FFFFFF',
                          color: paymentMethod === pm.id ? '#78350F' : '#4B5563',
                          fontWeight: '700',
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        <div>{pm.label}</div>
                        <div style={{ fontSize: '0.65rem', color: '#94A3B8', marginTop: '2px' }}>{pm.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Order Summary Recap */}
                <div style={{ background: '#FAF7F2', padding: '12px', borderRadius: '12px', marginBottom: '18px', border: '1px solid #E8DFD5' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#64748B' }}>
                    <span>Total a simular:</span>
                    <strong style={{ color: '#0F172A', fontSize: '1rem' }}>${cartTotal.toFixed(2)}</strong>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#B45309', marginTop: '4px' }}>
                    ⭐ Ganarás +35 RapidPoints con esta compra
                  </div>
                </div>

                <button
                  onClick={handleConfirmOrder}
                  style={{
                    width: '100%',
                    background: '#B45309',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '14px',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(180, 83, 9, 0.3)'
                  }}
                >
                  🚀 Confirmar y Procesar Orden
                </button>
              </div>
            ) : (
              /* Success Celebration Step */
              <div style={{ padding: '32px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: '3.6rem', marginBottom: '12px' }}>🎉🔥</div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>
                  ¡Pedido Recibido con Éxito!
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: '1.5', marginBottom: '20px' }}>
                  Tus hamburguesas ya entraron a la parrilla de roble viva. Tiempo estimado: <strong>18 minutos</strong>.
                </p>

                <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: '12px', borderRadius: '12px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '0.78rem', color: '#78350F', fontWeight: '700' }}>
                    💎 +35 RapidPoints Acreditados a tu cuenta VIP
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setActiveTab('ordenes');
                  }}
                  style={{
                    background: '#B45309',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  📦 Ver Rastreador en Vivo
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== BOTTOM NAVIGATION BAR ==================== */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '480px',
        height: '68px',
        background: '#FFFFFF',
        borderTop: '1px solid #E8DFD5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 50,
        boxShadow: '0 -4px 15px rgba(0, 0, 0, 0.05)'
      }}>
        {[
          { id: 'menu', label: 'Menú', icon: '🍔' },
          { id: 'ofertas', label: 'Ofertas', icon: '🏷️' },
          { id: 'ordenes', label: 'Órdenes', icon: '📦', badge: orders.some(o => o.statusStage < 4) ? '●' : null },
          { id: 'perfil', label: 'Perfil', icon: '👤' }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                height: '100%',
                background: 'none',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                cursor: 'pointer',
                color: isActive ? '#B45309' : '#64748B',
                transition: 'all 0.15s ease',
                position: 'relative'
              }}
            >
              <div style={{
                fontSize: '1.35rem',
                transform: isActive ? 'translateY(-2px)' : 'none',
                transition: 'transform 0.15s'
              }}>
                {tab.icon}
              </div>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: isActive ? '800' : '600',
                letterSpacing: '-0.01em'
              }}>
                {tab.label}
              </span>
              {tab.badge && (
                <span style={{
                  position: 'absolute',
                  top: '10px',
                  right: '28%',
                  color: '#DC2626',
                  fontSize: '0.9rem',
                  lineHeight: 1
                }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
