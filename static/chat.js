const id = Number.parseInt(document.querySelector('meta[name=golf-together-chat-id]').content);

const url = new URL(`/websocket/chat/${id}`, location.href);
url.protocol = url.protocol.replace('http', 'ws');
const socket = new WebSocket(url);

await new Promise(resolve => {
	socket.addEventListener('open', () => resolve(), { once: true });
});

const showMessage = message => {
	const messageTemplate = document.getElementById('message-template');
	const messageElement = messageTemplate.content.cloneNode(true);

	messageElement.querySelector('.message-content').textContent = message.text;
	messageElement.querySelector('.message-timestamp').textContent = new Intl.DateTimeFormat('en-GB').format(new Date(message.createdAt));
	messageElement.querySelector('.message-author').textContent = message.author;

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

await new Promise(resolve => { setTimeout(() => resolve(), 250); });

socket.send(JSON.stringify({ event: 'hasConnected', data: null }));
