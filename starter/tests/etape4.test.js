// ÉTAPE 4 — fragments et directives. Lancez : npm run test:4
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse, validate, visit, Kind } from 'graphql';
import { loadSchema, executeOk } from './helpers.js';

const source = readFileSync(new URL('../queries/etape4.graphql', import.meta.url), 'utf8');

function document() {
  try {
    return parse(source);
  } catch (error) {
    throw new Error(`queries/etape4.graphql n'est pas du GraphQL valide :\n   ${error.message}`);
  }
}

test('Étape 4 · la requête est valide par rapport au schéma', () => {
  const errors = validate(loadSchema(), document());
  assert.deepEqual(errors.map((e) => e.message), [],
    'Collez votre requête dans Apollo Sandbox : elle vous soulignera les erreurs.');
});

test('Étape 4 · opération MonProfil($id: ID!, $details: Boolean!)', () => {
  const op = document().definitions.find((d) => d.kind === Kind.OPERATION_DEFINITION);
  assert.equal(op?.name?.value, 'MonProfil', "L'opération doit s'appeler MonProfil.");
  const vars = Object.fromEntries(op.variableDefinitions.map((v) => [
    v.variable.name.value,
    source.slice(v.type.loc.start, v.type.loc.end),
  ]));
  assert.deepEqual(vars, { id: 'ID!', details: 'Boolean!' });
});

test('Étape 4 · le fragment InfosProduit est défini sur Product et utilisé 2 fois', () => {
  const doc = document();
  const fragment = doc.definitions.find((d) => d.kind === Kind.FRAGMENT_DEFINITION);
  assert.equal(fragment?.name?.value, 'InfosProduit', 'Il faut un fragment nommé InfosProduit.');
  assert.equal(fragment.typeCondition.name.value, 'Product', 'InfosProduit doit porter sur Product.');
  let spreads = 0;
  visit(doc, { FragmentSpread: (node) => { if (node.name.value === 'InfosProduit') spreads += 1; } });
  assert.ok(spreads >= 2, `...InfosProduit doit apparaître au moins 2 fois (trouvé : ${spreads}).`);
});

test('Étape 4 · @include(if: $details) masque ou affiche les commandes', async () => {
  const sans = await executeOk(source, { id: '42', details: false });
  assert.equal(sans.user.name, 'Inès');
  assert.equal(sans.user.orders, undefined, 'Avec details=false, orders ne doit pas être dans la réponse.');

  const avec = await executeOk(source, { id: '42', details: true });
  assert.equal(avec.user.orders.length, 3, 'Avec details=true, on doit voir les 3 commandes d\'Inès.');
  assert.equal(avec.user.orders[0].product.price, 59.9, 'Les produits des commandes doivent utiliser InfosProduit.');
  assert.ok(avec.products.length >= 5, 'La requête doit aussi lister products (avec InfosProduit).');
});
