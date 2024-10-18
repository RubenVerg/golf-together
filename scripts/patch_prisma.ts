const filePath = './generated/prisma/index.d.ts';

const replaces = [
	['./runtime/library.js', './runtime/library.d.ts'],
] as [string, string][];

await Deno.writeTextFile(filePath, await Deno.readTextFile(filePath).then(c => replaces.reduce((c_, [find, replace]) => c_.replaceAll(find, replace), c)));