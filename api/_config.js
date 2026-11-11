// LOBBY — configuration centrale (une seule source de vérité, lue par l'API et par la page /gestion).
module.exports = {
  // Tiers de jeux choisis par Flavien (11/11/2026). T3 est exclu du site.
  TIERS: {
    T1: ['lol', 'cs2', 'val', 'rl'],
    T2: ['r6', 'dota', 'ow', 'cod', 'fc'],
    T3: ['mlbb', 'hok', 'sc', 'aoe']
  },
  GAME_NAMES: { lol: 'League of Legends', cs2: 'Counter-Strike 2', val: 'Valorant', rl: 'Rocket League', r6: 'Rainbow Six Siege', dota: 'Dota 2', ow: 'Overwatch 2', cod: 'Call of Duty', fc: 'EA FC', mlbb: 'Mobile Legends', hok: 'Honor of Kings', sc: 'StarCraft', aoe: 'Age of Empires' },
  // Poids d'un jeu dans l'importance d'un match (T1 = 20).
  GAME_WEIGHT: { lol: 20, cs2: 20, val: 20, rl: 20, r6: 10, dota: 8, ow: 8, cod: 8, fc: 6 },
  // Orgs signalées inactives / dissoutes (liste manuelle, à compléter).
  RETIRED: ['Ici Japon Corp'],
  // Une org n'est gardée que si elle a joué un tournoi depuis moins de X jours.
  RECENT_DAYS: 200,
  // Événements suivis à la main quand PandaScore ne les couvre pas. Aucune heure ni score inventés : seulement ce que dit la source.
  EVENTS: [
    { id: 'cdf-slash-rl-2026', game: 'rl', name: 'Coupe de France Slash', stage: 'Demi-finales + finale',
      day: '2026-11-12', from: '2026-11-02', until: '2026-11-13',
      teams: ['Vitality', 'Geekay', 'Karmine Corp', 'Gentle Mates', 'Ikkaku', 'Dumornay Goat'],
      watch: 'https://www.twitch.tv/slash_ftv',
      source: 'https://www.francetvpro.fr/contenu-de-presse/79193261' }
  ],
  // Sources de données (connectées ou prévues), affichées sur /gestion.
  SOURCES: [
    { id: 'pandascore', name: 'PandaScore', role: 'Matchs, équipes, joueurs, logos', status: 'connected' },
    { id: 'liquipedia', name: 'Liquipedia', role: 'Transferts, dissolutions (fiable)', status: 'planned' },
    { id: 'dexerto', name: 'Dexerto (RSS)', role: 'Gros titres actus', status: 'planned' },
    { id: 'sheep', name: 'Sheep Esports', role: 'Leaks / rumeurs (si accès officiel)', status: 'planned' }
  ]
};
