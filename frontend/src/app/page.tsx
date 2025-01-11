"use client";

import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/DateTimePicker";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import "./md-preview.css";
import { Input } from "@/components/ui/input";
import { MarkdownPreview } from "@/components/ui/MarkdownPreview";

export default function Home() {
  const [txtAreaVal, setTxtAreaVal] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [dateTimeVal, setDateTimeVal] = useState("");

  const handleTextChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    const newTxtAreaVal = event.target.value;

    setTxtAreaVal(newTxtAreaVal);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 10) {
      alert("You can only upload a maximum of 10 files.");
      event.target.value = "";
    } else {
      setSelectedFiles(files);
    }
  };

  const sendMessage = async () => {
    console.log("Making request.");

    const formData = new FormData();
    if (!txtAreaVal.trim()) {
      alert("Message cannot be empty.");
      return;
    }
    formData.append("message", txtAreaVal);
    if (!dateTimeVal) {
      alert("Please select a date and time.");
      return;
    }
    formData.append("dateTime", dateTimeVal);

    if (selectedFiles) {
      Array.from(selectedFiles).forEach((file) => {
        formData.append("files", file);
      });
    }

    try {
      await fetch("/send-message", {
        method: "POST",
        body: formData,
      });
    } catch (err) {
      alert(err);
    }
  };

  const handleDateSelect = async (date: Date) => {
    setDateTimeVal(date.toISOString());
  };

  return (
    <section className="flex p-5 gap-5 h-dvh">
      <section className="flex flex-col text-base w-1/2 gap-2 h-full">
        <Textarea
          className="resize-none text-base md:text-base h-full"
          value={txtAreaVal}
          onChange={handleTextChange}
          placeholder="Enter your message here."
          name="raw-message"
        ></Textarea>
        <Input
          type="file"
          accept=".png, .jpeg, .jpg"
          multiple
          onChange={handleFileChange}
        />
        <Button className="w-full" onClick={sendMessage}>
          Send message
        </Button>
      </section>
      <section className="flex flex-col w-1/2 gap-2">
        <MarkdownPreview value={txtAreaVal} />
        <DateTimePicker onDateChange={handleDateSelect}></DateTimePicker>
      </section>
    </section>
  );
}
