export interface ILanguageTranslation {
  LANGUAGE: string;
  LANGUAGES: LanguagesTranslation;
  ACTUAL_LANGUAGE: string;
  STATS: StatsTranslation;
  USER: UserTranslation;
  BUTTONS: ButtonsTranslation;
  SERVER_MESSAGES: ServerMessagesTranslation;
  TIME_RANGE: TimeRangeTranslation;
}

export interface StatsTranslation {
  MY_STATS: string;
  ARTISTS: string;
  TRACKS: string;
  TOP_ARTISTS: string;
  TOP_TRACKS: string;
  TOP_ARTIST: string;
  TOP_TRACK: string;
  RECENTLY_PLAYED: string;
}

export interface UserTranslation {
  PROFILE: string;
  MY_PROFILE: string;
  LOGOUT: string;
  FOLLOWERS: string;
}

export interface ButtonsTranslation {
  GO_BACK: string;
  MY_PROFILE: string;
  SHOW_ALL: string;
  LOGIN: string;
  GO_HOME: string;
  RETRY_LOGIN: string;
}

export interface ServerMessagesTranslation {
  BAD_REQUEST: string;
  ACCESS_DENIED: string;
  SORRY: string;
  PAGE_NOT_FOUND: string;
}

export interface TimeRangeTranslation {
  SHORT_TERM: string;
  MEDIUM_TERM: string;
  LONG_TERM: string;
}
export interface LanguagesTranslation {
  EN: string;
  ES: string;
}
