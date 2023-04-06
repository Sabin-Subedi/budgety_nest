import { Request as ExpReq } from 'express';

export type Request = ExpReq & {
  user?: JwtSignedUser;
};

export interface JwtSignedUser {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}
