/**
 * Copyright (c) 2022 NurMarvin (Marvin Witt)
 * Licensed under the Open Software License version 3.0
 */
import Markdoc from "@markdoc/markdoc";
import { type NewsArticle } from "@prisma/client";
import { type HeadersInit, type LoaderFunction } from "@remix-run/node";
import yaml from "js-yaml";
import { DateTime } from "luxon";
import { SitemapStream, streamToPromise } from "sitemap";

import i18nextOptions from "~/utils/i18nextOptions";
import { prisma } from "~/utils/prisma.server";

import i18n from "../utils/i18n.server";

export const loader: LoaderFunction = async ({ request }) => {
  const locale = await i18n.getLocale(request);
  const t = await i18n.getFixedT(request, "common");

  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  const generateLinksForUrl = (uri: string) =>
    i18nextOptions.supportedLngs.map((lng) => ({
      lang: lng,
      url: `${uri}`,
    }));

  try {
    const sitemapStream = new SitemapStream({
      hostname: baseUrl,
    });

    sitemapStream.write({
      url: "/",
      changefreq: "daily",
      priority: 1,
      links: generateLinksForUrl("/"),
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
      const data: any = {
        url: `${baseUrl}/${article.slug}`,
        changefreq: "hourly",
        lastmod: article.published,
        // Reduce priority for older articles
        priority: 0.9 - index / articles.length,
        links: generateLinksForUrl(`/${article.slug}`),
      };

      const publicationDate = DateTime.fromJSDate(article.published);
      const currentDate = DateTime.local();

      // Add the `news` field if article was published within the last two days
      if (currentDate.diff(publicationDate, "days").days <= 2) {
        const ast = Markdoc.parse(article.content);
        const frontmatter = (
          ast.attributes.frontmatter
            ? yaml.load(ast.attributes.frontmatter)
            : {}
        ) as Record<string, any>;

        data.news = {
          title: frontmatter.title,
          description: frontmatter.description,
          publication: {
            name: "Discord Previews",
            language: locale,
          },
          publication_date: DateTime.fromJSDate(article.published).toFormat(
            "yyyy-MM-dd"
          ),
          keywords: t("headKeywords") + ", " + article.tags.join(", "),
        };
      }

      sitemapStream.write(data);
    });

    const sitemap = streamToPromise(sitemapStream).then((sitemap) =>
      sitemap.toString()
    );

    sitemapStream.end();

    const headers: HeadersInit = {
      "Content-Type": "application/xml; charset=utf-8",
      "x-content-type-options": "nosniff",
    };

    return new Response(await sitemap, { headers });
  } catch (error) {
    throw new Response(null, {
      status: 500,
    });
  }
};
