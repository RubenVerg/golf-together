/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment } from 'htm';

import { AppState } from '../types.d.ts';
import TopBar from '../components/top_bar.tsx';
import client from '../lib/prisma.ts';
import { leaderboard } from '../lib/points.ts';

export async function body(state: AppState) {
	return <>
		{await TopBar({ state })}
		<main>
			<h1>Welcome to Golf Together!</h1>

			<div>
				<h2>Leaderboard</h2>
				<table>
					<thead>
						<tr>
							<th>User</th>
							<th>Points</th>
						</tr>
					</thead>
					<tbody>
						{await Promise.all((await leaderboard()).map(async ([id, points]) => {
							if (points === 0) return;
							const user = await client.user.findFirst({ where: { id } });
							if (!user) return;
							return <tr>
								<th>{user.username}</th>
								<td>{points}</td>
							</tr>;
						}))}
					</tbody>
				</table>
			</div>

			<div>
				<h2>Holes</h2>
				<a href='/hole/new'>Create a new hole</a>
				<ul>
					{(await client.hole.findMany({ include: { author: true } })).map(hole => <li>
						<strong class='user-content' style='display: inline-block;'><a href={`/hole/${hole.id}`}>{hole.name}</a></strong> by {hole.author.username} / <time datetime={hole.updatedAt.toISOString()}>{new Intl.DateTimeFormat('en-GB').format(hole.updatedAt)}</time>
					</li>)}
				</ul>
			</div>

			<div>
				<h2>Languages</h2>
				<ul>
					{(await client.language.findMany({ include: { solutions: true } })).toSorted((a, b) => b.solutions.length - a.solutions.length).map(lang => <li>
						{lang.name}: {lang.solutions.length} solutions
					</li>)}
				</ul>
				<details>
					<summary>New language</summary>
					<form method='POST' action='/language/new'>
						<label for='name'>Name</label>
						<input type='text' name='name' required />
						<label for='link'>Link (optional)</label>
						<input type='url' name='link' />
						<label for='encodingLink'>Encoding link (optional)</label>
						<input type='url' name='encodingLink' />
						<button type='submit'>Create</button>
					</form>
				</details>
			</div>
		</main>
	</>;
}

export function title() { return Promise.resolve('Golf Together'); }
