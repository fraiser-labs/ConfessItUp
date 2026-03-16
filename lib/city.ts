import { supabase } from "./supabase";

export async function getCities() {
  const { data, error } = await supabase
    .from("cities")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getCityByName(name: string) {
  const { data, error } = await supabase
    .from("cities")
    .select("id, name")
    .ilike("name", name)
    .single();
  if (error) throw error;
  return data;
}
