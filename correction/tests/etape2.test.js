// ÉTAPE 2 — les resolvers. Lancez : npm run test:2
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { executeOk } from './helpers.js';

test('Étape 2 · Query.user renvoie Inès pour l\'id 42', async () => {
  const data = await executeOk('{ user(id: "42") { id name } }');
  assert.deepEqual(data.user, { id: '42', name: 'Inès' });
});

test('Étape 2 · Query.user renvoie null pour un id inconnu', async () => {
  const data = await executeOk('{ user(id: "999") { name } }');
  assert.equal(data.user, null);
});

test('Étape 2 · Query.orders renvoie les 10 commandes', async () => {
  const data = await executeOk('{ orders { id status total } }');
  assert.equal(data.orders.length, 10);
  assert.deepEqual(data.orders[0], { id: '101', status: 'DELIVERED', total: 59.9 });
});

test('Étape 2 · Order.product va chercher le produit de la commande', async () => {
  const data = await executeOk('{ orders { id product { name } } }');
  assert.equal(data.orders[0].product.name, 'Casque audio');
  assert.equal(data.orders[1].product.name, 'Clavier');
});

test('Étape 2 · User.orders : l\'écran « Mes commandes » de la diapo', async () => {
  const data = await executeOk(`{
    user(id: "42") {
      name
      orders { status product { name } }
    }
  }`);
  assert.deepEqual(data.user, {
    name: 'Inès',
    orders: [
      { status: 'DELIVERED', product: { name: 'Casque audio' } },
      { status: 'SHIPPED',   product: { name: 'Clavier' } },
      { status: 'PENDING',   product: { name: 'Souris' } },
    ],
  });
});
