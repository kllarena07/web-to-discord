"use client";

import Markdown from "marked-react";
import { EmojiConvertor } from "emoji-js";

export function MarkdownPreview({ value }: { value: string }) {
  const emojiConverter = new EmojiConvertor();

  const formattedText = value
    .split("\n")
    .map((line) => (line.trim() !== "" ? line + "  " : "‎  "))
    .join("\n");

  const markdownWithEmojis = emojiConverter.replace_colons(formattedText);

  return (
    <div className="flex flex-col h-full border px-3 py-2 bg-[#2B2D31] text-white overflow-scroll md-preview">
      <Markdown value={markdownWithEmojis}></Markdown>
    </div>
  );
}
