/** @jsx h */
import { h } from 'htm';

import { AppState } from '../types.d.ts';
import client from '../lib/prisma.ts';

export interface TopBarProps {
	state: AppState;
}

export default async function TopBar({ state }: TopBarProps) {
	return <header>
		{state.user !== undefined ? `Logged in as ${(await client.user.findFirstOrThrow({ where: { id: state.user } })).username}` : 'Not logged in'}
	</header>;
}