"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { getConfessionsByCity, createConfession } from "@/lib/confessions";
import { getCityByName } from "@/lib/city";
import { ArrowLeft } from "lucide-react";

import { formatDistanceToNow } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import EmojiPicker, { Theme } from "emoji-picker-react";

type Confession = {
  id: string;
  content: string;
  like_count: number;
  created_at: string;
  city_id: string;
  cities: { name: string };
};

const MAX_WORDS = 100;

const getWordCount = (text: string) => {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
};

export default function CityPage() {
  const { city } = useParams() as { city: string };
  const router = useRouter();
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cityId, setCityId] = useState<string | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const emojiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      const cityData = await getCityByName(city);
      if (cityData) setCityId(cityData.id);
      const data = await getConfessionsByCity(city);
      setConfessions(data);
      setLoading(false);
    }
    load();
  }, [city]);
  // close emoji picker when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setShowEmoji(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSubmit() {
    const words = getWordCount(content);
    if (!content.trim() || !cityId || words > MAX_WORDS) return;

    setSubmitting(true);
    await createConfession(cityId, content.trim());
    setContent("");
    setOpen(false);
    setShowEmoji(false);
    const data = await getConfessionsByCity(city);
    setConfessions(data);
    setSubmitting(false);
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 py-10 max-w-6xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to cities
      </button>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold capitalize">{city}</h1>
          <p className="text-neutral-400 text-sm">Anonymous confessions</p>
        </div>
        <Dialog
          open={open}
          onOpenChange={(val) => {
            setOpen(val);
            setShowEmoji(false);
          }}
        >
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="border-neutral-700 text-white bg-transparent hover:bg-neutral-800"
            >
              + Confess
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-neutral-900 border-neutral-800 text-white sm:max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto ">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                🤫 Post a Confession
              </DialogTitle>
              <p className="text-neutral-500 text-sm">
                {
                  "100% anonymous. No one knows it's you. Unless you choose to share your name."
                }
              </p>
            </DialogHeader>

            {/* Textarea */}
            <div className="relative mt-2">
              <Textarea
                placeholder="What's on your mind? Spill it... 👀"
                className="bg-neutral-800 border-neutral-700 text-white resize-none min-h-[180px] text-base leading-relaxed pr-4 break-all overflow-hidden
    "
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <p className="text-neutral-600 text-xs text-right mt-1">
                {getWordCount(content)}/{MAX_WORDS} words
              </p>
              {getWordCount(content) > MAX_WORDS && (
                <p className="text-red-500 text-xs mt-1">
                  You have exceeded the {MAX_WORDS} word limit!
                </p>
              )}
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2 relative">
                {/* Emoji Button */}
                <button
                  onClick={() => setShowEmoji((prev) => !prev)}
                  className="text-neutral-400 hover:text-white text-xl transition-colors p-1 rounded-md hover:bg-neutral-800"
                  title="Add emoji"
                >
                  😄
                </button>

                {/* Emoji Picker */}
                {showEmoji && (
                  <div
                    ref={emojiRef}
                    className="absolute bottom-10 left-0 z-50"
                  >
                    <EmojiPicker
                      theme={Theme.DARK}
                      onEmojiClick={(emojiData) => {
                        setContent((prev) => prev + emojiData.emoji);
                        setShowEmoji(false);
                      }}
                      height={350}
                      width={300}
                    />
                  </div>
                )}
              </div>

              {/* Submit */}
              <Button
                onClick={handleSubmit}
                disabled={submitting || !content.trim()}
                className="bg-white text-black hover:bg-neutral-200 px-6"
              >
                {submitting ? "Posting..." : "Confess"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Feed */}
      {loading && (
        <div className="text-neutral-500 text-center mt-20">
          Loading confessions...
        </div>
      )}

      {!loading && confessions.length === 0 && (
        <div className="text-center mt-20">
          <p className="text-neutral-500">No confessions yet in {city}.</p>
          <p className="text-neutral-600 text-sm mt-1">
            Be the first to confess 👀
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {confessions.map((confession) => (
          <div
            key={confession.id}
            onClick={() => router.push(`/confession/${confession.id}`)}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 cursor-pointer hover:border-neutral-600 transition-all"
          >
            <p className="text-white text-sm leading-relaxed">
              {confession.content}
            </p>
            <div className="flex items-center justify-between mt-4">
              <span className="text-neutral-500 text-xs">
                {formatDistanceToNow(new Date(confession.created_at), {
                  addSuffix: true,
                })}
              </span>
              <span className="text-neutral-500 text-xs">
                ❤️ {confession.like_count}
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
