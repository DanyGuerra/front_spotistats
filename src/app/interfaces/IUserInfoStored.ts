export interface IUserInfoStored {
  logId: string;
  userId: string;
  displayName: string;
  email: string;
  profileImage: ProfileImageItem[] | null;
  followers: FollowersItem;
  product: 'free' | 'premium';
}

export interface ProfileImageItem {
  height: number;
  url: string;
  width: number;
}

export interface FollowersItem {
  href: string | null;
  total: number;
}
