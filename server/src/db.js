const mysql = require('mysql2/promise');

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'Rey de las Burgers',
    category: 'A la Parrilla',
    specialty: 'Suprema Legendaria',
    specialtyBadge: '👑 Suprema Legendaria',
    badgeColor: '#b45309',
    badgeBg: '#fef3c7',
    price: 14.99,
    stock: 45,
    salesCount: 428,
    rating: 4.98,
    cookTime: '12-14 min',
    calories: '920 kcal',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&auto=format&fit=crop&q=80',
    description: 'Triple carne 100% Angus (450g) flameada a la leña de roble, triple queso cheddar añejo fundido, cebolla caramelizada al bourbon, panceta crocante y salsa secreta Real King en pan brioche artesanal dorado con mantequilla clarificada.'
  },
  {
    id: 2,
    name: 'Burger Real Clásica',
    category: 'Clásicas de la Casa',
    specialty: 'Tradicional Oro',
    specialtyBadge: '⭐ Clásica Premium',
    badgeColor: '#1d4ed8',
    badgeBg: '#dbeafe',
    price: 10.50,
    stock: 60,
    salesCount: 512,
    rating: 4.92,
    cookTime: '8-10 min',
    calories: '710 kcal',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=700&auto=format&fit=crop&q=80',
    description: 'Medallón jugoso de carne Angus seleccionada (180g) a fuego vivo, queso cheddar artesanal derretido, lechuga romana crocante, rodajas de tomate de huerta, pepinillos encurtidos y aderezo especial Hamburger Rapid.'
  },
  {
    id: 3,
    name: 'Burger Real Doble',
    category: 'Smash & Dobles',
    specialty: 'Master Double',
    specialtyBadge: '🔥 Doble Signature',
    badgeColor: '#c2410c',
    badgeBg: '#ffedd5',
    price: 13.50,
    stock: 38,
    salesCount: 385,
    rating: 4.95,
    cookTime: '10-12 min',
    calories: '860 kcal',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=700&auto=format&fit=crop&q=80',
    description: 'Doble medallón smash con costra perfectamente caramelizada (300g totales), doble queso Gouda fundido, bacon ahumado crujiente al manzano, cebolla morada fresca en aros y emulsión cremosa de mostaza dijon.'
  },
  {
    id: 4,
    name: 'Burger Doble Especial',
    category: 'Especialidades',
    specialty: 'Especial del Chef',
    specialtyBadge: '🏆 Alta Cocina',
    badgeColor: '#7c3aed',
    badgeBg: '#ede9fe',
    price: 15.99,
    stock: 30,
    salesCount: 294,
    rating: 4.97,
    cookTime: '12-15 min',
    calories: '980 kcal',
    image: 'https://images.unsplash.com/photo-1583032015879-a562141d3c01?w=700&auto=format&fit=crop&q=80',
    description: 'Doble medallón de res madurada 21 días, huevo de campo frito con yema tierna, queso Provolone ahumado, bacon crocante, aros de cebolla rebozados y reducción de alioli trufado sobre pan de papa horneado en el día.'
  },
  {
    id: 5,
    name: 'Smash Trufa Imperial',
    category: 'Gourmet Signature',
    specialty: 'Gourmet Trufada',
    specialtyBadge: '🍄 Trufa Negra de Verano',
    badgeColor: '#0f766e',
    badgeBg: '#ccfbf1',
    price: 16.50,
    stock: 25,
    salesCount: 210,
    rating: 4.99,
    cookTime: '10-12 min',
    calories: '840 kcal',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=700&auto=format&fit=crop&q=80',
    description: 'Carne Angus seleccionada smashed a 250°C, crema suave de queso Brie francés, champiñones portobello salteados a la mantequilla noisette y mayonesa elaborada con auténtica trufa negra.'
  },
  {
    id: 6,
    name: 'Crispy Chicken Real Ranch',
    category: 'Pollo Crujiente',
    specialty: 'Pollo Crujiente',
    specialtyBadge: '🍗 Ultra Crispy 24h',
    badgeColor: '#b45309',
    badgeBg: '#fef3c7',
    price: 11.99,
    stock: 40,
    salesCount: 340,
    rating: 4.91,
    cookTime: '10 min',
    calories: '760 kcal',
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=700&auto=format&fit=crop&q=80',
    description: 'Pechuga entera marinada durante 24 horas en suero de mantequilla y 11 hierbas aromáticas, rebozado extra crujiente estilo sureño, ensalada coleslaw con manzanas ácidas y aderezo ranch ahumado casero.'
  },
  {
    id: 7,
    name: 'Bacon Smokehouse BBQ',
    category: 'A la Parrilla',
    specialty: 'Ahumada al Roble',
    specialtyBadge: '🥓 Ahumada con Nogal',
    badgeColor: '#be123c',
    badgeBg: '#ffe4e6',
    price: 13.99,
    stock: 50,
    salesCount: 395,
    rating: 4.93,
    cookTime: '11 min',
    calories: '890 kcal',
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=700&auto=format&fit=crop&q=80',
    description: 'Carne Angus asada sobre brasas vivas, cuatro lonchas de panceta ahumada con madera de nogal, queso Monterey Jack, crujientes tiras de cebolla frita y nuestra salsa barbacoa de cerveza negra y miel de caña.'
  },
  {
    id: 8,
    name: 'Guacamole Spicy Fire',
    category: 'Especialidades',
    specialty: 'Fuego Tex-Mex',
    specialtyBadge: '🌶️ Tex-Mex Picante',
    badgeColor: '#dc2626',
    badgeBg: '#fee2e2',
    price: 12.50,
    stock: 35,
    salesCount: 260,
    rating: 4.89,
    cookTime: '9 min',
    calories: '810 kcal',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=700&auto=format&fit=crop&q=80',
    description: 'Carne Angus sellada con costra de chiles secos, queso Pepper Jack fundido, abundante guacamole rústico preparado al momento, jalapeños macerados en agave y salsa chipotle mayo con toque cítrico.'
  },
  {
    id: 9,
    name: 'Cuatro Quesos Nobles',
    category: 'Especialidades',
    specialty: 'Queso Fundido Oro',
    specialtyBadge: '🧀 Cascada 4 Quesos',
    badgeColor: '#ca8a04',
    badgeBg: '#fef9c3',
    price: 13.25,
    stock: 32,
    salesCount: 310,
    rating: 4.94,
    cookTime: '10 min',
    calories: '905 kcal',
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=700&auto=format&fit=crop&q=80',
    description: 'Una explosión de sabor lácteo con carne jugosa de res combinada con queso Cheddar inglés madurado, Provolone hilado, suave crema Gorgonzola y costra exterior de queso Emmental gratinado con hierbas provenzales.'
  },
  {
    id: 10,
    name: 'Veggie Royal Deluxe',
    category: 'Veggie & Saludable',
    specialty: 'Plant-Based Gourmet',
    specialtyBadge: '🌿 100% Plant-Based',
    badgeColor: '#15803d',
    badgeBg: '#dcfce7',
    price: 11.50,
    stock: 28,
    salesCount: 195,
    rating: 4.90,
    cookTime: '8 min',
    calories: '610 kcal',
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=700&auto=format&fit=crop&q=80',
    description: 'Medallón artesanal elaborado con lentejas tostadas, setas portobello confitadas y quinoa real, queso vegetal cremoso fundido, hojas de rúcula silvestre, tomates deshidratados y suave mayonesa de aguacate.'
  }
];

