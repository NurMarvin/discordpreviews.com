/**
 * Copyright (c) 2022 NurMarvin (Marvin Witt)
 * Licensed under the Open Software License version 3.0
 */
import type { Schema } from "@markdoc/markdoc";

const timestamp: Schema = {
  render: "Timestamp",
  attributes: {
    timestamp: {
      type: Number,
      required: true,
    },
    format: {
      type: String,
      default: "MM/dd/yyyy HH:mm:ss",
    },
  },
};

export default timestamp;
