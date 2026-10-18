# Correction du TP GraphQL

Ce dossier contient le corrigé complet (étapes 1 à 4 et bonus). Pour le vérifier :

```bash
cd correction
npm install
npm test          # 25 tests, tous verts
```

## Réponses aux questions flash

### Q1 — `user(id)` : avec ou sans `!` ?

Pour `user(id: "999")`, le serveur renvoie `null` : aucun utilisateur n'a cet id.

Le type de retour doit donc être `User`, **sans** `!`. Avec `User!`, le `null` ne serait pas accepté :
GraphQL remonte alors l'erreur jusqu'au parent, et la réponse `data` entière vaut `null`.

### Q2 — Combien de requêtes en base ?

Pour `{ user(id: "42") { name orders { product { name } } } }` (Inès a 3 commandes) :

- **Sans DataLoader : 5 requêtes.**
  1 (`userById`) + 1 (`ordersByUserId`) + 3 (un `productById` par commande).
- **Avec DataLoader : 3 requêtes.**
  1 (`userById`) + 1 (`ordersByUserId`) + 1 seule (`productsByIds`, pour les 3 produits d'un coup).

Le terminal du serveur affiche ces chiffres (`◀ n requêtes en base`).

### Q3 — À quoi sert vraiment un fragment ?

On veut afficher aussi l'`id` de chaque produit.

- **Avec le fragment `InfosProduit` : 1 seul endroit à modifier**, la définition du fragment.
  Les deux utilisations (`...InfosProduit`) prennent alors automatiquement le nouveau champ.
- **Sans fragment : 2 endroits**, les produits des commandes et le catalogue.
  On risque toujours d'oublier l'un des deux, et les deux affichages finissent par diverger.
