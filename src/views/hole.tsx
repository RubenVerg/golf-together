/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment } from 'htm';

import { AppState } from '../types.d.ts';
import TopBar from '../components/top_bar.tsx';
import client from '../lib/prisma.ts';

export async function body(state: AppState, id: number) {
	const hole = await client.hole.findFirst({ where: { id }, include: { author: true, approaches: { include: { solutions: { include: { improvements: true } } } } } });
	if (hole === null) {
		throw new Error('Hole not found');
	}
	return <>
		{await TopBar({ state })}
		<main>
			<h1 class='user-content'>{hole.name} <span style='font-size: 1rem;'>by {hole.author.username}</span></h1>
			<p class='user-content'>{hole.description}</p>
			<details>
				<summary>New approach</summary>
				<form method='POST' action={`/hole/${hole.id}/approach/new`}>
					<label for='name'>Name</label>
					<input type='text' name='name' required />
					<label for='description'>Description</label>
					<textarea name='description'></textarea>
					<button type='submit'>Create</button>
				</form>
			</details>
			{await Promise.all(hole.approaches.map(async approach => <>
				<h2 id={`approach-${approach.id}`} class='user-content'>{approach.name}</h2>
				<p class='user-content'>{approach.description}</p>
				<details>
					<summary>New solution</summary>
					<form method='POST' action={`/hole/${hole.id}/approach/${approach.id}/new`}>
						<label for='language'>Language</label>
						<input type='text' name='language' required />
						<label for='size'>Size</label>
						<input type='number' name='size' required></input>
						<select name='unit'>
							<option value='bytes' selected>bytes</option>
							<option value='bits'>bits</option>
						</select>
						<label for='code'>Code</label>
						<textarea name='code' required></textarea>
						<button type='submit'>Create</button>
					</form>
				</details>
				{await Promise.all(approach.solutions.toSorted((a, b) => a.bits - b.bits).map(async solution => {
					const language = await client.language.findFirst({ where: { name: solution.language } });
					return <>
						<h3 id={`solution-${solution.id}`} class='user-content'>{language && language.link ? <a href={language.link}>{language.name}</a> : solution.language}, {solution.bits / 8} bytes {solution.bits % 8 !== 0 && `(${solution.bits} bits)`}{language && language.encodingLink ? <a href={language.encodingLink}>*</a> : undefined}</h3>
						<pre><code>{solution.improvements.at(-1)!.newCode}</code></pre>
						<details>
							<summary>Improve this solution!</summary>
							<form method='POST' action={`/hole/${hole.id}/solution/${solution.id}/improve`}>
								<select name='subtract'>
									<option value='subtract' selected>Improve by</option>
									<option value='set'>Improve to</option>
								</select>
								<input type='number' name='size' required />
								<select name='unit'>
									<option value='bytes' selected={solution.bits % 8 === 0}>bytes</option>
									<option value='bits' selected={solution.bits % 8 !== 0}>bits</option>
								</select>
								<label for='code'>Code</label>
								<textarea name='code' required></textarea>
								<button type='submit'>Improve</button>
							</form>
						</details>
					</>;
				}))}
			</>))}
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