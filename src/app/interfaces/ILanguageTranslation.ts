export interface ILanguageTranslation {
  LANGUAGE: string;
  LANGUAGES: LanguagesTranslation;
  ACTUAL_LANGUAGE: string;
  STATS: StatsTranslation;
  USER: UserTranslation;
  BUTTONS: ButtonsTranslation;
  SERVER_MESSAGES: ServerMessagesTranslation;
  TIME_RANGE: TimeRangeTranslation;
  HOME: HomeTranslations;
  FOOTER: FooterTranslation;
  CAROUSEL: CarouselTranslation;
  TOAST: ToastTranslation;
}

export interface LanguagesTranslation {
  EN: string;
  ES: string;
}

export interface StatsTranslation {
  MY_STATS: string;
  ARTISTS: string;
  TRACKS: string;
  TOP_ARTISTS: string;
  TOP_ARTISTS_DESCRIPTION: string;
  TOP_TRACKS: string;
  TOP_TRACKS_DESCRIPTION: string;
  TOP_ARTIST: string;
  TOP_TRACK: string;
  RECENTLY_PLAYED: string;
  MY_TOP_ARTIST: string;
  MY_TOP_TRACK: string;
  MY_RECENTLY_PLAYED: string;
  RECENTLY_PLAYED_DESCRIPTION: string;
}

export interface UserTranslation {
  PROFILE: string;
  MY_PROFILE: string;
  LOGOUT: string;
  LOGIN: string;
  FOLLOWERS: string;
}

export interface ButtonsTranslation {
  GO_BACK: string;
  SHOW_ALL: string;
  LOGIN: string;
  GO_HOME: string;
  RETRY_LOGIN: string;
  VIEW_STATS: string;
  STATS_BY_RANGE: string;
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

export interface HomeTranslations {
  HEADER: string;
  TIMELINE_SECTION: {
    TITLE: string;
    TIME_RANGE: TimeRangeTranslation;
  };
}

export interface FooterTranslation {
  MADE_BY: string;
}

export interface CarouselTranslation {
  STATS: string[];
  YOUR: string[];
}

export interface ToastTranslation {
  ERROR: {
    TITLE: string;
    DESCRIPTION: string;
  };
}
