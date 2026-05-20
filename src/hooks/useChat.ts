/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

type MessageTypes = {
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
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
        const errorData = await response.json().catch(() => ({}));
        const error = new Error("API Error") as any;
        error.status = response.status;
        error.data = errorData;
        throw error;
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
    onError: (err: any) => {
      // pesan error default
      let errorMessage = "Terjadi kesalahan. Silakan coba lagi.";
      if (err.status === 500) {
        errorMessage = "Kuota API habis. Silakan coba lagi besok!";
      }

      // tampilkan sebagai bubble chat AI dengan flag isError
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: errorMessage,
        isError: true,
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