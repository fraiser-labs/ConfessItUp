"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getConfessionById } from "@/lib/confessions";
import { likeConfession, hasUserLiked, unlikeConfession } from "@/lib/likes";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft } from "lucide-react";

type Confession = {
  id: string;
  content: string;
  like_count: number;
  created_at: string;
  city_id: string;
  cities: { name: string };
};

function getFingerprint() {
  return navigator.userAgent + "|" + screen.width;
}

export default function ConfessionPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [confession, setConfession] = useState<Confession | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getConfessionById(id);
      setConfession(data);
      setLikeCount(data.like_count);
      const fingerprint = getFingerprint();
      const alreadyLiked = await hasUserLiked(id, fingerprint);
      setLiked(alreadyLiked);
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleLike() {
    if (liking || !confession) return;
    setLiking(true);

    if (liked) {
      await unlikeConfession(id, getFingerprint());
      setLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      const result = await likeConfession(id, getFingerprint());
      if (!result.alreadyLiked) {
        setLiked(true);
        setLikeCount((prev) => prev + 1);
      }
    }

    setLiking(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-neutral-500">Loading confession...</p>
      </main>
    );
  }

  if (!confession) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-neutral-500">Confession not found 👀</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 py-10 max-w-6xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => router.push(`/${confession.cities.name.toLowerCase()}`)}
        className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        Back to {confession.cities.name}
      </button>

      {/* Confession Card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
        {/* Anonymous badge */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-sm">
            🤫
          </div>
          <div>
            <p className="text-sm text-white font-medium">Anonymous</p>
            <p className="text-xs text-neutral-500">
              {formatDistanceToNow(new Date(confession.created_at), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>

        {/* Content */}
        <p className="text-white text-lg leading-relaxed whitespace-pre-wrap">
          {confession.content}
        </p>

        {/* Like button */}
        <div className="flex items-center justify-end mt-8 pt-6 border-t border-neutral-800">
          <Button
            onClick={handleLike}
            disabled={liking}
            variant="outline"
            className={`flex items-center gap-2 border-neutral-700 transition-all ${
              liked
                ? "text-red-500 border-red-500/30 bg-red-500/10 hover:bg-red-500/10"
                : "text-neutral-400 hover:text-white bg-transparent hover:bg-neutral-800"
            }`}
          >
            <Heart size={16} className={liked ? "fill-red-500" : ""} />
            {likeCount} {liked ? "Unlike" : "Like"}
          </Button>
        </div>
      </div>
    </main>
  );
}
