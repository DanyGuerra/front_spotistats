export interface IResponseUserInfo {
  statusCode: number;
  message: string;
  data: Data;
}

export interface Data {
  display_name: string;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  type: string;
  uri: string;
  followers: Followers;
  country: string;
  product: 'premium' | 'free';
  explicit_content: ExplicitContent;
  email: string;
}

export interface ExternalUrls {
  spotify: string;
}

export interface Image {
  url: string;
  height: number;
  width: number;
}

export interface Followers {
  href: any;
  total: number;
}

export interface ExplicitContent {
  filter_enabled: boolean;
  filter_locked: boolean;
}