const INITIAL_CUSTOMERS = [
  {
    id: 'CUST-001',
    name: 'Valentina Restrepo',
    email: 'valentina.r@rapidmail.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    tier: 'VIP Diamond',
    tierBadge: '💎 Diamond VIP',
    burgersConsumed: 38,
    totalSpent: 542.80,
    favoriteBurger: 'Rey de las Burgers',
    lastOrder: 'Hace 2 horas',
    ordersCount: 19,
    rating: 5
  },
  {
    id: 'CUST-002',
    name: 'Carlos Mendoza',
    email: 'carlos.m@techcorp.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    tier: 'VIP Diamond',
    tierBadge: '💎 Diamond VIP',
    burgersConsumed: 29,
    totalSpent: 418.50,
    favoriteBurger: 'Burger Real Doble',
    lastOrder: 'Ayer',
    ordersCount: 14,
    rating: 5
  },
  {
    id: 'CUST-003',
    name: 'Lucía Fernández',
    email: 'lucia.f@creativearts.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    tier: 'Gold Gourmet',
    tierBadge: '🥇 Gold Gourmet',
    burgersConsumed: 18,
    totalSpent: 264.20,
    favoriteBurger: 'Smash Trufa Imperial',
    lastOrder: 'Hace 3 días',
    ordersCount: 9,
    rating: 5
  },
  {
    id: 'CUST-004',
    name: 'Mateo Sandoval',
    email: 'mateo.s@devstudio.net',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    tier: 'Gold Gourmet',
    tierBadge: '🥇 Gold Gourmet',
    burgersConsumed: 14,
    totalSpent: 198.00,
    favoriteBurger: 'Burger Doble Especial',
    lastOrder: 'Hace 4 días',
    ordersCount: 7,
    rating: 4
  },
  {
    id: 'CUST-005',
    name: 'Sofía Navarro',
    email: 'sofia.navarro@global.org',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    tier: 'Silver Regular',
    tierBadge: '🥈 Silver Regular',
    burgersConsumed: 8,
    totalSpent: 98.50,
    favoriteBurger: 'Crispy Chicken Real Ranch',
    lastOrder: 'Hace 1 semana',
    ordersCount: 4,
    rating: 5
  },
  {
    id: 'CUST-006',
    name: 'Javier Alarcón',
    email: 'javier.a@freelance.dev',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    tier: 'Silver Regular',
    tierBadge: '🥈 Silver Regular',
    burgersConsumed: 6,
    totalSpent: 79.90,
    favoriteBurger: 'Bacon Smokehouse BBQ',
    lastOrder: 'Hace 2 semanas',
    ordersCount: 3,
    rating: 4
  },
  {
    id: 'CUST-007',
    name: 'Elena Gómez',
    email: 'elena.g@fintech.co',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    tier: 'Nuevo Explorador',
    tierBadge: '🌱 Explorador',
    burgersConsumed: 2,
    totalSpent: 26.50,
    favoriteBurger: 'Burger Real Clásica',
    lastOrder: 'Hace 3 semanas',
    ordersCount: 1,
    rating: 5
  }
];

