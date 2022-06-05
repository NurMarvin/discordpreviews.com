/**
 * Copyright (c) 2022 NurMarvin (Marvin Witt)
 * Licensed under the Open Software License version 3.0
 */
import type { FC } from "react";
import type { LinksFunction } from "@remix-run/node";
import { useCatch } from "@remix-run/react";

import unavailable from "../../public/images/unavailable.svg";

import Navbar, { links as navbarLinks } from "./Navbar";

import styles from "./layout.css";
import stylesMobile from "./layout.mobile.css";

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
  ...navbarLinks(),
];

const Layout: FC = ({ children }) => {
  return (
    <div className="container">
      <header className="header">
        <Navbar />
      </header>
      <main className="main">{children}</main>
    </div>
  );
};

export const CatchBoundary: FC = () => {
  const caught = useCatch();

  return (
    <div className="container">
      <header className="header">
        <Navbar />
      </header>

      <main className="main">
        <img
          src={unavailable}
          alt="TV with static screen and an exclamation mark"
        />
        <h1>{caught.data.message}</h1>
      </main>
    </div>
  );
};

export default Layout;
