import { parseArgs } from '@std/cli/parse-args';
import { Application } from '@oak/oak';

const args = parseArgs(Deno.args);

const port = 'port' in args ? Number.parseInt(args.port) : 13337;

const app = new Application();

app.use(ctx => {
  ctx.response.body = 'Hello from Golf Together!';
});

console.log(`Listening on port ${port}`);

app.listen({ port });
