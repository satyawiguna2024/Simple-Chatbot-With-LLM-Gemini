"use client";
import { useState } from "react";

type MessageTypes = {
  role: "user" | "assistant";
  content: string;
};

export function useChat() {
  const [input, setInput] = useState(""); // input textarea
  const [messages, setMessages] = useState<MessageTypes[]>([]); // semua chat
  const [isPending, setIsPending] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  // kirim pesan
  const handleSend = async () => {
    if (!input.trim()) return;
    if (isPending) return;

    const userMessage: MessageTypes = {
      role: "user",
      content: input,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");

    setIsPending(true);
    setIsThinking(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Invalid send a message");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      let assistantStarted = false;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        if (!chunk) continue;

        assistantContent += chunk;

        if (!assistantStarted) {
          assistantStarted = true;
          setIsThinking(false);
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: assistantContent },
          ]);
          continue;
        }

        setMessages((prev) => {
          if (!prev.length) return prev;
          const lastIndex = prev.length - 1;
          const lastMessage = prev[lastIndex];
          if (lastMessage.role !== "assistant") return prev;

          const next = [...prev];
          next[lastIndex] = {
            ...lastMessage,
            content: assistantContent,
          };
          return next;
        });
      }

      if (!assistantStarted) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Saya tidak menemukan informasi tersebut." },
        ]);
      }
    } catch (error) {
      console.error("Error in handleSend: ", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Maaf, terjadi kesalahan. Coba lagi." },
      ]);
    } finally {
      setIsThinking(false);
      setIsPending(false);
    }
  };

  return {
    input,
    setInput,
    messages,
    handleSend,
    isPending,
    isThinking,
  };
}