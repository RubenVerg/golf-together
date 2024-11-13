const id = Number.parseInt(document.querySelector('meta[name=golf-together-chat-id]').content);

const url = new URL(`/websocket/chat/${id}`, location.href);
url.protocol = url.protocol.replace('http', 'ws');
const socket = new WebSocket(url);

await new Promise(resolve => {
	socket.addEventListener('open', () => resolve(), { once: true });
});

await new Promise(resolve => {
	socket.addEventListener('message', event => {
		const message = JSON.parse(event.data);
		if (message.event === 'hasConnected') {
			resolve();
		}
	}, { once: true });
});

const showMessage = message => {
	const messageTemplate = document.getElementById('message-template');
	const messageElement = messageTemplate.content.cloneNode(true);

	messageElement.querySelector('.message').id = `message-${message.id}`;
	messageElement.querySelector('.message-content').textContent = message.text;
	messageElement.querySelector('.message-timestamp').textContent = new Intl.DateTimeFormat('ja-JP', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(message.createdAt));
	messageElement.querySelector('.message-author').textContent = message.authorName;

	document.querySelector('#messages').appendChild(messageElement);
}

socket.onmessage = event => {
	const message = JSON.parse(event.data);
	if (message.event === 'oldMessages') {
		for (const m of message.data.reverse()) {
			showMessage(m);
		}
	} else if (message.event === 'receiveMessage') {
		showMessage(message.data);
	} else if (message.event === 'connectedUsers') {
		const connectedUsers = document.querySelector('#connected-users');
		connectedUsers.innerHTML = '';
		for (const user of Object.values(message.data)) {
			const userElement = document.createElement('li');
			userElement.textContent = user.username;
			connectedUsers.appendChild(userElement);
		}
	} else {
		console.log(message);
	}
};

document.querySelector('#send-message').addEventListener('click', event => {
	event.preventDefault();
	const text = document.querySelector('#message-text').value;
	if (text.trim() === '') return;
	socket.send(JSON.stringify({ event: 'sendMessage', data: text }));
});

socket.send(JSON.stringify({ event: 'hasConnected', data: null }));

document.querySelector('#loading').remove();
