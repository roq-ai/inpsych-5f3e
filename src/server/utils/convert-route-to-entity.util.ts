const mapping: Record<string, string> = {
  accounts: 'account',
  games: 'game',
  messages: 'message',
  playlists: 'playlist',
  sessions: 'session',
  tips: 'tip',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
