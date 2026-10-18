// BONUS — mutation et erreurs. Lancez : npm run test:bonus
// Ces tests sont IGNORÉS (skip) tant que vous n'avez pas commencé le bonus.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadSchema, fieldType, execute, executeOk } from './helpers.js';

function has(typeName, fieldName) {
  try {
    return fieldType(loadSchema(), typeName, fieldName) !== undefined;
  } catch {
    return false;
  }
}

const CREATE = `
  mutation Commander($in: CreateOrderInput!) {
    createOrder(input: $in) {
      order { id status total product { name } }
      userErrors { message field }
    }
  }`;

test('Bonus A · schéma de la mutation createOrder', { skip: !has('Mutation', 'createOrder') }, () => {
  const schema = loadSchema();
  assert.equal(fieldType(schema, 'Mutation', 'createOrder'), 'CreateOrderPayload!');
  assert.equal(fieldType(schema, 'CreateOrderPayload', 'order'), 'Order',
    'payload.order doit être nullable : il vaut null en cas de refus.');
  assert.equal(fieldType(schema, 'CreateOrderPayload', 'userErrors'), '[UserError!]!');
  assert.equal(fieldType(schema, 'UserError', 'message'), 'String!');
  assert.equal(fieldType(schema, 'UserError', 'field'), 'String');
});

test('Bonus A · createOrder : succès', { skip: !has('Mutation', 'createOrder') }, async () => {
  const data = await executeOk(CREATE, { in: { productId: '7', quantity: 2 } });
  assert.deepEqual(data.createOrder.userErrors, []);
  assert.equal(data.createOrder.order.status, 'PENDING');
  assert.equal(data.createOrder.order.total, 99.8);
  assert.equal(data.createOrder.order.product.name, 'Clavier');
});

test('Bonus A · createOrder : refus métier « Stock épuisé »', { skip: !has('Mutation', 'createOrder') }, async () => {
  const data = await executeOk(CREATE, { in: { productId: '18', quantity: 1 } });
  assert.equal(data.createOrder.order, null);
  assert.equal(data.createOrder.userErrors[0]?.message, 'Stock épuisé');
});

test('Bonus A · createOrder : quantité invalide', { skip: !has('Mutation', 'createOrder') }, async () => {
  const data = await executeOk(CREATE, { in: { productId: '7', quantity: 0 } });
  assert.equal(data.createOrder.order, null);
  assert.equal(data.createOrder.userErrors[0]?.field, 'quantity');
});

test('Bonus A · createOrder : produit inconnu', { skip: !has('Mutation', 'createOrder') }, async () => {
  const data = await executeOk(CREATE, { in: { productId: '999', quantity: 1 } });
  assert.equal(data.createOrder.order, null);
  assert.equal(data.createOrder.userErrors[0]?.field, 'productId');
});

test('Bonus B · order(id) inconnu : data ET errors dans la même réponse', { skip: !has('Query', 'order') }, async () => {
  const result = await execute('{ order(id: "999") { id } }');
  assert.equal(result.data?.order, null, 'data.order doit valoir null.');
  assert.equal(result.errors?.[0]?.message, 'Commande introuvable');
  assert.deepEqual(result.errors[0].path, ['order']);
  assert.equal(result.errors[0].extensions?.code, 'NOT_FOUND');
});

test('Bonus B · order(id) connu', { skip: !has('Query', 'order') }, async () => {
  const data = await executeOk('{ order(id: "102") { status product { name } } }');
  assert.deepEqual(data.order, { status: 'SHIPPED', product: { name: 'Clavier' } });
});
