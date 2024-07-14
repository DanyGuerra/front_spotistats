export interface IResponseTopArtists {
  statusCode: number;
  message: string;
  data: Data;
}

export interface Data {
  items: TopArtistItem[];
  total: number;
  limit: number;
  offset: number;
  href: string;
  next: string;
  previous: string | null;
}

export interface TopArtistItem {
  external_urls: ExternalUrls;
  followers: Followers;
  genres: string[];
  href: string;
  id: string;
  images: Image[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
  rank_number: number;
}

export interface ExternalUrls {
  spotify: string;
}

export interface Followers {
  href: string | null;
  total: number;
}

export interface Image {
  height: number;
  url: string;
  width: number;
}
