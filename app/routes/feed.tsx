/**
 * Copyright (c) 2022 NurMarvin (Marvin Witt)
 * Licensed under the Open Software License version 3.0
 */
import Markdoc from "@markdoc/markdoc";
import { type NewsArticle } from "@prisma/client";
import { type LoaderFunction, Response } from "@remix-run/node";
import { Feed } from "feed";
import yaml from "js-yaml";

import i18n from "~/utils/i18n.server";
import { prisma } from "~/utils/prisma.server";

export const loader: LoaderFunction = async ({ request }) => {
  const locale = await i18n.getLocale(request);
  const t = await i18n.getFixedT(request, "common");

  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;
  const type = url.searchParams.get("type") || "rss";

  try {
    const feed = new Feed({
      title: t("headTitle"),
      description: t("headDescription"),
      id: baseUrl,
      link: baseUrl,
      language: locale,
      copyright: t("headCopyright"),
      updated: new Date(),
      generator: "Custom",
      feedLinks: {
        rss: `${baseUrl}/feed`,
        atom: `${baseUrl}/feed?type=atom`,
        json: `${baseUrl}/feed?type=json`,
      },
      author: {
        name: "Discord Previews",
        email: "contact@discordpreviews.com",
        link: "https://discordpreviews.com",
      },
      favicon: `${baseUrl}/favicon.svg`,
      image: `${baseUrl}/previews.png`,
    });

    const articles = (await prisma.newsArticle.findMany({
      where: {
        published: {
          not: null,
        },
      },
      orderBy: {
        published: "desc",
      },
    })) as (NewsArticle & { published: Date })[];

    articles.forEach((article, index) => {
      const ast = Markdoc.parse(article.content);
      const frontmatter = (
        ast.attributes.frontmatter ? yaml.load(ast.attributes.frontmatter) : {}
      ) as Record<string, any>;
      const content = Markdoc.transform(ast);
      const html = Markdoc.renderers.html(content);

      feed.addItem({
        title: frontmatter.title,
        id: article.slug,
        link: `${baseUrl}/${article.slug}`,
        description: frontmatter.description,
        content: html,
        date: article.published,
        image: frontmatter.cover,
        author: [
          {
            name: "Discord Previews",
            email: "contact@discordpreviews.com",
            link: "https://discordpreviews.com",
          },
        ],
        category: [
          {
            term: "Technology",
            domain: "https://www.discordpreviews.com/",
            name: "Technology",
          },
        ],
        published: article.published,
        guid: article.slug,
      });
    });

    feed.addCategory("Technology");

    feed.addContributor({
      name: "Discord Previews",
      email: "contact@discordpreviews.com",
      link: "https://discordpreviews.com",
    });

    switch (type) {
      case "rss":
        return new Response(feed.rss2(), {
          headers: {
            "Content-Type": "application/rss+xml",
          },
        });

      case "atom":
        return new Response(feed.atom1(), {
          headers: {
            "Content-Type": "application/atom+xml",
          },
        });
      case "json":
        return new Response(feed.json1(), {
          headers: {
            "Content-Type": "application/json",
          },
        });
      default:
        return new Response(feed.rss2(), {
          headers: {
            "Content-Type": "application/rss+xml",
          },
        });
    }
  } catch (error) {
    console.error(error);
  }
};
