// =============================================================================
//  server.js — assemble le serveur. Vous n'avez RIEN à modifier ici.
//
//  ApolloServer = schéma (le contrat) + resolvers (qui va chercher quoi).
//  Le "context" est recréé à CHAQUE requête HTTP : c'est le 3e argument
//  (ctx) que reçoivent tous vos resolvers.
// =============================================================================
import { ApolloServer } from '@apollo/server';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import { createLoaders } from './loaders.js';
import { db } from './db.js';

export function createApolloServer(options = {}) {
  return new ApolloServer({ typeDefs, resolvers, ...options });
}

export function createContext() {
  return {
    db,                     // la fausse base de données
    currentUserId: '42',    // "l'utilisateur connecté" (on simule l'authentification)
    loaders: createLoaders(db), // NOUVEAUX loaders à chaque requête (étape 3)
  };
}
