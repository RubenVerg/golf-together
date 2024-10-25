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
				<input type='text' name='username' />
				<label for='password'>Password</label>
				<input type='password' name='password' />
				<button type='submit'>Log in</button>
			</form>
			or <a href='/register'>register</a>
		</main>
	</>;
}

export const title = 'Login - Golf Together';
