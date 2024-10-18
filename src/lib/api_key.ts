import { encodeBase64 } from '@std/encoding/base64';

const key = await crypto.subtle.generateKey(
	{ name: 'HMAC', hash: 'SHA-512' },
	true,
	['sign', 'verify'],
);

export default key;

export const keyString = await crypto.subtle.exportKey('raw', key).then(buf => encodeBase64(buf));
