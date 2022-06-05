/**
 * Copyright (c) 2022 NurMarvin (Marvin Witt)
 * Licensed under the Open Software License version 3.0
 */
import type { Schema } from "@markdoc/markdoc";
import { nodes, Tag } from "@markdoc/markdoc";

const document: Schema = {
  ...nodes.document,
  render: "div",
  transform: (node, config) => {
    const attributes = node.transformAttributes(config);
    const children = node.transformChildren(config);

    return new Tag(
      "div",
      {
        ...attributes,
        className: "markdown",
      },
      children
    );
  },
};

export default document;
