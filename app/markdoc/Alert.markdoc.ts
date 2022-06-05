/**
 * Copyright (c) 2022 NurMarvin (Marvin Witt)
 * Licensed under the Open Software License version 3.0
 */
import type { Schema } from "@markdoc/markdoc";

const alert: Schema = {
  render: "Alert",
  children: ["text", "tag", "list", "link"],
  attributes: {
    type: {
      type: String,
      default: "info",
      matches: ["info", "success", "warn", "danger"],
    },
  },
};

export default alert;