let inMemoryProducts = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
let inMemoryCustomers = JSON.parse(JSON.stringify(INITIAL_CUSTOMERS));
let inMemoryOrders = [
  {
    id: 'HR-9081',
    customer: 'Valentina Restrepo',
    items: ['Rey de las Burgers x2', 'Burger Real Doble x1'],
    total: 43.48,
    status: 'Entregado',
    date: '2026-10-20 16:45'
  },
  {
    id: 'HR-9082',
    customer: 'Carlos Mendoza',
    items: ['Burger Doble Especial x1', 'Bacon Smokehouse BBQ x1'],
    total: 29.98,
    status: 'En camino 🛵',
    date: '2026-10-20 17:30'
  }
];

let pool = null;
let isConnectedToMySQL = false;
let lastDbError = null;

async function initDB() {
  const databaseUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;
  const host = process.env.DB_HOST || process.env.MYSQL_HOST;
  const user = process.env.DB_USER || process.env.MYSQL_USER || 'root';
  const password = process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || '';
  const database = process.env.DB_NAME || process.env.MYSQL_DATABASE || 'demo';
  const port = parseInt(process.env.DB_PORT || '3306', 10);

  if (!databaseUrl && !host) {
    lastDbError = 'Variables DB_HOST ni DATABASE_URL configuradas en el entorno.';
    console.log(`ℹ️ [DB] ${lastDbError} Hamburger Rapid operando en modo In-Memory con persistencia de demo.`);
    return;
  }

  try {
    if (databaseUrl) {
      console.log(`🔄 [DB] Intentando conectar a MySQL vía DATABASE_URL...`);
      pool = mysql.createPool(databaseUrl);
    } else {
      console.log(`🔄 [DB] Intentando conectar a MySQL en ${host}:${port} con usuario "${user}" a la BD "${database}"...`);
      pool = mysql.createPool({
        host,
        user,
        password,
        database,
        port,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 8000
      });
    }

    const connection = await pool.getConnection();
    console.log(`✅ [DB] Conectado exitosamente a MySQL (${host || 'URL'} - BD: ${database})`);

    // Crear tabla si no existe con campos de Hamburger Rapid
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        specialty VARCHAR(100) DEFAULT '',
        specialtyBadge VARCHAR(100) DEFAULT '',
        price DECIMAL(10,2) NOT NULL,
        stock INT NOT NULL DEFAULT 0,
        salesCount INT NOT NULL DEFAULT 0,
        rating DECIMAL(3,2) NOT NULL DEFAULT 5.0,
        cookTime VARCHAR(50) DEFAULT '10 min',
        calories VARCHAR(50) DEFAULT '750 kcal',
        image VARCHAR(500),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Sembrar datos iniciales si la tabla está vacía
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM products');
    if (rows[0].count === 0) {
      console.log('🌱 [DB] Inicializando datos demo de Hamburger Rapid en MySQL (10 hamburguesas maestras)...');
      for (const p of INITIAL_PRODUCTS) {
        await connection.query(
          'INSERT INTO products (name, category, specialty, specialtyBadge, price, stock, salesCount, rating, cookTime, calories, image, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [p.name, p.category, p.specialty, p.specialtyBadge, p.price, p.stock, p.salesCount, p.rating, p.cookTime, p.calories, p.image, p.description]
        );
      }
    }

    connection.release();
    isConnectedToMySQL = true;
    lastDbError = null;
  } catch (error) {
    lastDbError = error.message;
    console.warn(`⚠️ [DB] Conexión a MySQL falló (${error.message}). Hamburger Rapid operando en modo In-Memory.`);
    isConnectedToMySQL = false;
  }
}

