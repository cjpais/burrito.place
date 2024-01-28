import Entry from "@/components/Entry";
import { BurritoPeer, PEERS, getAuth } from "@/features/peers";
import Link from "next/link";
import { z } from "zod";

const BurritoEntrySchema = z.object({
  hash: z.string(),
  title: z.string(),
  type: z.string(),
  created: z.number(),
  summary: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
});

export type BurritoEntry = z.infer<typeof BurritoEntrySchema>;

const BurritoEntriesSchema = z.array(BurritoEntrySchema);

export type BurritoPeerEntry = {
  entry: BurritoEntry;
  peer: BurritoPeer;
};

const fetchLatestBurritos = async () => {
  const rawBurritos = await Promise.all(
    PEERS.map((peer) =>
      fetch(`${peer.url}/query/data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuth(peer.name)}`,
        },
        body: JSON.stringify({
          query:
            "Get me the most recent 10 posts with the title, type, created date in UNIX timestamp, summary, hash, description, and location.",
        }),
        next: { revalidate: 300 },
      })
        .then((r) => r.json())
        .then((d) => BurritoEntriesSchema.parse(d))
        .then((d): BurritoPeerEntry[] => d.map((e) => ({ entry: e, peer })))
        .catch((e) => {
          console.error(`error for peer ${peer.name}`, e);
          return null;
        })
    )
  );

  const burritos = rawBurritos
    .flat()
    .filter((b) => b !== null) as BurritoPeerEntry[];

  return burritos.sort((a, b) => b.entry.created - a.entry.created);
};

// TODO add search?
// TODO add list of participants

export default async function Home() {
  const burritos = await fetchLatestBurritos();
  console.log(burritos.length);

  return (
    <main className="flex flex-col w-full items-center p-8">
      <div className="flex flex-col max-w-2xl gap-8 items-center">
        <Link href="/">
          <img src="/header.svg" className="h-24" />
        </Link>

        <div className="flex flex-col gap-28 pt-8">
          {burritos.map((burrito, i) => (
            <Entry key={i} entry={burrito.entry} peer={burrito.peer} />
          ))}
        </div>
      </div>
    </main>
  );
}
