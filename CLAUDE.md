# Lobby — projet

Lobby est un **atlas / dashboard esport** (référence gratuite, pro). Deux vues dans **un seul site** :
- `/` → **Desk** : tableau de bord dense (bandeau live, matchs à venir/résultats, match vedette, explorer). DA orange.
- `/atlas` → **Globe 3D** mondial de la scène esport (pins par pays/équipe, clusters, panneau latéral). DA rouge.

Déployé sur **lobby-esport.vercel.app** (Vercel, team `spike2-3cd9`, projet `lobby-esport`).

## Structure
```
lobby.css         # Design system « Bento clair » (charte v2) — toutes les pages le chargent.
index.html        # Accueil : match vedette, listes triées (champ k), carte globe -> /atlas.
atlas/index.html  # Atlas : nouveau globe photoréaliste + panneau (données en phase 4).
atlas/globe.js    # Moteur 3D (three.js pur) : Soleil réel, nuages, atmosphère, étoiles. Partagé accueil + atlas.
assets/earth/     # Textures NASA en WebP (2K puis 4K).
api/live.js       # PandaScore : matchs + tri d'importance (k, imp, big).
api/orgs.js       # PandaScore : orgs + pays (cc).
api/team.js       # PandaScore : détails d'une équipe.
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
- Atlas phase 3-6 : UI, données sur le globe (1 pin/pays, logos en couronne au zoom), transition accueil → Atlas, recette.
