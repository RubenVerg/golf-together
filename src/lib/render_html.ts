import render from 'htm';

import type { AppState } from '../types.d.ts';

export interface HtmlPage {
	body(state: AppState): Promise<JSX.Element>;
	title: string;
}

export async function renderHtml(state: AppState, page: HtmlPage) {
	return render({
		title: page.title,
		body: await page.body(state),
	});
}