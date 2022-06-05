/**
 * Copyright (c) 2022 NurMarvin (Marvin Witt)
 * Licensed under the Open Software License version 3.0
 */
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import type { LinksFunction } from "@remix-run/node";
import { NavLink } from "@remix-run/react";

import { DISCORD_INVITE_CODE } from "~/utils/constants";

import styles from "./navbar.css";
import stylesMobile from "./navbar.mobile.css";

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
];

type NavbarLinkProps = {
  to: string;
  children: string;
  rel?: string;
};

const NavbarLink: FC<NavbarLinkProps> = ({ to, children, rel }) => {
  const external = to.startsWith("http");

  const Tag = external ? "a" : NavLink;

  return (
    <li className="navbar-item">
      <Tag prefetch="intent" rel={rel} to={to} href={external ? to : undefined}>
        {children}
      </Tag>
    </li>
  );
};

const Navbar: FC = () => {
  const { t } = useTranslation("common");

  return (
    <nav className="navbar">
      <ul className="navbar-items">
        <NavbarLink rel="canonical" to="/">{t("home")}</NavbarLink>
        <NavbarLink to={`https://discord.gg/${DISCORD_INVITE_CODE}`}>
          {t("discord")}
        </NavbarLink>
        <NavbarLink to="https://twitter.com/DiscordPreviews">
          {t("twitter")}
        </NavbarLink>
      </ul>
    </nav>
  );
};

export default Navbar;
