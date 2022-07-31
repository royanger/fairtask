# Fair Task App

## Configuring

Please see the `.env-sample` file for the variables required. During development and testing the DB was hosted on [Railway](https://railway.app) and it works great. Any Postgres host will work. You could use other DBs, though that could require edits to the schema and possibly some of the queries and mutations.

Of note, the app uses the email settings as a string. The format is `smtp://<username or api id>:<password or api key>@<host>:<port>`

## Development

### Migration or Push

You will need to run a database migration or push. The exact method may depend on the DB you use and can depend on preference. Please see the [migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate) and [push](https://www.prisma.io/docs/reference/api-reference/command-reference#db-push) documentation for details.

This will need to run after any database schema changes.

### Prisma Client

You may also need to run `npx prisma generate` to create the Prisma client and update type defs.

### Running

`npm run dev` will run the Next app, which includes the serverless routes for the API.

## Deployment

You will want to setup a production database, but otherwise transfer all environement variables to your host. The application runs flawlessly on [Netlify](https://www.netlify.com/) and [Vercel](https://vercel.com/).

You will need to add `Migration/Push` and `Generate` commands to your build options as required.
