import { RouterMiddleware } from '@oak/oak';
import { JsonValue } from 'type-fest';

import client, { ChatRoom, ChatMessage, User } from '../../lib/prisma.ts';
import { AppState } from '../../types.d.ts';

type ClientId = `${number}:${number}`;

interface Message<N extends string, T extends JsonValue> {
	event: N;
	data: T;
}

type MessageConnectedUsers = Message<'connectedUsers', Record<number, { id: number, username: string }>>;
type MessageOldMessages = Message<'oldMessages', { id: number, author: number, text: string, createdAt: number }[]>;
type MessageReceiveMessage = Message<'receiveMessage', { id: number, author: number, text: string, createdAt: number }>;

type MessageHasConnected = Message<'hasConnected', null>;
type MessageSendMessage = Message<'sendMessage', string>;

type ReceivedMessage = MessageHasConnected | MessageSendMessage;

export class ChatClient {
	static readonly connectedClients = new Map<ClientId, ChatClient>();
	
	static async broadcast(f: (client: ChatClient) => Promise<void>) {
		for (const client of ChatClient.connectedClients.values())
			await f(client);
	}

	public readonly id: ClientId;
	private readonly connectedPromise: Promise<void>;
	
	constructor(public readonly ws: WebSocket, public readonly user: User, public readonly room: ChatRoom) {
		ws.onmessage = this.onMessage.bind(this);
		ws.onclose = this.onClose.bind(this);
		this.id = `${user.id}:${room.id}`;
		ChatClient.connectedClients.set(this.id, this);
		this.connectedPromise = new Promise<void>(resolve => {
			if (ws.readyState == ws.OPEN) resolve();
			else ws.addEventListener('open', () => resolve(), { once: true });
		});
		this.shareHasConnected();
	}

	async shareHasConnected() {
		await this.connectedPromise;
		this.ws.send(JSON.stringify({ event: 'hasConnected', data: null } as MessageHasConnected));
	}

	async shareOldMessages() {
		await this.connectedPromise;
		const messages = await client.chatMessage.findMany({ where: { roomId: this.room.id }, orderBy: { createdAt: 'desc' }, take: 100 });
		this.ws.send(JSON.stringify({ event: 'oldMessages', data: messages.map(m => ({ id: m.id, author: m.authorId, text: m.text, createdAt: m.createdAt.valueOf() })) } as MessageOldMessages));
	}

	async shareConnectedUsers() {
		await this.connectedPromise;
		this.ws.send(JSON.stringify({ event: 'connectedUsers', data: Object.fromEntries(ChatClient.connectedClients.values().map(({ user }) => [user.id, { id: user.id, username: user.username }])) } as MessageConnectedUsers));
	}

	async shareMessage(message: ChatMessage) {
		await this.connectedPromise;
		this.ws.send(JSON.stringify({ event: 'receiveMessage', data: { id: message.id, author: message.authorId, text: message.text, createdAt: message.createdAt.valueOf() } } as MessageReceiveMessage));
	}

	async whenConnected() {
		await this.connectedPromise;
		await this.shareConnectedUsers();
		await this.shareOldMessages();
	}

	onClose() {
		ChatClient.connectedClients.delete(this.id);
		ChatClient.broadcast(c => c.shareConnectedUsers());
	}

	async onMessage(message: MessageEvent<string>) {
		const { event, data } = JSON.parse(message.data) as ReceivedMessage;
		switch (event) {
			case 'hasConnected': {
				await this.whenConnected();
				break;
			}
			case 'sendMessage': {
				const message = await client.chatMessage.create({ data: { roomId: this.room.id, authorId: this.user.id, text: data } });
				await ChatClient.broadcast(c => c.shareMessage(message));
				break;
			}
			default: {
				this.ws.close(4000, 'Unknown event');
				break;
			}
		}
	}
}

export default (async function chat(context) {
	const socket = context.upgrade();
	const userId = context.state.user!;
	const user = await client.user.findFirst({ where: { id: userId } });
	if (user === null) {
		socket.close(3000, 'User not found');
		return;
	}
	const roomId = context.params.id;
	if (roomId === undefined || !Number.isFinite(Number.parseInt(roomId))) {
		socket.close(4000, 'Room ID not provided');
		return;
	}
	const room = await client.chatRoom.findFirst({ where: { id: Number.parseInt(roomId) } });
	if (room === null) {
		socket.close(4000, 'Room not found');
		return;
	}
	new ChatClient(socket, user, room);
}) as RouterMiddleware<'/chat/:id', { id: string }, AppState>;
