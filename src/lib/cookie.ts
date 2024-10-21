import * as simpleCookie from '@juji/simple-cookie';

export type Cookie = simpleCookie.CookieObject;

export function parse(cookies: string): Map<string, string> {
	return new Map(cookies.split('; ').map(c => c.split('=').map(x => decodeURIComponent(x)) as [string, string]));
}

export function stringify(cookie: Cookie): string {
	return simpleCookie.stringify(cookie);
}
