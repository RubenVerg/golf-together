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
	
	static broadcast(f: (client: ChatClient) => void) {
		for (const client of ChatClient.connectedClients.values())
			f(client);
	}

	static async broadcastAsync(f: (client: ChatClient) => Promise<void>) {
		for (const client of ChatClient.connectedClients.values())
			await f(client);
	}

	public readonly id: ClientId;
	
	constructor(public readonly ws: WebSocket, public readonly user: User, public readonly room: ChatRoom) {
		this.id = `${user.id}:${room.id}`
		ChatClient.connectedClients.set(this.id, this);
		ws.onopen = this.whenConnected.bind(this);
		ws.onclose = this.onClose.bind(this);
		ws.onmessage = this.onMessage.bind(this);
	}

	async shareOldMessages() {
		const messages = await client.chatMessage.findMany({ where: { roomId: this.room.id }, orderBy: { createdAt: 'desc' }, take: 100 });
		this.ws.send(JSON.stringify({ event: 'oldMessages', data: messages.map(m => ({ id: m.id, author: m.authorId, text: m.text, createdAt: m.createdAt.valueOf() })) } as MessageOldMessages));
	}

	shareConnectedUsers() {
		this.ws.send(JSON.stringify({ event: 'connectedUsers', data: Object.fromEntries(ChatClient.connectedClients.values().map(({ user }) => [user.id, { id: user.id, username: user.username }])) } as MessageConnectedUsers));
	}

	shareMessage(message: ChatMessage) {
		this.ws.send(JSON.stringify({ event: 'receiveMessage', data: { id: message.id, author: message.authorId, text: message.text, createdAt: message.createdAt.valueOf() } } as MessageReceiveMessage));
	}

	async whenConnected() {
		this.shareConnectedUsers();
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
				ChatClient.broadcast(c => c.shareMessage(message));
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
