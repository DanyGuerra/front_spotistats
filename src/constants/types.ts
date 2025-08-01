import { ILoadingSubject } from 'src/app/interfaces/ILoadingSubject';

export type TopInfoLimit =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31
  | 32
  | 33
  | 34
  | 35
  | 36
  | 37
  | 38
  | 39
  | 40
  | 41
  | 42
  | 43
  | 44
  | 45
  | 46
  | 47
  | 48
  | 49
  | 50;

export enum TopTimeRange {
  LongTerm = 'long_term', // 1 year data
  MediumTerm = 'medium_term', // approximately last 6 months
  ShortTerm = 'short_term', // approximately last 4 weeks
}

export type LayoutDataview = 'list' | 'grid';

export const defaultTopRange: TopTimeRange = TopTimeRange.ShortTerm;

export const defaultLayout: LayoutDataview = 'grid';

export const defaultCurrentlyPlayedItems: TopInfoLimit = 50;

export const initialTopItems: TopInfoLimit = 20;

export const itemsToShowSummary: TopInfoLimit = 5;

export const initialIsLoading: ILoadingSubject = {
  tracks: false,
  artists: false,
  recentlyPlayed: false,
};

export type Language = 'es' | 'en';

export const DefaultLanguage: Language = 'en';
