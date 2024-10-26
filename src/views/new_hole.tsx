/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment } from 'htm';

import { AppState } from '../types.d.ts';
import TopBar from '../components/top_bar.tsx';

export async function body(state: AppState) {
	return <>
		{await TopBar({ state })}
		<main>
			<h1>New Hole</h1>

			<form method='post'>
				<label for='name'>Name</label>
				<input type='text' name='name' required />
				<label for='description'>Description</label>
				<textarea name='description' required></textarea>
				<button type='submit'>Create</button>
			</form>
		</main>
	</>;
}

export function title() { return Promise.resolve('New Hole - Golf Together'); }