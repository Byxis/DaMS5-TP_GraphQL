// ÉTAPE 1 — le schéma. Lancez : npm run test:1
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadSchema, fieldType } from './helpers.js';

test('Étape 1 · le schéma compile', () => {
  loadSchema();
});

test('Étape 1 · enum OrderStatus { PENDING SHIPPED DELIVERED }', () => {
  const type = loadSchema().getType('OrderStatus');
  assert.ok(type, "Le type OrderStatus n'existe pas.");
  assert.ok(type.getValues, 'OrderStatus doit être un enum, pas un type.');
  const values = type.getValues().map((v) => v.name).sort();
  assert.deepEqual(values, ['DELIVERED', 'PENDING', 'SHIPPED']);
});

test('Étape 1 · type Order', () => {
  const schema = loadSchema();
  assert.ok(schema.getType('Order'), "Le type Order n'existe pas.");
  const expected = {
    id: 'ID!',
    status: 'OrderStatus!',
    quantity: 'Int!',
    total: 'Float!',
    product: 'Product!',
  };
  for (const [field, type] of Object.entries(expected)) {
    assert.equal(fieldType(schema, 'Order', field), type, `Order.${field} doit être de type ${type}`);
  }
});

test('Étape 1 · type User', () => {
  const schema = loadSchema();
  assert.ok(schema.getType('User'), "Le type User n'existe pas.");
  assert.equal(fieldType(schema, 'User', 'id'), 'ID!', 'User.id doit être de type ID!');
  assert.equal(fieldType(schema, 'User', 'name'), 'String!', 'User.name doit être de type String!');
  assert.equal(fieldType(schema, 'User', 'orders'), '[Order!]!',
    'User.orders doit être une liste non nulle de commandes non nulles : [Order!]!');
  assert.equal(fieldType(schema, 'User', 'email'), undefined,
    "Pas d'email dans le schéma : l'écran n'en a pas besoin (et c'est une donnée perso).");
});

test('Étape 1 · input CreateOrderInput', () => {
  const schema = loadSchema();
  const type = schema.getType('CreateOrderInput');
  assert.ok(type, "Le type CreateOrderInput n'existe pas.");
  assert.equal(type.constructor.name, 'GraphQLInputObjectType',
    'CreateOrderInput doit être déclaré avec le mot-clé input, pas type.');
  assert.equal(fieldType(schema, 'CreateOrderInput', 'productId'), 'ID!');
  assert.equal(fieldType(schema, 'CreateOrderInput', 'quantity'), 'Int!');
});

test('Étape 1 · Query.user(id: ID!): User et Query.orders: [Order!]!', () => {
  const schema = loadSchema();
  const user = schema.getQueryType().getFields().user;
  assert.ok(user, "Le champ Query.user n'existe pas.");
  assert.equal(String(user.type), 'User',
    'Query.user doit renvoyer User (SANS !) : un id inconnu renvoie null.');
  assert.equal(String(user.args.find((a) => a.name === 'id')?.type), 'ID!',
    'Query.user doit prendre un argument id: ID!');
  assert.equal(fieldType(schema, 'Query', 'orders'), '[Order!]!');
});
