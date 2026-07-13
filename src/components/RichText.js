import React from "react";

function Span({ span, markDefs }) {
  let value = span.text;

  for (const mark of span.marks || []) {
    if (mark === "strong") value = <strong>{value}</strong>;
    else if (mark === "em") value = <em>{value}</em>;
    else if (mark === "underline") value = <u>{value}</u>;
    else {
      const definition = markDefs.find((item) => item._key === mark);
      if (definition?._type === "link" && definition.href) {
        value = (
          <a href={definition.href} target="_blank" rel="noreferrer noopener">
            {value}
          </a>
        );
      }
    }
  }

  return value;
}

function Block({ block }) {
  const markDefs = block.markDefs || [];
  const children = (block.children || []).map((span) => (
    <React.Fragment key={span._key}>
      <Span span={span} markDefs={markDefs} />
    </React.Fragment>
  ));

  if (block.style === "h2") return <h2>{children}</h2>;
  if (block.style === "h3") return <h3>{children}</h3>;
  if (block.style === "blockquote") return <blockquote>{children}</blockquote>;
  return <p>{children}</p>;
}

export default function RichText({ document }) {
  if (!Array.isArray(document)) return null;

  const output = [];
  let listItems = [];
  let listType = null;

  const flushList = () => {
    if (!listItems.length) return;
    const Tag = listType === "number" ? "ol" : "ul";
    output.push(<Tag key={`list-${output.length}`}>{listItems}</Tag>);
    listItems = [];
    listType = null;
  };

  document.forEach((block) => {
    if (block._type !== "block") return;
    if (block.listItem) {
      if (listType && listType !== block.listItem) flushList();
      listType = block.listItem;
      listItems.push(
        <li key={block._key}>
          <Block block={{ ...block, style: "normal" }} />
        </li>
      );
    } else {
      flushList();
      output.push(<Block key={block._key} block={block} />);
    }
  });
  flushList();

  return <>{output}</>;
}
