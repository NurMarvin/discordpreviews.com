/**
 * Copyright (c) 2022 NurMarvin (Marvin Witt)
 * Licensed under the Open Software License version 3.0
 */
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import type { RenderableTreeNode } from "@markdoc/markdoc";
import Markdoc from "@markdoc/markdoc";
import type { NewsArticle } from "@prisma/client";
import {
  type LinksFunction,
  type LoaderFunction,
  type MetaFunction,
  json,
} from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import yaml from "js-yaml";

import Alert, { links as alertLinks } from "~/components/Alert";
import Code, { links as codeLinks } from "~/components/Code";
import Timestamp, { links as timestampLinks } from "~/components/Timestamp";

import alert from "~/markdoc/Alert.markdoc";
import document from "~/markdoc/Document.markdoc";
import fence from "~/markdoc/Fence.markdoc";
import heading from "~/markdoc/Heading.markdoc";
import timestamp from "~/markdoc/Timestamp.markdoc";
import { DISCORD_INVITE_CODE } from "~/utils/constants";
import { getFlooredMemberCount } from "~/utils/discord.server";
import i18n from "~/utils/i18n.server";
import { prisma } from "~/utils/prisma.server";

import discordLogo from "../../public/images/discord.svg";
import unavailable from "../../public/images/unavailable.svg";

import styles from "../styles/article.css";
import stylesMobile from "../styles/article.mobile.css";

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
  ...alertLinks(),
  ...codeLinks(),
  ...timestampLinks(),
];

export const handle = {
  hydrate: true,
  i18n: ["article"],
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const t = await i18n.getFixedT(request, "common");
  const title = t("headTitle");
  const keywords = t("headKeywords");

  const { slug } = params;

  const article = await prisma.newsArticle.findUnique({
    where: { slug },
  });

  if (!article || !slug) {
    const articleNotFound = t("articleNotFound");
    const articleNotFoundDetails = t("articleNotFoundDetails");
    throw json(
      {
        message: articleNotFound,
        details: articleNotFoundDetails,
      },
      {
        status: 404,
      }
    );
  }

  const ast = Markdoc.parse(article.content);
  const frontmatter = ast.attributes.frontmatter
    ? yaml.load(ast.attributes.frontmatter)
    : {};
  const content = Markdoc.transform(ast, {
    nodes: {
      fence,
      document,
      heading,
    },
    tags: {
      alert,
      timestamp,
    },
  });

  const memberCount = await getFlooredMemberCount(DISCORD_INVITE_CODE);

  const data = {
    title,
    keywords,
    article: {
      ...article,
      frontmatter,
      content,
    },
    memberCount,
  };

  return data;
};

type LoaderData = {
  title: string;
  keywords: string;
  article: NewsArticle & {
    frontmatter: {
      title: string;
      description: string;
      cover?: string;
    };
    content: RenderableTreeNode;
  };
  memberCount: number;
};

export const meta: MetaFunction = ({ data }) => {
  if (!data) {
    return {};
  }

  const { article, title } = data as LoaderData;
  const description = article.frontmatter.description;

  return {
    title: `${article.frontmatter.title} - ${title}`,
    description,
    "og:title": article.frontmatter.title,
    "og:description": description,
    "og:image": article.frontmatter.cover,
    "og:image:alt": description,
    "og:image:width": "450",
    "og:image:height": "150",
    "og:image:secure_url": article.frontmatter.cover,
    "og:image:url": article.frontmatter.cover,
    "og:type": "article",
    "twitter:card": "summary_large_image",
    "twitter:title": article.frontmatter.title,
    "twitter:description": description,
    "twitter:image": article.frontmatter.cover,
    keywords: data.keywords + ", " + article.tags.join(", "),
  };
};

const Article = () => {
  const { article, memberCount } = useLoaderData<LoaderData>();
  const { t, ready } = useTranslation("article");

  if (!ready) return null;

  const content = Markdoc.renderers.react(article.content, React, {
    components: {
      Alert,
      Code,
      Timestamp,
    },
  });

  return (
    <article className="article">
      <h1 className="title">{article.frontmatter.title}</h1>
      <Alert className="cta" type="info">
        <img
          className="cta-icon"
          src={discordLogo}
          alt="Discord"
          width="24"
          height="18.58"
        />
        <span className="cta-text">
          <Trans i18nKey="cta" memberCount={memberCount} t={t}>
            text
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://discord.gg/${DISCORD_INVITE_CODE}`}
            >
              link {{ memberCount }}
            </a>
          </Trans>
        </span>
      </Alert>
      {content}
    </article>
  );
};

export const CatchBoundary = () => {
  const caught = useCatch();

  return (
    <article className="article">
      <img
        src={unavailable}
        width={478}
        height={192}
        alt="TV with static screen and an exclamation mark"
      />
      <h1 className="title">{caught.data.message}</h1>
      <p className="details">{caught.data.details}</p>
    </article>
  );
};

export default Article;
