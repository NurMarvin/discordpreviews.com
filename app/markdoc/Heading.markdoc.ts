/**
 * Copyright (c) 2022 NurMarvin (Marvin Witt)
 * Licensed under the Open Software License version 3.0
 */
import type { RenderableTreeNode, Schema } from "@markdoc/markdoc";
import { nodes, Tag } from "@markdoc/markdoc";

const generateID = (
  children: RenderableTreeNode[],
  attributes: Record<string, any>
) => {
  if (attributes.id && typeof attributes.id === "string") {
    return attributes.id;
  }

  return children
    .filter((child) => typeof child === "string")
    .join(" ")
    .replace(/[?]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
};

const heading: Schema = {
  ...nodes.heading,
  transform(node, config) {
    const attributes = node.transformAttributes(config);
    const children = node.transformChildren(config);

    const id = generateID(children, attributes);

    return new Tag(
      `h${node.attributes["level"]}`,
      { ...attributes, id },
      children
    );
  },
};

export default heading;
