/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment } from 'htm';

import { AppState } from '../types.d.ts';
import TopBar from '../components/top_bar.tsx';
import client from '../lib/prisma.ts';
import { Script, Style } from '../lib/render_html.ts';

export async function body(state: AppState, id: number) {
	const room = await client.chatRoom.findFirst({ where: { id } });
	if (room === null) {
		throw new Error('Room not found');
	}
	return <>
		{await TopBar({ state })}
		<main>
			<h1 class='user-content'>{room.name}</h1>
			<details>
				<summary>New message</summary>
				<form>
					<label for='text'>Text</label>
					<textarea name='text' id='message-text'></textarea>
					<button type='submit' id='send-message'>Send</button>
				</form>
			</details>
			<div id='messages'></div>
		</main>

		<template id='message-template'>
			<div class='message'>
				<div class='message-content'></div>
				<span class='message-timestamp'></span>
				<span class='message-author'></span>
			</div>
		</template>
	</>;
}

export async function title(_state: AppState, id: number) {
	const room = await client.chatRoom.findFirst({ where: { id } });
	if (room === null) {
		throw new Error('Room not found');
	}
	return `${room.name} - Chat - Golf Together`;
}

export function meta(_state: AppState, id: number) {
	return Promise.resolve({
		'golf-together-chat-id': id.toString(),
	});
}

export function styles(_state: AppState, _id: number) {
	return Promise.resolve([{
		href: '/static/chat.css',
	} as Style]);
}

export function scripts(_state: AppState, _id: number) {
	return Promise.resolve([{
		type: 'module',
		src: '/static/chat.js',
	} as Script]);
}
