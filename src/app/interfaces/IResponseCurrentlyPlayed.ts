import { Track } from './IResponseTopTracks';

export interface IResponseCurrentlyPlayed {
  statusCode: number;
  message: string;
  data: Data;
}

export interface Data {
  items: TrackPlayed[];
  next: string;
  cursors: Cursors;
  limit: number;
  href: string;
}

export interface TrackPlayed {
  track: Track;
  played_at: string;
  context: any;
}

export interface Album {
  album_type: string;
  artists: Artist[];
  available_markets: string[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
}

export interface Artist {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface ExternalUrls {
  spotify: string;
}

export interface Image {
  height: number;
  url: string;
  width: number;
}

export interface ExternalIds {
  isrc: string;
}

export interface Cursors {
  after: string;
  before: string;
}
