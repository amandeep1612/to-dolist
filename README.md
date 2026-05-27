# Velora

Next.js 15 app router starter for Velora.

## Stack

- Next.js 15
- React 19
- JavaScript
- Tailwind CSS
- Prisma-ready
- Auth.js-ready
- Vercel-ready

## Prisma

Migration commands:

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:studio
```

Database connection:

- Set `DATABASE_URL` in `.env.local`
- Set `DIRECT_URL` in `.env.local` for Prisma migrations and Neon-style direct connections
- Set `AUTH_SECRET` and `AUTH_URL` for Auth.js
- PostgreSQL is configured in `prisma/schema.prisma`
