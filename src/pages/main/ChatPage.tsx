import {
  FileText,
  MessageSquare,
  Paperclip,
  Plus,
  Send,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";

interface HistoryItem {
  title: string;
  time: string;
}

interface Message {
  role: "assistant" | "user";
  text: string;
}

const HISTORY: HistoryItem[] = [
  { title: "Should I learn Rust or Go?", time: "2h ago" },
  { title: "Review my GitHub portfolio", time: "Yesterday" },
  { title: "Roadmap for ML internships", time: "2d ago" },
  { title: "Best React state management", time: "1w ago" },
  { title: "How to ace system design", time: "2w ago" },
];

const SUGGESTIONS: string[] = [
  "Analyze my GitHub and suggest projects",
  "Build me a 12-week ML roadmap",
  "Review my CV for FAANG roles",
  "What skill should I learn next?",
];

export default function ChatPage() {
  const [input, setInput] = useState<string>("");
  const [messages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hey Alex 👋 I've reviewed your GitHub and last semester's transcript. You're strong in React and Node, but your DSA practice is light and you've never shipped a deployed full-stack project. Want me to build you a 6-week sprint?",
    },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    // TODO: wire up to real send logic
    setInput("");
  };

  return (
    <div className="flex-1 min-h-0 p-4">
      <div className="h-full flex min-h-0 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Chat history panel */}
        <div className="w-72 shrink-0 border-r border-gray-200 flex flex-col">
          <div className="p-4">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition-colors text-white text-sm font-medium rounded-lg py-2.5"
            >
              <Plus className="w-4 h-4" />
              New chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <p className="text-[11px] font-medium text-gray-400 mb-2 tracking-wide">
              History
            </p>
            <div className="flex flex-col gap-0.5">
              {HISTORY.map((h) => (
                <button
                  key={h.title}
                  type="button"
                  className="flex items-start gap-2 px-2 py-2.5 rounded-lg hover:bg-gray-50 text-left transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <span className="min-w-0">
                    <span className="block text-sm text-gray-800 truncate">
                      {h.title}
                    </span>
                    <span className="block text-xs text-gray-400">{h.time}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Conversation */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Conversation header */}
          <div className="h-14 shrink-0 flex items-center justify-between px-6 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-medium text-gray-900">EduMap Mentor</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Online · GPT-5
                </p>
              </div>
            </div>
            <span className="text-xs text-gray-500 bg-gray-100 border border-gray-200 rounded-full px-2.5 py-1">
              Context loaded
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="flex flex-col gap-4 max-w-3xl">
              {messages.map((m, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 shrink-0 rounded-full bg-gray-900 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 text-[15px] leading-relaxed text-gray-800">
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggestions + input */}
          <div className="shrink-0 px-6 pb-5 pt-2 border-t border-gray-100">
            <div className="flex flex-wrap gap-2 mb-3">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setInput(s)}
                  className="text-sm text-gray-700 bg-white border border-gray-200 rounded-full px-3.5 py-1.5 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 mb-2 px-1">
              <button
                type="button"
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Paperclip className="w-3.5 h-3.5" />
                CV
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                Transcript
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FaGithub className="w-3.5 h-3.5" />
                GitHub URL
              </button>
            </div>

            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-2.5 bg-white focus-within:border-gray-300">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                type="text"
                placeholder="Ask anything about your career..."
                className="flex-1 outline-none text-sm text-gray-800 placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={handleSend}
                className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}