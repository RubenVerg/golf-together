import { createRequire } from 'node:module';
import { type PrismaClient } from '../../generated/prisma/index.d.ts';

const require = createRequire(import.meta.url);
const Prisma = require('../../generated/prisma/index.js');
const client: PrismaClient = new Prisma.PrismaClient({ datasources: { db: { url: Deno.env.get('DATABASE_URL') } } });

export default client;

export type * from '../../generated/prisma/index.d.ts';