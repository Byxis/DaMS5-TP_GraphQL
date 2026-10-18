// =============================================================================
//  loaders.js — la correction du problème N+1 (ÉTAPE 3).
//
//  Un DataLoader prend une "batch function" : on lui donne une LISTE d'ids,
//  elle doit renvoyer une LISTE de résultats...
//     - de la MÊME LONGUEUR que la liste d'ids,
//     - dans le MÊME ORDRE que la liste d'ids  (null si introuvable).
//
//  DataLoader attend que tous les resolvers aient fait leur .load(id),
//  puis appelle la batch function UNE seule fois avec tous les ids.
// =============================================================================
import DataLoader from 'dataloader';

export function createLoaders(db) {
  return {
    // ÉTAPE 3 — TODO(vous) : supprimez la ligne "product: null," ci-dessous,
    // décommentez le squelette (retirez les //), puis écrivez la condition.
    product: null,

    // product: new DataLoader(async (ids) => {
    //   // 1. UNE seule requête pour tous les ids : WHERE id IN (...)
    //   const rows = await db.productsByIds(ids);
    //
    //   // 2. Pour CHAQUE id demandé, chercher SON produit dans rows.
    //   //    Exemple : ids = ["31", "7", "999"]
    //   //              rows = [Clavier (id "7"), Souris (id "31")]   ← ordre de la base
    //   //              → il faut renvoyer [Souris, Clavier, null]
    //   return ids.map((id) => rows.find((product) => /* À VOUS : la condition */) ?? null);
    // }),
  };
}
