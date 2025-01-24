"use client";

import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/DateTimePicker";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import "./md-preview.css";
import { Input } from "@/components/ui/input";
import { MarkdownPreview } from "@/components/ui/MarkdownPreview";
import toast, { Toaster } from "react-hot-toast";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { LogOut } from "lucide-react";

export default function ControlPanel() {
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
      const response = await fetch("/send-message", {
        method: "POST",
        body: formData,
      });

      const text = await response.text();

      toast.success(text);
    } catch (err) {
      toast.error(err);
    }
  };

  const handleDateSelect = async (date: Date) => {
    setDateTimeVal(date.toISOString());
  };

  return (
    <section className="flex p-5 gap-5 h-dvh">
      <Toaster />
      <div className="flex flex-col">
        <Button className="p-0">
          <LogoutLink className="px-4 py-2">
            <LogOut></LogOut>
          </LogoutLink>
        </Button>
        <div className="mt-5">
          <p>{2000 - txtAreaVal.length}</p>
          <p>chars</p>
          <p>remaining</p>
        </div>
      </div>
      <section className="flex flex-col text-base w-1/2 gap-2 h-full">
        <Textarea
          className="resize-none text-base md:text-base h-full"
          value={txtAreaVal}
          onChange={handleTextChange}
          placeholder="Enter your message here."
          name="raw-message"
          maxLength={2000}
        />
        <p>
          Discord uses Markdown to render it&apos;s messages.{" "}
          <a
            className="underline text-blue-700"
            href="https://www.markdownguide.org/cheat-sheet/"
            target="_blank"
            rel="noreferrer"
          >
            Cheatsheet
          </a>
        </p>
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept=".png, .jpeg, .jpg"
            multiple
            onChange={handleFileChange}
            ref={(input) => {
              if (input && selectedFiles === null) input.value = "";
            }}
          />
          <Button
            onClick={() => {
              setSelectedFiles(null);
            }}
          >
            Clear Images
          </Button>
        </div>
        <Button
          className="w-full"
          onClick={sendMessage}
          disabled={txtAreaVal.length >= 2000}
        >
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
