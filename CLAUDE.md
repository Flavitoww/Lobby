# Lobby — projet

Lobby est un **atlas / dashboard esport** (référence gratuite, pro). Deux vues dans **un seul site** :
- `/` → **Accueil** « Bento clair » : match vedette, matchs triés, carte globe (clic = plongée vers l'Atlas).
- `/atlas` → **Globe 3D photoréaliste** : 1 pin/pays, logos en couronne au zoom, panneau pays/équipe/roster, recherche, filtres jeux.
- Charte : fond #f3f3f1, cartes blanches, accent orange #ff5a1f unique, Geist. La Terre est toujours entièrement éclairée (lumière qui suit la caméra) ; seul le fond change selon l'heure du visiteur.

Déployé sur **lobby-esport.vercel.app** (Vercel, team `spike2-3cd9`, projet `lobby-esport`).

## Structure
```
lobby.css         # Design system « Bento clair » (charte v2) — toutes les pages le chargent.
index.html        # Accueil : match vedette, listes triées (champ k), carte globe -> /atlas.
atlas/index.html  # Atlas : page (UI). atlas/atlas.js : données, pins, panneau, recherche.
atlas/globe.js    # Moteur 3D (three.js pur) : Soleil réel, nuages, atmosphère, étoiles. Partagé accueil + atlas.
assets/earth/     # Textures NASA en WebP (2K puis 4K).
api/live.js       # PandaScore : matchs + tri d'importance (k, imp, big).
api/orgs.js       # PandaScore : orgs + pays (cc).
api/team.js       # PandaScore : détails d'une équipe.
api/_config.js    # Config centrale : tiers de jeux, poids, orgs inactives, sources (lue par l'API et /gestion).
api/status.js     # État en direct (PandaScore, /api/live, /api/orgs, relais, version) pour /gestion.
api/gestion.js    # /gestion (rewrite) : portail par code puis tableau de bord (api/_gestion.html). Code = env ADMIN_CODE, session signée ADMIN_SECRET (api/_auth.js, api/auth.js).
api/track.js      # Audience maison (POST public, GET admin) : visiteurs en direct, pages, pays, recherches (en mémoire).
search.js         # Recherche globale tolérante aux fautes (accueil + Atlas).
api/lib.js        # Relais /lib/* : three.module, three.core, OrbitControls (importmap "three").
```
L'ancienne app globe (atlas/app.js, globe.gl) est SUPPRIMÉE : ne pas la réintroduire.

## Données
- Toutes les fonctions `api/` utilisent `process.env.PANDASCORE_TOKEN` (déjà configuré sur le projet Vercel).
- `/api/live` est un **superset** : le desk lit `matches`+`recent`, le globe lit `matches` (mêmes champs).

## Déploiement
- Dépôt Git : `Flavitoww/Lobby`. Pousser sur `main` déploie sur Vercel (projet `lobby-esport`, prod).
- Le déploiement auto sur push est cassé : redéployer à la main (Vercel, depuis main, target production).

## À faire ensuite
- Recette mobile, perf réelle, licence de la texture nuages, Mes équipes suivies.
