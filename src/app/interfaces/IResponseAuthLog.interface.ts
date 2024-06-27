export interface IResponseAuthLog {
  statusCode: number;
  message: string;
  data: Data;
}

export interface Data {
  _id: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  accessToken: string;
  displayName: string;
  refreshToken: string;
  usernameId: string;
}
