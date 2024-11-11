import render from 'htm';

import type { AppState } from '../types.d.ts';

export type Style = string | {
	href?: string;
	text?: string;
	id?: string;
}

export type Script = string | {
	src?: string;
	text?: string;
	type?: string;
	id?: string;
	async?: boolean;
	defer?: boolean;
};

export interface HtmlPage<Args extends unknown[] = []> {
	body(state: AppState, ...args: Args): Promise<JSX.Element>;
	title(state: AppState, ...args: Args): Promise<string>;
	meta?: (state: AppState, ...args: Args) => Promise<Record<string, string>>;
	styles?: (state: AppState, ...args: Args) => Promise<Style[]>;
	scripts?: (state: AppState, ...args: Args) => Promise<Script[]>;
}

export async function renderHtml<Args extends unknown[]>(state: AppState, page: HtmlPage<Args>, ...args: Args) {
	return render({
		title: await page.title(state, ...args),
		body: await page.body(state, ...args),
		lang: 'en',
		styles: [
			{ href: '/static/style.css' },
			...(page.styles ? await page.styles(state, ...args) : []),
		],
		...page.scripts && { scripts: await page.scripts(state, ...args) },
		...page.meta && { meta: await page.meta(state, ...args) },
	});
}