import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import Link from "next/link";

const customCodeRenderer = (node: any) => {
  const { value } = node.content[0];
  return (
    <pre>
      <code>{value}</code>
    </pre>
  );
};

const customImageRenderer = (node: any) => {
  const { data } = node;
  const { target } = data;
  const { fields } = target;
  const { file, title, description } = fields;
  const { url } = file;
  return <img src={`https:${url}`} alt={description || title} />;
};

/** Internal path: relative URL on same origin (e.g. /blog/foo). Use Link to avoid full page reload. */
function isInternalHref(uri: string): boolean {
  if (typeof uri !== "string" || !uri) return false;
  return uri.startsWith("/") && !uri.startsWith("//");
}

const customLinkRenderer = (node: any) => {
  const { data } = node;
  const { uri } = data;
  const { content } = node;
  const text = content[0]?.value ?? "";
  if (isInternalHref(uri)) {
    return (
      <Link href={uri} className="text-primary hover:underline">
        {text}
      </Link>
    );
  }
  return (
    <a href={uri} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
      {text}
    </a>
  );
};

const options = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: any, children: any) => (
      <p className="mb-4">{children}</p>
    ),
    [BLOCKS.HEADING_1]: (node: any, children: any) => (
      <h1 className="text-3xl font-bold mb-4">{children}</h1>
    ),
    [BLOCKS.HEADING_2]: (node: any, children: any) => (
      <h2 className="text-2xl font-semibold mb-4">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (node: any, children: any) => (
      <h3 className="text-xl font-medium mb-4">{children}</h3>
    ),
    [BLOCKS.HEADING_4]: (node: any, children: any) => (
      <h4 className="text-lg font-medium mb-4">{children}</h4>
    ),
    [BLOCKS.HEADING_5]: (node: any, children: any) => (
      <h5 className="text-md font-medium mb-4">{children}</h5>
    ),
    [BLOCKS.HEADING_6]: (node: any, children: any) => (
      <h6 className="text-sm font-medium mb-4">{children}</h6>
    ),
    [BLOCKS.UL_LIST]: (node: any, children: any) => (
      <ul className="list-disc pl-5 mb-4">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node: any, children: any) => (
      <ol className="list-decimal pl-5 mb-4">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (node: any, children: any) => (
      <li className="mb-2">{children}</li>
    ),
    [BLOCKS.QUOTE]: (node: any, children: any) => (
      <blockquote className="border-l-4 border-muted-foreground pl-4 mb-4 italic">
        {children}
      </blockquote>
    ),
    [BLOCKS.HR]: () => <hr className="my-4" />,
    // [BLOCKS.]: customCodeRenderer,
    [INLINES.HYPERLINK]: customLinkRenderer,
    [BLOCKS.EMBEDDED_ASSET]: customImageRenderer,
  },
};

export const RichTextRenderer = {
  render: (content: any) => documentToReactComponents(content, options),
  plainText: (content: any) => {
    if (!content || !content.content) return "";

    let text = "";
    content.content.forEach((item: any) => {
      if (item.nodeType === "text") {
        text += item.value;
      } else if (item.content) {
        item.content.forEach((nestedItem: any) => {
          if (nestedItem.nodeType === "text") {
            text += nestedItem.value;
          }
        });
      }
    });
    return text;
  },
};
