# Golf Together

TODO

## Setup

* Copy `postgres.example.env` and `prisma/.example.env` to `postgres.env` and `prisma/.env`
* Change the required fields (make sure they're the same in the two files!)
* Run `docker-compose up -d`
* Run `deno task prisma:migrate:deploy`
* Run `deno task prisma`
* Run `dotenv -e prisma/.env deno task dev`
