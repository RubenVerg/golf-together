/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment } from 'htm';

import { AppState } from '../types.d.ts';
import TopBar from '../components/top_bar.tsx';

export async function body(state: AppState) {
	return <>
		{await TopBar({ state })}
		<main>
			Login
			<form method='post'>
				<label for='username'>Username</label>
				<input type='text' name='username' required />
				<label for='password'>Password</label>
				<input type='password' name='password' required />
				<button type='submit'>Register</button>
			</form>
			or <a href='/login'>log in</a>
		</main>
	</>;
}

export function title() { return Promise.resolve('Login - Golf Together'); }
