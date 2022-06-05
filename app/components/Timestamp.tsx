/**
 * Copyright (c) 2022 NurMarvin (Marvin Witt)
 * Licensed under the Open Software License version 3.0
 */
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import type { LinksFunction } from "@remix-run/node";
import { DateTime } from "luxon";

import styles from "./timestamp.css";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: styles,
  },
];

type TimestampProps = {
  timestamp: number;
  format?: string;
};

const Timestamp: FC<TimestampProps> = ({
  timestamp,
  format = "LLL d, yyyy, h:mm a",
}) => {
  const { i18n } = useTranslation();
  const date = DateTime.fromMillis(timestamp, {
    zone: "utc",
    locale: i18n.language,
  });

  return (
    <time className="timestamp" dateTime={date.toISO()}>
      {date.toFormat(format)}
    </time>
  );
};

export default Timestamp;
