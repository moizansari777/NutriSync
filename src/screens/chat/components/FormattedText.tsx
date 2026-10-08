import React, { useMemo } from "react";
import { TextStyle, StyleProp, View, StyleSheet } from "react-native";
import { stripTrailingNutritionMacros } from "../../../utils/stripTrailingNutritionMacros";
import AppText from "../../../components/appText";

interface FormattedTextProps {
  children: string;
  style?: StyleProp<TextStyle>;
}

const preprocess = (text: string): string => {
  if (!text || text.trim() === "") return "";

  let raw = text.toString();

  // Convert literal "\n" / "\r" escape sequences into real newlines
  raw = raw.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n").replace(/\\r/g, "\n");
  raw = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Normalize ANY leading bullet marker ("-" or "•") at the start of a line to "●"
  raw = raw
    .split("\n")
    .map((line) => {
      const m = line.match(/^(\s*)[-•]\s+(.*)$/);
      if (m) {
        const [, indent, rest] = m;
        return `${indent}• ${rest}`;
      }
      return line;
    })
    .join("\n");

  // Collapse 3+ blank lines down to a single blank line
  raw = raw.replace(/\n{3,}/g, "\n\n");

  return raw;
};

/* --------------------------------------------------
   TOKENIZER → extracts bold, italic, plain
-------------------------------------------------- */
const tokenize = (text: string) => {
  const tokens: { type: "bold" | "italic" | "text"; value: string }[] = [];

  // const regex = /\*\*(.*?)\*\*|\*(.*?)\*|([^*]+)/g;
  const regex = /\*\*(.*?)\*\*|\*(.*?)\*|([^*]+)|(\*)/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match[1] !== undefined && match[1] !== "") {
      tokens.push({ type: "bold", value: match[1] });
    } else if (match[2] !== undefined && match[2] !== "") {
      tokens.push({ type: "italic", value: match[2] });
    } else if (match[3]) {
      tokens.push({ type: "text", value: match[3] });
    } else if (match[4]) {
      // lone `*` — render as plain text instead of breaking the loop
      tokens.push({ type: "text", value: match[4] });
    }
  }

  return tokens;
};

/* --------------------------------------------------
   BLOCK SPLITTER → separates bullet lines from plain text
-------------------------------------------------- */
type Block =
  | { kind: "text"; content: string }
  | { kind: "bullet"; content: string; indent: number };

const toBlocks = (text: string): Block[] => {
  const blocks: Block[] = [];

  for (const line of text.split("\n")) {
    const m = line.match(/^(\s*)•\s+(.*)$/);
    if (m) {
      blocks.push({ kind: "bullet", content: m[2], indent: m[1].length });
    } else {
      const last = blocks[blocks.length - 1];
      if (last?.kind === "text") {
        last.content += "\n" + line;
      } else {
        blocks.push({ kind: "text", content: line });
      }
    }
  }

  // Blank lines adjacent to bullets are redundant — spacing comes from margins
  return blocks
    .map((b) =>
      b.kind === "text"
        ? { ...b, content: b.content.replace(/^\n+|\n+$/g, "") }
        : b,
    )
    .filter((b) => b.kind === "bullet" || b.content !== "");
};

/* --------------------------------------------------
   COMPONENT → renders <Text/> parts
-------------------------------------------------- */
const renderTokens = (text: string) =>
  tokenize(text).map((t, i) => {
    let innerStyle: any = {};

    if (t?.type === "bold") innerStyle.fontWeight = "bold";
    if (t?.type === "italic") innerStyle.fontStyle = "italic";

    return (
      <AppText
        allowFontScaling={false}
        key={i}
        style={innerStyle}
        selectable={true}
      >
        {t?.value}
      </AppText>
    );
  });

export const FormattedText: React.FC<FormattedTextProps> = ({
  children,
  style,
}) => {
  const processed = useMemo(
    () => preprocess(stripTrailingNutritionMacros(children)),
    [children],
  );
  const blocks = useMemo(() => toBlocks(processed), [processed]);

  const hasBullets = blocks.some((b) => b.kind === "bullet");

  // No bullets → keep the original flat <Text> rendering
  if (!hasBullets) {
    return (
      <AppText allowFontScaling={false} style={style} selectable={true}>
        {renderTokens(processed)}
      </AppText>
    );
  }

  return (
    <View>
      {blocks?.map((b, i) => {
        if (b.kind === "bullet") {
          return (
            <View
              key={i}
              style={[
                styles.bulletRow,
                i > 0 && styles.blockSpacing,
                b?.indent > 0 && { marginLeft: b?.indent * 6 },
              ]}
            >
              <AppText
                allowFontScaling={false}
                style={[style, styles.bulletMarker]}
                selectable={true}
              >
                •
              </AppText>
              <AppText
                allowFontScaling={false}
                style={[style, styles.bulletText]}
                selectable={true}
              >
                {renderTokens(b?.content)}
              </AppText>
            </View>
          );
        }

        return (
          <AppText
            allowFontScaling={false}
            key={i}
            style={[style, i > 0 && styles.blockSpacing]}
            selectable={true}
          >
            {renderTokens(b?.content)}
          </AppText>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  blockSpacing: {
    marginTop: 8,
  },
  bulletMarker: {
    marginRight: 8,
  },
  bulletText: {
    flex: 1,
  },
});