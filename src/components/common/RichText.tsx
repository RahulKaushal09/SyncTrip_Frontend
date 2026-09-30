import React from "react";
import { parseRichText, RichNode } from "@/utils/richText";

/**
 * Renders user-written text with the app's WhatsApp-style formatting:
 * *bold*, _italic_, ~strike~, `code` / ```block```, "> quote", plus
 * clickable links, emails and phone numbers. Same parser as the app
 * (utils/richText.ts), so a description looks the same in both places.
 *
 * Server-safe (no hooks). Line breaks are kept by the wrapper's
 * `white-space: pre-line` (the share pages' `.prose` class) or by the
 * default style below.
 */

type Props = {
  text: string;
  as?: "p" | "div" | "span";
  className?: string;
  style?: React.CSSProperties;
};

const linkStyle: React.CSSProperties = {
  color: "#007EB2",
  fontWeight: 600,
  textDecoration: "underline",
  textUnderlineOffset: "2px",
  overflowWrap: "anywhere",
};

function hrefFor(node: RichNode): string | null {
  const l = node.link;
  if (!l || l.kind === "mention") return null;
  if (l.kind === "email") return l.href.startsWith("mailto:") ? l.href : `mailto:${l.href}`;
  if (l.kind === "phone") return l.href.startsWith("tel:") ? l.href : `tel:${l.href.replace(/[\s-]/g, "")}`;
  return /^https?:\/\//i.test(l.href) ? l.href : `https://${l.href}`;
}

function renderNode(node: RichNode, key: number): React.ReactNode {
  let el: React.ReactNode = node.text;
  const s = node.style;
  if (s.code) {
    el = (
      <code style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.92em", background: "#f1f5f9", borderRadius: 6, padding: "0.1em 0.35em" }}>
        {el}
      </code>
    );
  }
  if (s.strike) el = <s>{el}</s>;
  if (s.italic) el = <em>{el}</em>;
  if (s.bold) el = <strong style={{ fontWeight: 700, color: "#0f172a" }}>{el}</strong>;
  if (s.quote) {
    el = (
      <span style={{ display: "inline-block", borderLeft: "3px solid #cbd5e1", paddingLeft: "0.6em", color: "#64748b" }}>{el}</span>
    );
  }
  const href = hrefFor(node);
  if (href) {
    const external = node.link?.kind === "url";
    el = (
      <a href={href} style={linkStyle} {...(external ? { target: "_blank", rel: "noopener noreferrer nofollow ugc" } : {})}>
        {el}
      </a>
    );
  }
  return <React.Fragment key={key}>{el}</React.Fragment>;
}

export default function RichText({ text, as = "p", className, style }: Props) {
  const Tag = as;
  const nodes = parseRichText(text || "", { links: true });
  return (
    <Tag className={className} style={{ whiteSpace: "pre-line", ...style }}>
      {nodes.map(renderNode)}
    </Tag>
  );
}
