"use client"
import PeriodeMonarki from "@/components/sections/PeriodeMonarki";
import PeriodePrasejarah from "@/components/sections/PeriodePrasejarah";
import Modal from "@/components/ui/Modal";
import { useState } from "react";
import { SendHorizontal, X } from "lucide-react";
import { useChat } from "@/hooks/useChat";

export default function Home() {
  const [open, setOpen] = useState(false);
  const { input, setInput, messages, handleSend, isPending, isThinking } = useChat();

  return (
    <>
      {/* title */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl text-gray-800 border-b border-gray-400 pb-2 font-semibold">Sejarah Indonesia</h1>

        <PeriodePrasejarah />
        <br />
        <hr />
        <PeriodeMonarki />
      </div>

      <Modal
        open={open}
        setOpen={setOpen}
        labelButton="Ask with AI"
      >
        {/* Wrapper */}
        <div className="flex flex-col h-[75vh] max-h-175">
          {/* Header */}
          <div className="border-b border-default pb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-title">
                Ask with AI
              </h2>

              <p className="text-sm text-body mt-1">
                Chat with AI assistant about this article.
              </p>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-default-100 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto py-5 space-y-5 pr-2">
            {/* AI Message */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-brand text-white flex items-center justify-center text-sm font-semibold shrink-0">
                AI
              </div>

              <div className="bg-default-100 border border-default rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                <p className="text-sm leading-relaxed text-body">
                  Hello 👋 How can I help you with this article?
                </p>
              </div>
            </div>

            {messages.map((chats, index) => (
              chats.role === "user" ? (
                <div key={index} className="flex items-start gap-3 justify-end">
                  <div className="border text-gray-800 rounded-2xl rounded-tr-md px-4 py-3 max-w-[85%]">
                    <p className="text-sm leading-relaxed">
                      {chats.content}
                    </p>
                  </div>

                  <div className="w-9 h-9 rounded-full bg-gray-800 text-gray-50 flex items-center justify-center text-sm font-semibold shrink-0">
                    You
                  </div>
                </div>
              ) : (
                <div key={index} className="flex items-start gap-3" >
                  <div className="w-9 h-9 rounded-full bg-gray-800 text-gray-50 flex items-center justify-center text-sm font-semibold shrink-0">
                    AI
                  </div>

                  <div className="bg-default-100 border border-default rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                    <p className="text-sm leading-relaxed text-body">
                      {chats.content}
                    </p>
                  </div>
                </div>
              )))}

            {isThinking && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-800 text-gray-50 flex items-center justify-center text-sm font-semibold shrink-0">
                  AI
                </div>

                <div className="bg-default-100 border border-default rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                  <p className="text-sm leading-relaxed text-body animate-pulse">
                    Thinking...
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Input */}
          <div className="border-t border-default pt-4">
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}>
              <div className="relative">
                <textarea
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  required
                  placeholder="you can ask about this article only!"
                  className=" w-full resize-none rounded-2xl border border-default bg-transparent pl-4 pr-16 py-3 text-sm leading-6 focus:outline-none focus:ring-2 focus:ring-brand-medium max-h-40 overflow-y-auto"
                />
                <button
                  type="submit"
                  disabled={isPending}
                  className={`absolute right-3 bottom-3 text-white rounded-xl px-3 py-2 text-sm font-medium
                              ${isPending ? "cursor-not-allowed bg-gray-600" : "bg-gray-800 hover:bg-gray-700 "}
                            `}
                >
                  <SendHorizontal size={20} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal >
    </>
  );
}