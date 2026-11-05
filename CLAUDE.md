# Lobby — projet

Lobby est un **atlas / dashboard esport** (référence gratuite, pro). Deux vues dans **un seul site** :
- `/` → **Desk** : tableau de bord dense (bandeau live, matchs à venir/résultats, match vedette, explorer). DA orange.
- `/atlas` → **Globe 3D** mondial de la scène esport (pins par pays/équipe, clusters, panneau latéral). DA rouge.

Déployé sur **lobby-esport.vercel.app** (Vercel, team `spike2-3cd9`, projet `lobby-esport`).

## Structure
```
index.html        # Desk (accueil). Bouton/nav "Atlas" -> /atlas. CSS+JS inline. Données via /api/live (+ repli snapshot).
atlas/index.html  # Globe (front). CSS inline. Charge /atlas/app.js.
atlas/app.js      # Globe (globe.gl + three). Appelle /api/live, /api/orgs, /api/team, /lib/*, /jerseys.json.
api/live.js       # PandaScore : matchs running/upcoming/past -> {updated, matches, recent}. Partagé desk + globe.
api/orgs.js       # PandaScore : équipes actives par jeu + pays (pins du globe).
api/team.js       # PandaScore : détails d'une équipe (?n=NOM).
api/lib.js        # Proxy : sert three/globe.gl/earth-night.jpg depuis le CDN jsdelivr (via /lib/:file).
vercel.json       # cleanUrls, functions maxDuration 60, rewrite /lib/:file -> /api/lib?file=:file
```

## Données
- Toutes les fonctions `api/` utilisent `process.env.PANDASCORE_TOKEN` (déjà configuré sur le projet Vercel).
- `/api/live` est un **superset** : le desk lit `matches`+`recent`, le globe lit `matches` (mêmes champs).

## Déploiement
- Dépôt Git : `Flavitoww/Lobby`. Pousser sur `main` déploie sur Vercel (projet `lobby-esport`, prod).
- L'ancien globe seul reste figé à `lobby-esport-14ouw13ax-spike2-3cd9.vercel.app` (référence).

## À faire ensuite
- **Unifier la DA** desk (orange #ff5a1f, Schibsted Grotesk) et globe (rouge #ff3b3b, Barlow Condensed) : choisir UNE identité (voir charte.md).
- Transition soignée desk <-> atlas (cohérente avec l'intro de marque du desk).
- Fiches réelles cliquables (équipe / joueur / compétition / business), transferts & news de premier plan.
- `/jerseys.json` : optionnel (maillots), actuellement 404 géré proprement.
