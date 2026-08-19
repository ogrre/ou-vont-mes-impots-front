# Mais où vont mes impôts ? — Frontend

Interface publique : <https://ou-vont-mes-impots.staging.vercel.betta.black>

API publique et gratuite :
<https://ou-vont-mes-impots.staging.dokploy.betta.black/docs/api>

Interface publique du projet éducatif open source « Mais où vont mes impôts ? ». Elle rend plus lisibles les recettes et les dépenses du budget de l’État français à partir de données officielles traçables.

Ce dépôt contient uniquement l’application frontend Vue. L’API Laravel est maintenue dans le dépôt séparé [`ou-vont-mes-impots-api`](https://github.com/ogrre/ou-vont-mes-impots-api).

## Prérequis

- Node.js 22.18 ou version 24.12 et ultérieure ;
- Bun 1.x ;
- l’API Laravel installée et alimentée avec les jeux de données documentés côté backend.

## Installation

```sh
bun install
cp .env.example .env
bun run dev
```

Par défaut, l’application interroge l’API Docker sur `http://localhost:8080`. La variable `VITE_API_BASE_URL` permet de modifier cette URL.

### Avec Docker

Lancez d’abord l’API depuis le dépôt voisin, puis le frontend :

```sh
cd ../ou-vont-mes-impots-api
docker compose -f docker-compose-dev.yml up -d

cd ../ou-vont-mes-impots-front
docker compose -f docker-compose-dev.yml up -d --build
```

Le site est ensuite accessible sur <http://localhost:5173> et l’API sur <http://localhost:8080>.
Le conteneur Nginx sert le build de production présent dans `dist` ; exécutez `bun run build` avant de reconstruire l’image après une modification du frontend.

## Déploiement sur Vercel

Le projet contient un fichier `vercel.json` pour le build Vite et la réécriture des routes de la SPA. Configurez la variable suivante dans les environnements Production, Preview et Development du projet Vercel :

```dotenv
VITE_API_BASE_URL=https://ou-vont-mes-impots.staging.betta.black
```

Cette valeur est intégrée au bundle lors du build : elle ne doit contenir aucun secret. Les déploiements de production doivent être déclenchés depuis la branche `main` une fois sa CI réussie.

Les branches de travail sont proposées par pull request vers `dev`. Cette
branche correspond au staging Vercel et utilise les variables Preview. La
production est déployée depuis `main`, uniquement après une pull request de
promotion `dev` vers `main`. Les pushes directs sont interdits sur ces deux
branches.

## Commandes

```sh
bun run type-check
bun run test:unit -- --run
bun run lint
bun run build
bun run test:e2e
```

## Périmètre actuel

- dépenses exécutées du budget de l’État en 2025, par mission, ministère ou nature, en AE ou CP ;
- recettes du budget de l’État selon les statuts comptables disponibles dans l’API ;
- affichage de la provenance des chiffres et des avertissements de périmètre.

Le site ne représente pas l’ensemble des dépenses publiques françaises. Il s’agit d’un projet indépendant, sans affiliation avec le Gouvernement français ou une administration publique.
