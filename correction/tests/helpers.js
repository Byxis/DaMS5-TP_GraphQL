// Outils communs aux tests. Vous n'avez RIEN à modifier ici.
import { buildSchema } from 'graphql';
import { typeDefs } from '../src/schema.js';
import { db } from '../src/db.js';

db.setQuiet(true); // pas de logs [DB #n] pendant les tests

/** Construit le schéma, avec un message lisible s'il y a une faute de syntaxe. */
export function loadSchema() {
  try {
    return buildSchema(typeDefs);
  } catch (error) {
    throw new Error(`Votre schéma (src/schema.graphql) ne compile pas :\n   ${error.message}`);
  }
}

/** Le type d'un champ, sous forme de texte. Ex. : fieldType(schema, 'User', 'orders') === '[Order!]!' */
export function fieldType(schema, typeName, fieldName) {
  const type = schema.getType(typeName);
  const field = type?.getFields?.()[fieldName];
  return field ? String(field.type) : undefined;
}

/** Exécute une opération sur le vrai serveur Apollo, sans passer par HTTP. */
export async function execute(query, variables = {}) {
  // import dynamique : si le schéma ou les resolvers sont cassés, seul ce test échoue
  const { createApolloServer, createContext } = await import('../src/server.js');
  const server = createApolloServer();
  db.resetCount();
  const response = await server.executeOperation(
    { query, variables },
    { contextValue: createContext() },
  );
  await server.stop();
  // Aller-retour JSON : on obtient exactement ce qu'un client recevrait par HTTP.
  return JSON.parse(JSON.stringify(response.body.singleResult));
}

/** Comme execute(), mais échoue si la réponse contient des erreurs. */
export async function executeOk(query, variables = {}) {
  const result = await execute(query, variables);
  if (result.errors?.length) {
    throw new Error('Le serveur a répondu avec des erreurs :\n   '
      + result.errors.map((e) => e.message).join('\n   '));
  }
  return result.data;
}

export { db };
