# TP GraphQL — « Mes commandes » en une seule requête

L'énoncé complet est dans le PDF distribué en cours. Ici, juste l'essentiel.

## Démarrer

Prérequis : **Node.js 22 ou plus** (`node -v`). Sinon : https://nodejs.org (version LTS).

```bash
npm install
npm run dev        # serveur sur http://localhost:4000 → ouvrez-le dans le navigateur (Apollo Sandbox)
```

Dans un **deuxième** terminal :

```bash
npm test           # tous les tests (rouge au début : normal)
npm run test:1     # étape 1 seulement (puis test:2, test:3, test:4, test:bonus)
```

## Les fichiers à modifier

| Étape | Fichier |
|---|---|
| 1. Schéma | `src/schema.graphql` |
| 2. Resolvers | `src/resolvers.js` |
| 3. N+1 / DataLoader | `src/loaders.js` + `src/resolvers.js` |
| 4. Fragments et directives | `queries/etape4.graphql` |

Ne touchez pas à `db.js`, `server.js`, `index.js`, `schema.js` ni à `tests/`.

## Problèmes fréquents

- **`'node' n'est pas reconnu`** : rouvrez le terminal après l'installation de Node.
- **PowerShell : `l'exécution de scripts est désactivée`** : utilisez `npm.cmd` au lieu de `npm`,
  ou `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.
- **`EADDRINUSE ... 4000`** : PowerShell `$env:PORT=4001; npm run dev` — Bash `PORT=4001 npm run dev`.
- **`npm warn EBADENGINE`** : simple avertissement, ignorez-le.
