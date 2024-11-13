import { parseArgs } from '@std/cli/parse-args';
import { Application } from '@oak/oak';
import defaultRouter from './routers/default.ts';

const args = parseArgs(Deno.args);

const port = 'port' in args ? Number.parseInt(args.port) : 'dev' in args ? 13337 : 80;

const app = new Application();

app.use(defaultRouter.routes());
app.use(defaultRouter.allowedMethods());

console.log(`Listening on port ${port}`);

app.listen({ port, hostname: '[::]' });
