import { supabase } from "./supabase";

export async function getCities() {
  const { data, error } = await supabase
    .from("cities")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
}
