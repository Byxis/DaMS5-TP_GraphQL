// =============================================================================
//  db.js — une FAUSSE base de données, en mémoire.
//
//  ⚠ Vous n'avez RIEN à modifier dans ce fichier.
//
//  Chaque fonction simule une requête SQL :
//    - elle attend 30 ms (comme un vrai aller-retour vers une base) ;
//    - elle affiche la requête dans le terminal : [DB #3] SELECT ...
//    - elle incrémente un compteur, pour qu'on puisse compter les requêtes.
//
//  Les lignes "en base" ont des clés étrangères (userId, productId), comme
//  en SQL. Le schéma GraphQL, lui, expose des OBJETS (order.product, user.orders).
//  Faire le lien entre les deux, c'est le travail des resolvers.
// =============================================================================

const users = [
  { id: '42', name: 'Inès',   email: 'ines@example.com' },
  { id: '43', name: 'Hugo',   email: 'hugo@example.com' },
  { id: '44', name: 'Sarah',  email: 'sarah@example.com' },
];

const products = [
  { id: '7',  name: 'Clavier',      price: 49.9,  stock: 12 },
  { id: '12', name: 'Casque audio', price: 59.9,  stock: 4 },
  { id: '31', name: 'Souris',       price: 12.5,  stock: 30 },
  { id: '3',  name: 'Écran 27"',    price: 189.0, stock: 2 },
  { id: '18', name: 'Webcam',       price: 39.0,  stock: 0 }, // rupture de stock !
];

// 10 commandes : le chiffre de la diapo "Combien de requêtes en base ?"
const orders = [
  { id: '101', userId: '42', productId: '12', quantity: 1, status: 'DELIVERED' },
  { id: '102', userId: '42', productId: '7',  quantity: 1, status: 'SHIPPED' },
  { id: '103', userId: '42', productId: '31', quantity: 2, status: 'PENDING' },
  { id: '104', userId: '43', productId: '12', quantity: 1, status: 'DELIVERED' },
  { id: '105', userId: '43', productId: '3',  quantity: 1, status: 'SHIPPED' },
  { id: '106', userId: '43', productId: '31', quantity: 1, status: 'DELIVERED' },
  { id: '107', userId: '44', productId: '7',  quantity: 2, status: 'PENDING' },
  { id: '108', userId: '44', productId: '12', quantity: 1, status: 'SHIPPED' },
  { id: '109', userId: '44', productId: '3',  quantity: 1, status: 'DELIVERED' },
  { id: '110', userId: '44', productId: '31', quantity: 3, status: 'PENDING' },
];

// --------------------------------------------------------------- outillage --
let queryCount = 0;
let quiet = false;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run(sql, result) {
  queryCount += 1;
  if (!quiet) console.log(`  [DB #${queryCount}] ${sql}`);
  await sleep(30);
  // structuredClone : on renvoie une copie, comme une vraie base
  return structuredClone(result);
}

function totalOf(order) {
  const product = products.find((p) => p.id === order.productId);
  return Math.round(product.price * order.quantity * 100) / 100;
}

function withTotal(order) {
  return { ...order, total: totalOf(order) };
}

// ------------------------------------------------------ l'API de la "base" --
export const db = {
  // --- utilisateurs ---------------------------------------------------------
  userById(id) {
    return run(`SELECT * FROM users WHERE id = ${id}`,
      users.find((u) => u.id === id) ?? null);
  },

  // --- commandes ------------------------------------------------------------
  allOrders() {
    return run('SELECT * FROM orders', orders.map(withTotal));
  },

  orderById(id) {
    const order = orders.find((o) => o.id === id);
    return run(`SELECT * FROM orders WHERE id = ${id}`, order ? withTotal(order) : null);
  },

  ordersByUserId(userId) {
    return run(`SELECT * FROM orders WHERE user_id = ${userId}`,
      orders.filter((o) => o.userId === userId).map(withTotal));
  },

  // --- produits -------------------------------------------------------------
  allProducts() {
    return run('SELECT * FROM products', products);
  },

  productById(id) {
    return run(`SELECT * FROM products WHERE id = ${id}`,
      products.find((p) => p.id === id) ?? null);
  },

  /** UNE seule requête pour plusieurs ids. L'ordre du résultat n'est PAS garanti
   *  (comme en SQL avec WHERE id IN (...)). */
  productsByIds(ids) {
    const found = products.filter((p) => ids.includes(p.id));
    return run(`SELECT * FROM products WHERE id IN (${ids.join(', ')})`, found);
  },

  // --- écriture -------------------------------------------------------------
  async insertOrder({ userId, productId, quantity }) {
    const product = products.find((p) => p.id === productId);
    product.stock -= quantity;
    const order = {
      id: String(101 + orders.length),
      userId, productId, quantity,
      status: 'PENDING',
    };
    orders.push(order);
    return run(`INSERT INTO orders VALUES (${order.id}, ${userId}, ${productId}, ${quantity})`,
      withTotal(order));
  },

  // --- pour les tests et les logs -------------------------------------------
  get queryCount() { return queryCount; },
  resetCount() { queryCount = 0; },
  setQuiet(value) { quiet = value; },
};
