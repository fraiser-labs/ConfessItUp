import { supabase } from "./supabase";

// like a confession
export async function likeConfession(
  confessionId: string,
  userFingerprint: string,
) {
  const { error } = await supabase
    .from("likes")
    .insert({ confession_id: confessionId, user_fingerprint: userFingerprint });

  if (error) {
    // unique constraint violation = already liked
    if (error.code === "23505") return { alreadyLiked: true };
    throw error;
  }

  // increment like_count on confession
  await supabase.rpc("increment_like_count", { confession_id: confessionId });

  return { alreadyLiked: false };
}

// check if user already liked
export async function hasUserLiked(
  confessionId: string,
  userFingerprint: string,
) {
  const { data } = await supabase
    .from("likes")
    .select("id")
    .eq("confession_id", confessionId)
    .eq("user_fingerprint", userFingerprint)
    .single();

  return !!data;
}
