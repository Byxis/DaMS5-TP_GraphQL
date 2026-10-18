// =============================================================================
//  index.js — démarre le serveur HTTP. Vous n'avez RIEN à modifier ici.
//
//  Après chaque requête, le terminal affiche combien de requêtes "SQL" ont
//  été faites. Gardez-le sous les yeux pendant l'étape 3 !
// =============================================================================
import { startStandaloneServer } from '@apollo/server/standalone';
import { createApolloServer, createContext } from './server.js';
import { db } from './db.js';

// Petit plugin qui affiche le nom de chaque opération et le nombre de requêtes en base.
const logPlugin = {
  async requestDidStart({ request }) {
    // La Sandbox interroge le schéma toutes les quelques secondes : on ne l'affiche pas.
    if (request.operationName === 'IntrospectionQuery') return {};
    console.log(`\n▶ ${request.operationName ?? '(requête sans nom)'}`);
    return {
      async willSendResponse() {
        const n = db.queryCount;
        console.log(`◀ ${n} requête${n > 1 ? 's' : ''} en base`);
      },
    };
  },
};

const server = createApolloServer({ plugins: [logPlugin] });

const { url } = await startStandaloneServer(server, {
  listen: { port: Number(process.env.PORT) || 4000 },
  context: async () => {
    db.resetCount();
    return createContext();
  },
});

console.log(`🚀 Serveur prêt : ${url}`);
console.log('   Ouvrez cette adresse dans votre navigateur pour lancer Apollo Sandbox.');
