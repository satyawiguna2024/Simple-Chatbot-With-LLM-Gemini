"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

type MessageTypes = {
  role: "user" | "assistant";
  content: string;
};

export function useChat() {
  const [input, setInput] = useState(""); // input textarea
  const [messages, setMessages] = useState<MessageTypes[]>([]); // semua chat

  const { mutate, isPending } = useMutation({
    mutationFn: async (messages: MessageTypes[]) => {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid send a message");
      }

      return response.json();
    },

    onSuccess: (data) => {
      // append response AI
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: data.content,
      }]);
    },
  });

  // kirim pesan
  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: MessageTypes = {
      role: "user",
      content: input,
    };

    // append user chat dulu
    setMessages((prev) => [...prev, userMessage]);

    // kirim ke API
    mutate([...messages, userMessage]);

    // reset input
    setInput("");
  };

  return {
    input,
    setInput,
    messages,
    handleSend,
    isPending,
  };
}