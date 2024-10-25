/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment } from 'htm';

import { AppState } from '../types.d.ts';
import client from '../lib/prisma.ts';

export interface TopBarProps {
	state: AppState;
}

export default async function TopBar({ state }: TopBarProps) {
	return <header style='height: 2rem; border-block-end: 1px solid black;'>
		<span style='float: left;'>
			<a href='/'>Golf Together</a>
		</span>
		<span style='float: right;'>{
			state.user !== undefined ? <>
				{(await client.user.findFirstOrThrow({ where: { id: state.user } })).username}
				<form style='display: inline-block;' method='POST' action='/logout'><input type='hidden' /><a href='/logout' onclick='event.preventDefault(); this.parentNode.submit();'>Log out</a></form>
			</> : <>
				<a href='/login'>Log in</a>/<a href='/register'>Register</a>
			</>}</span>
	</header>;
}