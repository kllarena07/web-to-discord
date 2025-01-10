"use client";

import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/DateTimePicker";
import { Textarea } from "@/components/ui/textarea";
import Markdown from "marked-react";
import { useState } from "react";
import { EmojiConvertor } from "emoji-js";
import "./md-preview.css";

export default function Home() {
  const [txtAreaVal, setTxtAreaVal] = useState("");
  const [mdVal, setMdVal] = useState("");

  const handleTextChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    const newTxtAreaVal = event.target.value;
    const emoji = new EmojiConvertor();

    const formattedText = newTxtAreaVal
      .split("\n")
      .map((line) => (line.trim() !== "" ? line + "  " : "‎  "))
      .join("\n");

    const newMdVal = emoji.replace_colons(formattedText);
    console.log(newMdVal);

    setTxtAreaVal(newTxtAreaVal);
    setMdVal(newMdVal);
  };

  const sendMessage = async () => {
    console.log("Making request.");

    const data = {
      message: txtAreaVal,
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/send-message`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const json = await response.json();
    console.log(json);
  };

  return (
    <section className="flex p-5 gap-5 h-dvh">
      <section className="flex flex-col text-base w-1/2 gap-2 h-full">
        <Textarea
          className="resize-none text-base md:text-base h-full"
          value={txtAreaVal}
          onChange={handleTextChange}
        ></Textarea>
        <Button className="w-full" onClick={sendMessage}>
          Send message
        </Button>
      </section>
      <section className="flex flex-col w-1/2 gap-2">
        <div className="flex flex-col h-full border px-3 py-2 bg-[#2B2D31] text-white overflow-scroll md-preview">
          <Markdown value={mdVal}></Markdown>
        </div>
        <DateTimePicker></DateTimePicker>
      </section>
    </section>
  );
}
