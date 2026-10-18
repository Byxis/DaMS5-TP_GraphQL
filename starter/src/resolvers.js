// =============================================================================
//  resolvers.js — QUI VA CHERCHER QUOI.
//
//  Un resolver reçoit toujours les mêmes 3 arguments :
//     (parent, args, ctx)
//       parent : l'objet du niveau au-dessus (ex. la commande, pour Order.product)
//       args   : les arguments du champ    (ex. { id: "42" } pour user(id: "42"))
//       ctx    : le contexte de la requête (ctx.db, ctx.loaders, ctx.currentUserId)
//
//  Pas besoin d'écrire un resolver pour un champ qui existe DÉJÀ tel quel dans
//  l'objet parent (name, price, status...) : GraphQL le lit tout seul.
//  On en écrit un quand il faut ALLER CHERCHER quelque chose (une autre table).
// =============================================================================

export const resolvers = {
  Query: {
    // EXEMPLE DONNÉ : on ignore parent et args, on utilise seulement ctx.
    products: (_parent, _args, ctx) => ctx.db.allProducts(),

    // ÉTAPE 2 — TODO(vous) : décommentez puis complétez.
    // user:   (_parent, args, ctx) => ...,
    // orders: (_parent, _args, ctx) => ...,
  },

  // ÉTAPE 2 — TODO(vous) : décommentez ces blocs puis complétez-les.
  //   ⚠ Apollo refuse de démarrer si un type ci-dessous n'existe pas encore
  //     dans le schéma : faites l'étape 1 d'abord.
  //
  // User: {
  //   orders: (user, _args, ctx) => ...,
  // },
  //
  // Order: {
  //   product: (order, _args, ctx) => ...,
  // },
};
