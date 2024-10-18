import { createRequire } from 'node:module';
import { parse } from '@std/dotenv';
import { type PrismaClient } from '../../generated/prisma/index.d.ts';

const dotenv = parse(await Deno.readTextFile('./prisma/.env'));

const require = createRequire(import.meta.url);
const Prisma = require('../../generated/prisma/index.js');
const client: PrismaClient = new Prisma.PrismaClient({ datasources: { db: { url: dotenv.DATABASE_URL } } });

export default client;

export type * from '../../generated/prisma/index.d.ts';