// =============================================================================
//  schema.js — charge le schéma. Vous n'avez RIEN à modifier ici.
//
//  Le schéma lui-même s'écrit dans src/schema.graphql (étape 1).
// =============================================================================
import { readFileSync } from 'node:fs';

export const typeDefs = readFileSync(new URL('./schema.graphql', import.meta.url), 'utf8');
