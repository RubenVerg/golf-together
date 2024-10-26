/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment } from 'htm';

import { AppState } from '../types.d.ts';
import TopBar from '../components/top_bar.tsx';
import client from '../lib/prisma.ts';

export async function body(state: AppState) {
	return <>
		{await TopBar({ state })}
		<main>
			<h1>Welcome to Golf Together!</h1>

			<div>
				<h2>Holes</h2>
				<a href='/hole/new'>Create a new hole</a>
				<ul>
					{(await client.hole.findMany({ include: { author: true } })).map(hole => <li>
						<strong class='user-content' style='display: inline-block;'><a href={`/hole/${hole.id}`}>{hole.name}</a></strong> by {hole.author.username} / <time datetime={hole.updatedAt.toISOString()}>{new Intl.DateTimeFormat('en-GB').format(hole.updatedAt)}</time>
					</li>)}
				</ul>
			</div>
		</main>
	</>;
}

export function title() { return Promise.resolve('Golf Together'); }