async function getProducts() {
  if (!isConnectedToMySQL && (process.env.DB_HOST || process.env.DATABASE_URL)) {
    await initDB();
  }

  if (isConnectedToMySQL && pool) {
    try {
      const [rows] = await pool.query('SELECT * FROM products ORDER BY id ASC');
      return rows;
    } catch (err) {
      console.error('Error consultando MySQL, recurriendo a memoria local:', err.message);
      lastDbError = err.message;
    }
  }
  return inMemoryProducts;
}

async function addProduct({ name, category, specialty, specialtyBadge, price, stock, image, description, cookTime, calories }) {
  if (!isConnectedToMySQL && (process.env.DB_HOST || process.env.DATABASE_URL)) {
    await initDB();
  }

  const pPrice = parseFloat(price) || 0;
  const pStock = parseInt(stock, 10) || 0;

  if (isConnectedToMySQL && pool) {
    const [result] = await pool.query(
      'INSERT INTO products (name, category, specialty, specialtyBadge, price, stock, image, description, cookTime, calories) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, category || 'Especialidades', specialty || 'Gourmet', specialtyBadge || '⭐ Gourmet Rapid', pPrice, pStock, image || '', description || '', cookTime || '10 min', calories || '750 kcal']
    );
    return {
      id: result.insertId,
      name,
      category,
      specialty,
      specialtyBadge,
      price: pPrice,
      stock: pStock,
      image,
      description,
      salesCount: 0,
      rating: 5.0
    };
  }

  const newProduct = {
    id: Date.now(),
    name,
    category: category || 'Especialidades',
    specialty: specialty || 'Gourmet',
    specialtyBadge: specialtyBadge || '⭐ Gourmet Rapid',
    badgeColor: '#b45309',
    badgeBg: '#fef3c7',
    price: pPrice,
    stock: pStock,
    salesCount: 0,
    rating: 5.0,
    cookTime: cookTime || '10-12 min',
    calories: calories || '780 kcal',
    image: image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&auto=format&fit=crop&q=80',
    description: description || 'Nueva creación artesanal de Hamburger Rapid.'
  };
  inMemoryProducts.unshift(newProduct);
  return newProduct;
}

