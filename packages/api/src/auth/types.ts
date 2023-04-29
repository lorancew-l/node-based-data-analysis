export type JwtPayload = { userId: string; iat: number; exp: number };

export type JwtPayloadWithRefreshToken = JwtPayload & { refresh_token: string };
