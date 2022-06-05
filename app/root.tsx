/**
 * Copyright (c) 2022 NurMarvin (Marvin Witt)
 * Licensed under the Open Software License version 3.0
 */
import { useTranslation } from "react-i18next";
import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useMatches,
} from "@remix-run/react";
import { useChangeLanguage } from "remix-i18next";

import favicon from "../public/favicon.svg";
import icon from "../public/previews.png";

import Layout, { links as layoutLinks } from "./components/Layout";
import i18n from "./utils/i18n.server";
import i18nextOptions from "./utils/i18nextOptions";

import styles from "./styles/global.css";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: styles,
  },
  {
    rel: "icon",
    type: "image/svg+xml",
    href: favicon,
  },
  ...layoutLinks(),
];

type LoaderData = {
  locale: string;
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  url: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const canonicalUrl = url.protocol + "//" + url.host;
  const locale = await i18n.getLocale(request);
  const t = await i18n.getFixedT(request, "common");
  const title = t("headTitle");
  const description = t("headDescription");
  const keywords = t("headKeywords");
  return json({ locale, title, description, keywords, canonicalUrl, url });
};

export const handle = {
  // In the handle export, we could add a i18n key with namespaces our route
  // will need to load. This key can be a single string or an array of strings.
  i18n: ["common"],
};

export const meta: MetaFunction = ({ data }) => {
  const { canonicalUrl, title, description, keywords, url } =
    data as LoaderData;

  return {
    title: title,
    description: description,
    viewport: "width=device-width, initial-scale=1, shrink-to-fit=no",
    charset: "utf-8",
    "http-equiv": "X-UA-Compatible",
    content: "IE=edge",
    keywords: keywords,
    "og:title": title,
    "og:description": description,
    "og:image": `${canonicalUrl}${icon}`,
    "og:type": "website",
    "og:url": url,
    "og:site_name": title,
    "twitter:card": "summary",
    "twitter:title": title,
    "twitter:description": description,
    "twitter:image": `${canonicalUrl}${icon}`,
    "twitter:site": "@DiscordPreviews",
  };
};

export default function App() {
  const { i18n } = useTranslation();
  const { locale, canonicalUrl } = useLoaderData<LoaderData>();

  const matches = useMatches();
  const includeScripts = matches.some((match) => match.handle?.hydrate);

  useChangeLanguage(locale);

  return (
    <html lang={locale} dir={i18n.dir()}>
      <head>
        <Meta />
        <Links />
        {i18nextOptions.supportedLngs
          .filter((lng) => lng !== locale)
          .map((lng) => (
            <link
              key={lng}
              rel="alternate"
              hrefLang={lng}
              href={canonicalUrl}
            />
          ))}
        <script
          async
          defer
          data-domain="discordpreviews.com"
          src="https://analytics.nurmarv.in/js/script.outbound-links.js"
        />
      </head>
      <body>
        <Layout>
          <Outlet />
        </Layout>

        <ScrollRestoration />
        {includeScripts ? <Scripts /> : null}
        <LiveReload />
      </body>
    </html>
  );
}
