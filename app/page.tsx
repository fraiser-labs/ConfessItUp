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

const FLOATING_CONFESSIONS = [
  "😭 I told my boss I had a family emergency. I was watching Netflix.",
  "💀 I've been faking being busy for 3 years straight.",
  "🤫 I googled my own name hoping someone said something nice.",
  "😂 I laugh at my teacher's jokes. They're not funny. At all.",
  "🥲 I pretend to be confident online. Offline I'm a mess.",
  "💅 I dress up just to sit alone in my room and feel good.",
  "😳 I memorized her schedule just to accidentally run into her.",
  "🎭 I have two personalities. My family knows neither.",
  "🤡 I still sleep with the lights on. I'm 22.",
  "💔 I said I was over it. I replay the conversation daily.",
  "😴 I skipped 40 classes and somehow passed. Don't ask how.",
  "🔥 I quit my job in my head every single day.",
  "👀 I check my ex's location. We ended 2 years ago.",
  "😬 I've been 'almost done' with this project for 6 months.",
  "🙃 I told everyone I was thriving. I was barely surviving.",
];

function FloatingCard({
  text,
  style,
}: {
  text: string;
  style: React.CSSProperties;
}) {
  return (
    <div
      className="absolute bg-neutral-900/70 border border-neutral-800/60 rounded-2xl p-5 max-w-[240px] backdrop-blur-sm pointer-events-none select-none"
      style={style}
    >
      <p className="text-neutral-300 text-sm leading-relaxed">{text}</p>
    </div>
  );
}

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

  const floatingCards = [
    {
      text: FLOATING_CONFESSIONS[0],
      style: {
        top: "6%",
        left: "2%",
        transform: "rotate(-3deg)",
        opacity: 0.85,
      },
    },
    {
      text: FLOATING_CONFESSIONS[1],
      style: {
        top: "12%",
        right: "3%",
        transform: "rotate(2deg)",
        opacity: 0.75,
      },
    },
    {
      text: FLOATING_CONFESSIONS[2],
      style: {
        top: "38%",
        left: "1%",
        transform: "rotate(-2deg)",
        opacity: 0.65,
      },
    },
    {
      text: FLOATING_CONFESSIONS[3],
      style: {
        top: "52%",
        right: "2%",
        transform: "rotate(3deg)",
        opacity: 0.75,
      },
    },
    {
      text: FLOATING_CONFESSIONS[4],
      style: {
        bottom: "18%",
        left: "3%",
        transform: "rotate(2deg)",
        opacity: 0.65,
      },
    },
    {
      text: FLOATING_CONFESSIONS[5],
      style: {
        bottom: "8%",
        right: "2%",
        transform: "rotate(-2deg)",
        opacity: 0.8,
      },
    },
    {
      text: FLOATING_CONFESSIONS[6],
      style: {
        top: "70%",
        left: "1%",
        transform: "rotate(-1deg)",
        opacity: 0.55,
      },
    },
    {
      text: FLOATING_CONFESSIONS[7],
      style: {
        top: "28%",
        right: "2%",
        transform: "rotate(-3deg)",
        opacity: 0.6,
      },
    },
  ];

  return (
    <main className="relative bg-black text-white flex flex-col items-center px-4 overflow-hidden">
      {/* Floating background cards - desktop only */}
      {floatingCards.map((card, i) => (
        <FloatingCard key={i} text={card.text} style={card.style} />
      ))}

      {/* Pink glow */}
      <div className="absolute top-1/3 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center w-full min-h-screen justify-center">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold tracking-tight">
            Confess<span className="text-pink-500">It</span>Up
          </h1>
          <p className="text-neutral-400 mt-3 text-lg">
            Secrets your city never said out loud.
          </p>
        </div>

        {/* Command Search */}
        <div className="w-full max-w-md">
          <Command className="rounded-2xl border border-neutral-700 bg-neutral-950 shadow-xl shadow-pink-500/5">
            <CommandInput
              placeholder="Search your city..."
              className="text-white placeholder:text-neutral-500 text-base py-3"
            />
            <CommandList className="bg-neutral-950">
              {loading && (
                <CommandEmpty className="text-neutral-500">
                  Loading cities...
                </CommandEmpty>
              )}
              {!loading && cities.length === 0 && (
                <CommandEmpty className="text-neutral-500">
                  No city found.
                </CommandEmpty>
              )}
              <CommandGroup
                heading="Cities"
                className="text-neutral-500 text-xs uppercase tracking-widest"
              >
                {cities.map((city) => (
                  <CommandItem
                    key={city.id}
                    value={city.name}
                    onSelect={() =>
                      router.push(
                        `/${city.name.toLowerCase().replace(/\s+/g, "-")}`,
                      )
                    }
                    className="text-white hover:bg-pink-500/20 data-[selected=true]:bg-pink-500/20 data-[selected=true]:text-pink-400 cursor-pointer rounded-xl mx-1 my-0.5 transition-colors"
                  >
                    {city.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </div>

      {/* Feature Cards Section */}
      <div className="relative z-10 w-full max-w-5xl px-4 pb-20">
        <h2 className="text-center text-2xl font-bold text-white mb-10">
          Why <span className="text-pink-500">ConfessItUp?</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-900 border border-neutral-800 hover:border-pink-500/40 transition-all rounded-2xl p-8 flex flex-col gap-5">
            <div className="w-14 h-14 bg-pink-500/10 border border-pink-500/20 rounded-2xl flex items-center justify-center text-3xl">
              🤫
            </div>
            <div>
              <h3 className="text-white font-bold text-xl">Fully Anonymous</h3>
              <p className="text-neutral-500 text-sm mt-3 leading-relaxed">
                No account. No name. No trace. Just you and your confession —
                the way it should be. Your secrets stay yours.
              </p>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 hover:border-pink-500/40 transition-all rounded-2xl p-8 flex flex-col gap-5">
            <div className="w-14 h-14 bg-pink-500/10 border border-pink-500/20 rounded-2xl flex items-center justify-center text-3xl">
              🏙️
            </div>
            <div>
              <h3 className="text-white font-bold text-xl">Your City</h3>
              <p className="text-neutral-500 text-sm mt-3 leading-relaxed">
                Every city has secrets. Search yours and discover what your
                neighbors are really thinking behind closed doors.
              </p>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 hover:border-pink-500/40 transition-all rounded-2xl p-8 flex flex-col gap-5">
            <div className="w-14 h-14 bg-pink-500/10 border border-pink-500/20 rounded-2xl flex items-center justify-center text-3xl">
              ❤️
            </div>
            <div>
              <h3 className="text-white font-bold text-xl">React & Relate</h3>
              <p className="text-neutral-500 text-sm mt-3 leading-relaxed">
                Like the confessions that hit too close to home. Because
                sometimes knowing you&apos;re not alone is enough.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-neutral-900 px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="text-white font-bold text-lg">
              Confess<span className="text-pink-500">It</span>Up
            </span>
            <span className="text-neutral-600 text-xs">
              Secrets your city never said out loud.
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-neutral-600 text-xs hover:text-neutral-400 cursor-pointer transition-colors">
              Privacy
            </span>
            <span className="text-neutral-600 text-xs hover:text-neutral-400 cursor-pointer transition-colors">
              Terms
            </span>
            <span className="text-neutral-600 text-xs hover:text-neutral-400 cursor-pointer transition-colors">
              Contact
            </span>
          </div>
          <p className="text-neutral-700 text-xs">
            made with <span className="text-pink-500">♥</span> by M Faisal
          </p>
        </div>
      </footer>
    </main>
  );
}
