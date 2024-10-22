import { encode as jwtEncode } from '@gz/jwt';

import { User } from './prisma.ts';
import { JwtPayload } from '../types.d.ts';
import { keyString } from './api_key.ts';

export async function generateToken(user: User) {
	const payload: JwtPayload = { iat: Math.round(Date.now() / 1000), exp: Math.round(Date.now() / 1000 + 60 * 60), id: user.id, username: user.username };
	return await jwtEncode(payload, keyString, { algorithm: 'HS512' });
}


