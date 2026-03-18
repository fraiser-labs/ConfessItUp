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

const MAX_WORDS = 250;

const getWordCount = (text: string) => {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
};

function normalizeCityName(city: string) {
  return city
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function CityPage() {
  const { city } = useParams() as { city: string };
  const displayCity = normalizeCityName(city);
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
      const normalizedCity = normalizeCityName(city);
      const cityData = await getCityByName(normalizedCity);
      if (cityData) setCityId(cityData.id);
      const data = await getConfessionsByCity(normalizedCity);
      setConfessions(data);
      setLoading(false);
    }
    load();
  }, [city]);

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
    const normalizedCity = normalizeCityName(city);
    const data = await getConfessionsByCity(normalizedCity);
    setConfessions(data);
    setSubmitting(false);
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 py-10">
      {/* Pink gradient top */}
      <div className="fixed top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-pink-500/10 to-transparent pointer-events-none z-0" />

      {/* Dot pattern */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ffffff15 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-neutral-500 hover:text-pink-400 transition-colors mb-8 text-sm"
        >
          <ArrowLeft size={14} />
          Back to cities
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold">{displayCity}</h1>
            <p className="text-neutral-500 text-sm mt-1">
              Anonymous confessions from your city
            </p>
          </div>
          <Dialog
            open={open}
            onOpenChange={(val) => {
              setOpen(val);
              setShowEmoji(false);
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-pink-500 hover:bg-pink-600 text-white border-none px-5 rounded-xl">
                + Confess
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-neutral-900 border-neutral-800 text-white sm:max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  🤫 Post a Confession
                </DialogTitle>
                <p className="text-neutral-500 text-sm">
                  {"100% anonymous. No one knows it's you."}
                </p>
              </DialogHeader>

              <div className="relative mt-2">
                <Textarea
                  placeholder="What's on your mind? Spill it... 👀"
                  className="bg-neutral-800 border-neutral-700 text-white resize-none min-h-[180px] text-base leading-relaxed pr-4 break-all overflow-hidden"
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

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2 relative">
                  <button
                    onClick={() => setShowEmoji((prev) => !prev)}
                    className="text-neutral-400 hover:text-white text-xl transition-colors p-1 rounded-md hover:bg-neutral-800"
                    title="Add emoji"
                  >
                    😄
                  </button>
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
                <Button
                  onClick={handleSubmit}
                  disabled={submitting || !content.trim()}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-6 rounded-xl"
                >
                  {submitting ? "Posting..." : "Confess 🤫"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Feed */}
        {loading && (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 animate-pulse"
              >
                <div className="h-4 bg-neutral-800 rounded w-3/4 mb-3" />
                <div className="h-4 bg-neutral-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {!loading && confessions.length === 0 && (
          <div className="text-center mt-24">
            <p className="text-4xl mb-4">🤫</p>
            <p className="text-neutral-400 font-medium">
              No confessions yet in {displayCity}.
            </p>
            <p className="text-neutral-600 text-sm mt-2">
              Be the first to spill the tea 👀
            </p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {confessions.map((confession) => (
            <div
              key={confession.id}
              onClick={() => router.push(`/confession/${confession.id}`)}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 cursor-pointer hover:border-pink-500/40 hover:bg-neutral-800/50 transition-all group"
            >
              {/* Anonymous badge */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-full bg-neutral-800 group-hover:bg-pink-500/20 transition-colors flex items-center justify-center text-xs">
                  🤫
                </div>
                <span className="text-neutral-500 text-xs">Anonymous</span>
              </div>

              <p className="text-white text-sm leading-relaxed">
                {confession.content}
              </p>

              <div className="flex items-center justify-between mt-5 pt-4 border-t border-neutral-800">
                <span className="text-neutral-600 text-xs">
                  {formatDistanceToNow(new Date(confession.created_at), {
                    addSuffix: true,
                  })}
                </span>
                <span className="text-neutral-500 text-xs flex items-center gap-1 group-hover:text-pink-400 transition-colors">
                  ❤️ {confession.like_count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
