/**
 * Copyright (c) 2022 NurMarvin (Marvin Witt)
 * Licensed under the Open Software License version 3.0
 */
import type { FC } from "react";
import React from "react";
import type { LinksFunction } from "@remix-run/node";
import Prism from "prismjs";

import "prismjs/components/prism-diff";

import styles from "./code.css";
import stylesMobile from "./code.mobile.css";

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

type CodeProps = {
  children: string;
  language: string;
};

const Code: FC<CodeProps> = ({ children, language }) => {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (ref.current) Prism.highlightElement(ref.current, false);
  }, [children]);

  return (
    <pre className={`code language-${language}`}>
      <code ref={ref}>{children}</code>
    </pre>
  );
};

export default Code;
