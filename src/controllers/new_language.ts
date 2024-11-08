import { Middleware } from '@oak/oak';

import client from '../lib/prisma.ts'
import { AppState } from '../types.d.ts';

export default (async function newLanguage({ request, response }) {
	const form = await request.body.form();
	const name = form.get('name')!;
	if (name.trim() === '') {
		response.status = 400;
		response.body = { message: 'Invalid name' };
		return;
	}
	const link_ = form.get('link');
	const link = !link_?.trim() ? undefined : link_;
	const encodingLink_ = form.get('encodingLink');
	const encodingLink = !encodingLink_?.trim() ? undefined : encodingLink_;
	await client.language.create({
		data: {
			name,
			link,
			encodingLink,
		}
	});
	response.redirect('/');
}) as Middleware<AppState>;