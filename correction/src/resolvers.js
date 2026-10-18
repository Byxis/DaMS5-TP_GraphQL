// =============================================================================
//  resolvers.js — CORRIGÉ (étapes 2, 3 + bonus A et B).
//
//  Rappel : (parent, args, ctx)
//    parent : l'objet du niveau au-dessus
//    args   : les arguments du champ
//    ctx    : le contexte de la requête (ctx.db, ctx.loaders, ctx.currentUserId)
// =============================================================================
import { GraphQLError } from 'graphql';

export const resolvers = {
  Query: {
    products: (_parent, _args, ctx) => ctx.db.allProducts(),

    // args.id vient de user(id: "42"). Si db renvoie null, GraphQL renvoie null
    // (autorisé car le type de retour est User, sans !).
    user: (_parent, args, ctx) => ctx.db.userById(args.id),

    orders: (_parent, _args, ctx) => ctx.db.allOrders(),

    // BONUS B : on LÈVE une erreur au lieu de renvoyer null. Résultat :
    //   { data: { order: null }, errors: [{ message, path: ["order"], ... }] }
    order: async (_parent, args, ctx) => {
      const order = await ctx.db.orderById(args.id);
      if (!order) {
        throw new GraphQLError('Commande introuvable', {
          extensions: { code: 'NOT_FOUND' },
        });
      }
      return order;
    },
  },

  // Pas besoin de resolver pour User.id ou User.name : la ligne renvoyée par
  // db.userById les contient déjà, GraphQL les lit tout seul (resolver par défaut).
  User: {
    // user = le parent, la ligne renvoyée par Query.user
    orders: (user, _args, ctx) => ctx.db.ordersByUserId(user.id),
  },

  Order: {
    // ÉTAPE 2 (version naïve, N+1) :
    //   product: (order, _args, ctx) => ctx.db.productById(order.productId),
    //
    // ÉTAPE 3 : même signature, mais on passe par le DataLoader. Pour 10
    // commandes, les 10 appels à .load() sont regroupés en UNE requête.
    product: (order, _args, ctx) => ctx.loaders.product.load(order.productId),
  },

  // BONUS A
  Mutation: {
    createOrder: async (_parent, { input }, ctx) => {
      const { productId, quantity } = input;

      // Refus métier : PRÉVUS et typés dans le schéma. Ce ne sont pas des
      // "errors" GraphQL : la requête s'est bien exécutée.
      if (quantity <= 0) {
        return { order: null, userErrors: [{ message: 'La quantité doit être positive', field: 'quantity' }] };
      }
      const product = await ctx.loaders.product.load(productId);
      if (!product) {
        return { order: null, userErrors: [{ message: 'Produit inconnu', field: 'productId' }] };
      }
      if (product.stock < quantity) {
        return { order: null, userErrors: [{ message: 'Stock épuisé', field: 'quantity' }] };
      }

      // L'utilisateur vient du contexte (l'authentification), JAMAIS de l'input :
      // sinon n'importe qui pourrait commander au nom de n'importe qui.
      const order = await ctx.db.insertOrder({ userId: ctx.currentUserId, productId, quantity });
      return { order, userErrors: [] };
    },
  },
};