async function deleteProduct(id) {
  const numId = parseInt(id, 10);
  if (isConnectedToMySQL && pool) {
    await pool.query('DELETE FROM products WHERE id = ?', [numId]);
    return true;
  }
  inMemoryProducts = inMemoryProducts.filter(p => p.id !== numId);
  return true;
}

async function resetProducts() {
  if (isConnectedToMySQL && pool) {
    await pool.query('TRUNCATE TABLE products');
    for (const p of INITIAL_PRODUCTS) {
      await pool.query(
        'INSERT INTO products (name, category, specialty, specialtyBadge, price, stock, salesCount, rating, cookTime, calories, image, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [p.name, p.category, p.specialty, p.specialtyBadge, p.price, p.stock, p.salesCount, p.rating, p.cookTime, p.calories, p.image, p.description]
      );
    }
    return;
  }
  inMemoryProducts = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
}

function getCustomers() {
  return inMemoryCustomers;
}

function getStats() {
  const totalBurgersInStock = inMemoryProducts.reduce((acc, p) => acc + (p.stock || 0), 0);
  const totalSalesCount = inMemoryProducts.reduce((acc, p) => acc + (p.salesCount || 0), 0);
  const totalRevenue = inMemoryCustomers.reduce((acc, c) => acc + c.totalSpent, 0) + (totalSalesCount * 12.8);
  const totalCustomers = inMemoryCustomers.length;
  
  // Segmentación por volumen de consumo
  const consumptionTiers = {
    vipDiamond: inMemoryCustomers.filter(c => c.burgersConsumed >= 25).length,
    goldGourmet: inMemoryCustomers.filter(c => c.burgersConsumed >= 10 && c.burgersConsumed < 25).length,
    silverRegular: inMemoryCustomers.filter(c => c.burgersConsumed >= 4 && c.burgersConsumed < 10).length,
    exploradores: inMemoryCustomers.filter(c => c.burgersConsumed < 4).length
  };

  return {
    totalRevenue: parseFloat(totalRevenue.toFixed(2)),
    totalBurgersSold: totalSalesCount + 2940,
    totalBurgersInStock,
    activeCustomersCount: totalCustomers,
    averageRating: 4.94,
    averageOrderValue: 24.50,
    consumptionTiers,
    topBurgers: inMemoryProducts.slice(0, 4).map(p => ({
      name: p.name,
      salesCount: p.salesCount,
      revenue: parseFloat((p.salesCount * p.price).toFixed(2))
    }))
  };
}

function addSimulatedOrder(order) {
  const newOrder = {
    id: `HR-${Math.floor(1000 + Math.random() * 9000)}`,
    customer: order.customer || 'Cliente App Móvil',
    items: order.items || [],
    total: order.total || 0,
    status: 'En la parrilla 🔥',
    date: new Date().toISOString().replace('T', ' ').substring(0, 16)
  };
  inMemoryOrders.unshift(newOrder);

  // Update customer if exists or increment sales
  if (order.items && Array.isArray(order.items)) {
    order.items.forEach(item => {
      const prod = inMemoryProducts.find(p => p.id === item.id || p.name === item.name);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - (item.quantity || 1));
        prod.salesCount = (prod.salesCount || 0) + (item.quantity || 1);
      }
    });
  }

  return newOrder;
}

function getOrders() {
  return inMemoryOrders;
}

function getDbStatus() {
  return {
    mode: isConnectedToMySQL ? 'mysql' : 'in-memory',
    connected: isConnectedToMySQL,
    host: process.env.DB_HOST || (process.env.DATABASE_URL ? 'via-database-url' : 'in-memory-storage'),
    database: process.env.DB_NAME || 'hamburger_rapid_db',
    user: process.env.DB_USER || 'admin',
    productsCount: inMemoryProducts.length,
    customersCount: inMemoryCustomers.length,
    latencyMs: isConnectedToMySQL ? 12 : 1,
    lastBackup: '2026-10-20 18:00:00 UTC',
    error: lastDbError
  };
}

module.exports = {
  INITIAL_PRODUCTS,
  INITIAL_CUSTOMERS,
  initDB,
  getProducts,
  addProduct,
  deleteProduct,
  resetProducts,
  getCustomers,
  getStats,
  addSimulatedOrder,
  getOrders,
  getDbStatus
};
