"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { getCities } from "@/lib/city";

type City = {
  id: number;
  name: string;
};

export default function Page() {
  const router = useRouter();
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCities() {
      const data = await getCities();
      setCities(data);
      setLoading(false);
    }
    loadCities();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      {/* App Title */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight">ConfessItUp</h1>
        <p className="text-neutral-400 mt-2 text-sm">
          Anonymous confessions from your city.
        </p>
      </div>

      {/* City Search */}
      <div className="w-full max-w-md">
        <Command className="rounded-lg border border-neutral-800 bg-neutral-900">
          <CommandInput placeholder="Search your city..." />

          <CommandList>
            {loading && <CommandEmpty>Loading cities...</CommandEmpty>}

            {!loading && cities.length === 0 && (
              <CommandEmpty>No city found.</CommandEmpty>
            )}

            <CommandGroup heading="Cities">
              {cities.map((city) => (
                <CommandItem
                  key={city.id}
                  value={city.name}
                  onSelect={() => router.push(`/${city.name.toLowerCase()}`)}
                >
                  {city.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </main>
  );
}
