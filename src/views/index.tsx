/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment } from 'htm';

import { AppState } from '../types.d.ts';
import TopBar from '../components/top_bar.tsx';

export async function body(state: AppState) {
	return <>
		{await TopBar({ state })}
		<main>
			Welcome to Golf Together!
		</main>
	</>;
}

export const title = 'Golf Together';
