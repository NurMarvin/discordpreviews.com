# discordpreviews.com

The source code for the [Discord Previews](https://discordpreviews.com) website.

## Setup

### Development Setup
1. Install dependencies via `npm install`
2. Use Docker Compose to run a database via `docker-compose up -d`, unless you already have a local PostgreSQL database running.
3. Copy the default `.env.example` file to `.env`. If you are using Docker Compose, you can leave everything in that file as-is, otherwise edit it to match your local environment. 
4. Push the Prisma schema to the database via `npx prisma db push`
5. Start the development server via `npm run dev`

### Production Setup
1. Install dependencies via `npm install`
2. Copy the default `.env.example` file to `.env`. In production you should have a database running locally, so you will need to edit the `.env` accordingly. Additionally, if you don't want debug logging, you will need to add `NODE_ENV=production` in the `.env` file.
3. Apply database migrations via `npx prisma migrate deploy`
4. Build the production server via `npm run build`
5. Start the production server via `npm run start`


## Adding an article

Currently adding an article can only be done via the database, though there are plans to add UI for it on the frontend in the future. To add an article, connect to the database and run the following query:

```sql
INSERT INTO public."NewsArticle" (slug, content, tags, published)
VALUES ('example', '---
title: Example Article
description: Example Description
---
The content of your news article.', '{keywords,for,seo}', '<ISO 8601 Timestamp>');
```

If you don't want the article to be shown on the front page, you can simply set the `published` field to `null`. Then it will only be accessible via by directly accessing the URL.