/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment } from 'htm';

import { AppState } from '../types.d.ts';
import TopBar from '../components/top_bar.tsx';
import client from '../lib/prisma.ts';

export async function body(state: AppState, id: number) {
	const hole = await client.hole.findFirst({ where: { id }, include: { author: true } });
	if (hole === null) {
		throw new Error('Hole not found');
	}
	return <>
		{await TopBar({ state })}
		<main>
			<h1>{hole.name}</h1>
			<h2>by {hole.author.username}</h2>
			<p>{hole.description}</p>
		</main>
	</>;
}

export async function title(_state: AppState, id: number) {
	const hole = await client.hole.findFirst({ where: { id } });
	if (hole === null) {
		throw new Error('Hole not found');
	}
	return `${hole.name} - Golf Together`;
}