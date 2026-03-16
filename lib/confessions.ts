import { supabase } from "./supabase";

// GET all confessions for a city
export async function getConfessionsByCity(cityName: string) {
  // First get city id from name
  const { data: city, error: cityError } = await supabase
    .from("cities")
    .select("id")
    .ilike("name", cityName)
    .single();

  if (cityError || !city) return [];

  // Then get confessions by city_id
  const { data, error } = await supabase
    .from("confessions")
    .select("*, cities(name)")
    .eq("city_id", city.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// GET single confession by id
export async function getConfessionById(id: string) {
  const { data, error } = await supabase
    .from("confessions")
    .select("*, cities(name)")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

// CREATE confession
export async function createConfession(cityId: string, content: string) {
  const { data, error } = await supabase
    .from("confessions")
    .insert({ city_id: cityId, content })
    .select()
    .single();

  if (error) throw error;
  return data;
}
