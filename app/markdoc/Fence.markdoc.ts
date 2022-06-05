/**
 * Copyright (c) 2022 NurMarvin (Marvin Witt)
 * Licensed under the Open Software License version 3.0
 */
import type { Schema } from "@markdoc/markdoc";

const code: Schema = {
  render: "Code",
  attributes: {
    content: { type: String },
    language: {
      type: String,
    },
  },
};

export default code;
