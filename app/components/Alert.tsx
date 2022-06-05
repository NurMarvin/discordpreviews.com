/**
 * Copyright (c) 2022 NurMarvin (Marvin Witt)
 * Licensed under the Open Software License version 3.0
 */
import type { FC } from "react";
import type { LinksFunction } from "@remix-run/node";

import styles from "./alert.css";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: styles,
  },
];

type AlertProps = {
  className?: string;
  type: "info" | "success" | "warn" | "danger";
};

const Alert: FC<AlertProps> = ({ className, children, type }) => {
  return (
    <div className={["alert-box", type, className].join(" ")} role="alert">
      <blockquote>{children}</blockquote>
    </div>
  );
};

export default Alert;
