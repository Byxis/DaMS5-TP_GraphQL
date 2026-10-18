// =============================================================================
//  loaders.js — CORRIGÉ (étape 3).
//
//  Contrat d'une batch function : une liste d'ids en entrée, une liste de
//  résultats en sortie, MÊME LONGUEUR et MÊME ORDRE (null si introuvable).
// =============================================================================
import DataLoader from 'dataloader';

export function createLoaders(db) {
  return {
    product: new DataLoader(async (ids) => {
      // 1 seule requête : SELECT * FROM products WHERE id IN (12, 7, 31, 3)
      const rows = await db.productsByIds(ids);
      // La base ne garantit pas l'ordre : on le remet dans celui des ids.
      // (Map = recherche en O(1) ; un rows.find() dans le map marche aussi.)
      const byId = new Map(rows.map((product) => [product.id, product]));
      return ids.map((id) => byId.get(id) ?? null);
    }),
  };
}
