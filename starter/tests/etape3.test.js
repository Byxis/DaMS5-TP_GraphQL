// ÉTAPE 3 — le problème N+1 et DataLoader. Lancez : npm run test:3
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { executeOk, db } from './helpers.js';
import { createLoaders } from '../src/loaders.js';

test('Étape 3 · loaders.product est un DataLoader', () => {
  const loaders = createLoaders(db);
  assert.ok(loaders.product && typeof loaders.product.load === 'function',
    'createLoaders(db).product doit être un new DataLoader(...)');
});

test('Étape 3 · le DataLoader renvoie les produits DANS L\'ORDRE des ids demandés', async () => {
  const loaders = createLoaders(db);
  const result = await loaders.product.loadMany(['31', '7', '12', '999']);
  assert.deepEqual(result.map((p) => p?.name ?? null), ['Souris', 'Clavier', 'Casque audio', null],
    'Votre batch function doit remettre les produits dans l\'ordre des ids (et null si introuvable).');
});

test('Étape 3 · { orders { product { name } } } ne fait plus que 2 requêtes en base', async () => {
  const data = await executeOk('{ orders { status product { name } } }');
  assert.equal(data.orders.length, 10);
  assert.equal(db.queryCount, 2,
    `Attendu : 2 requêtes (1 pour orders + 1 pour TOUS les produits). Obtenu : ${db.queryCount}.\n`
    + '   Order.product utilise-t-il bien ctx.loaders.product.load(...) ?');
});
