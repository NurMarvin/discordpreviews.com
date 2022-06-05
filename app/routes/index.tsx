/**
 * Copyright (c) 2022 NurMarvin (Marvin Witt)
 * Licensed under the Open Software License version 3.0
 */
import { Trans, useTranslation } from "react-i18next";
import Markdoc from "@markdoc/markdoc";
import { type NewsArticle } from "@prisma/client";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import yaml from "js-yaml";
import { DateTime } from "luxon";

import { DISCORD_INVITE_CODE } from "~/utils/constants";
import { getFlooredMemberCount } from "~/utils/discord.server";
import { prisma } from "~/utils/prisma.server";

import discordLogo from "../../public/images/discord.svg";
import unavailable from "../../public/images/unavailable.svg";

import styles from "../styles/index.css";
import stylesMobile from "../styles/index.mobile.css";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: styles,
  },
  {
    rel: "stylesheet",
    href: stylesMobile,
    media: "screen and (max-width: 768px)",
  },
  {
    rel: "preload",
    as: "image",
    type: "image/svg+xml",
    href: discordLogo,
  },
];

export const handle = {
  // In the handle export, we could add a i18n key with namespaces our route
  // will need to load. This key can be a single string or an array of strings.
  i18n: ["index"],
  hydrate: true,
};

export const loader: LoaderFunction = async () => {
  const memberCount = await getFlooredMemberCount(DISCORD_INVITE_CODE);
  const articles = await prisma.newsArticle.findMany({
    where: {
      published: {
        not: null,
      },
    },
    orderBy: {
      published: "desc",
    },
    take: 9,
  });

  return {
    memberCount,
    articles: articles.map((article) => {
      const ast = Markdoc.parse(article.content);
      const frontmatter = ast.attributes.frontmatter
        ? yaml.load(ast.attributes.frontmatter)
        : {};

      return {
        ...article,
        frontmatter,
      };
    }),
  };
};

type LoaderData = {
  memberCount: number;
  articles: (NewsArticle & {
    published: string;
    frontmatter: {
      title: string;
      description: string;
      cover?: string;
    };
  })[];
};

const Index = () => {
  const { memberCount, articles } = useLoaderData<LoaderData>();
  const { t, i18n } = useTranslation("index");

  return (
    <>
      <div className="header">
        <h1>{t("title")}</h1>
        <h2>{t("subtitle")}</h2>
        <a
          className="cta"
          target="_blank"
          rel="noreferrer"
          href={`https://discord.gg/${DISCORD_INVITE_CODE}`}
        >
          <img src={discordLogo} alt="Discord" width="24" height="18.58" />
          <span>{t("cta", { memberCount })}</span>
        </a>
      </div>
      <div className="articles">
        <h1>{t("articles")}</h1>
        <div role="list" className="article-list">
          {articles.map((article) => {
            const date = DateTime.fromISO(article.published, {
              zone: "utc",
              locale: i18n.language,
            });
            const formattedDate = date.toLocaleString(DateTime.DATETIME_MED);
            const cover = article.frontmatter.cover ?? unavailable;

            return (
              <Link
                role="article"
                to={article.slug}
                key={article.slug}
                className="article"
               >
                <img src={cover} alt={article.frontmatter.title} />
                <div className="article-content">
                  <h3>{article.frontmatter.title}</h3>
                  <p>{article.frontmatter.description}</p>
                  <hr />
                  <Trans
                    i18nKey="publishedAt"
                    t={t}
                    formattedDate={formattedDate}
                  >
                    published{" "}
                    <time dateTime={date.toISO()}>{{ formattedDate }}</time>
                  </Trans>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Index;
