export type ScheduleSport = "MLB" | "NBA" | "NFL";

export type ScheduledGame = {
  id: string;
  sport: ScheduleSport;
  teamA: string;
  teamB: string;
  venue: string;
  location: string;
  latitude?: number;
  longitude?: number;
  startTime: string;
  status: string;
  source: string;
};

const venueCoordinates: Record<string, [number, number]> = {
  "Oriole Park at Camden Yards": [39.2839, -76.6217],
  "Yankee Stadium": [40.8296, -73.9262],
  "Fenway Park": [42.3467, -71.0972],
  "Dodger Stadium": [34.0739, -118.2400],
};

function dateKey(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("date must use YYYY-MM-DD");
  return date.replaceAll("-", "");
}

function coordinatesFor(venue: string) {
  return venueCoordinates[venue];
}

async function fetchJson(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`Schedule request failed (${response.status})`);
    return await response.json() as any;
  } finally {
    clearTimeout(timeout);
  }
}

async function mlbSchedule(date: string): Promise<ScheduledGame[]> {
  const payload = await fetchJson(`https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${date}&hydrate=venue,team`);
  const games = payload.dates?.flatMap((entry: any) => entry.games ?? []) ?? [];
  return games.map((game: any) => {
    const venue = game.venue?.name ?? game.teams?.home?.team?.venue?.name ?? "Venue unavailable";
    const [latitude, longitude] = coordinatesFor(venue) ?? [];
    return {
      id: `mlb-${game.gamePk}`,
      sport: "MLB" as const,
      teamA: game.teams.away.team.name,
      teamB: game.teams.home.team.name,
      venue,
      location: game.teams.home.team.locationName ? `${game.teams.home.team.locationName}, ${game.teams.home.team.parentOrgName ?? "USA"}` : venue,
      ...(latitude !== undefined ? { latitude, longitude } : {}),
      startTime: game.gameDate,
      status: game.status?.detailedState ?? "Scheduled",
      source: "MLB Stats API",
    };
  });
}

async function espnSchedule(sport: "NBA" | "NFL", date: string): Promise<ScheduledGame[]> {
  const path = sport === "NBA" ? "basketball/nba" : "football/nfl";
  const payload = await fetchJson(`https://site.api.espn.com/apis/site/v2/sports/${path}/scoreboard?dates=${dateKey(date)}`);
  return (payload.events ?? []).map((event: any) => {
    const competition = event.competitions?.[0];
    const competitors = competition?.competitors ?? [];
    const away = competitors.find((team: any) => team.homeAway === "away") ?? competitors[1];
    const home = competitors.find((team: any) => team.homeAway === "home") ?? competitors[0];
    const venue = competition?.venue?.fullName ?? "Venue unavailable";
    const city = competition?.venue?.address?.city;
    return {
      id: `${sport.toLowerCase()}-${event.id}`,
      sport,
      teamA: away?.team?.displayName ?? "Away team",
      teamB: home?.team?.displayName ?? "Home team",
      venue,
      location: city ? `${city}, ${competition?.venue?.address?.state ?? "USA"}` : venue,
      startTime: event.date,
      status: event.status?.type?.shortDetail ?? "Scheduled",
      source: "ESPN schedule feed",
    };
  });
}

export async function listScheduledGames(date: string, sport: ScheduleSport | "ALL" = "ALL") {
  const sports: ScheduleSport[] = sport === "ALL" ? ["MLB", "NBA", "NFL"] : [sport];
  const results = await Promise.allSettled(sports.map((item) => item === "MLB" ? mlbSchedule(date) : espnSchedule(item, date)));
  return results.flatMap((result) => result.status === "fulfilled" ? result.value : []).sort((a, b) => a.startTime.localeCompare(b.startTime));
}
