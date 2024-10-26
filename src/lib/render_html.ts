import render from 'htm';

import type { AppState } from '../types.d.ts';

export interface HtmlPage<Args extends unknown[] = []> {
	body(state: AppState, ...args: Args): Promise<JSX.Element>;
	title(state: AppState, ...args: Args): Promise<string>;
}

export async function renderHtml<Args extends unknown[]>(state: AppState, page: HtmlPage<Args>, ...args: Args) {
	return render({
		title: await page.title(state, ...args),
		body: await page.body(state, ...args),
	});
}