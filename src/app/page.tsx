import Entry from "@/components/Entry";
import EntryTypeSelector from "@/components/EntryTypeSelector";
import Search from "@/components/Search";
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
  distance: z.number().optional(),
});

export type BurritoEntry = z.infer<typeof BurritoEntrySchema>;

const BurritoEntriesSchema = z.array(BurritoEntrySchema);

export type BurritoPeerEntry = {
  entry: BurritoEntry;
  peer: BurritoPeer;
};

const fetchLatestBurritos = async (type?: string) => {
  // query:
  // "Get me the most recent 10 posts with the title, type, created date in UNIX timestamp, summary, hash, description, and location.",

  const query =
    type && type !== "all"
      ? `Get me the latest 10 posts of type ${type} with the title, type, created date in UNIX timestamp, summary, hash, description, and location. Sort by date`
      : "Get me the latest 10 posts with the title, type, created date in UNIX timestamp, summary, hash, description, and location. Sort by date.";
  const rawBurritos = await Promise.all(
    PEERS.map((peer) =>
      fetch(`${peer.url}/query/data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuth(peer.name)}`,
        },
        body: JSON.stringify({
          query,
        }),
        next: { revalidate: 300 },
      })
        .then((r) => r.json())
        .then((d) => BurritoEntriesSchema.parse(d))
        .then((d): BurritoPeerEntry[] => d.map((e) => ({ entry: e, peer })))
        .catch((e) => {
          console.error(`error for peer ${peer.name} for query ${query}`, e);
          return null;
        })
    )
  );

  const burritos = rawBurritos
    .flat()
    .filter((b) => b !== null) as BurritoPeerEntry[];

  return burritos.sort((a, b) => b.entry.created - a.entry.created);
};

const fetchSimilarBurritos = async (query: string, filter?: string) => {
  const rawBurritos = await Promise.all(
    PEERS.map((peer) =>
      fetch(`${peer.url}/query/embeddings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuth(peer.name)}`,
        },
        body: JSON.stringify({
          queries: [query],
          num: 5,
        }),
        next: { revalidate: 0 },
      })
        .then((r) => r.json())
        // .then((d) => BurritoEntriesSchema.parse(d))
        .then((d): BurritoPeerEntry[] =>
          d.map((e: any) => ({ entry: e, peer }))
        )
        .catch((e) => {
          console.error(`error for peer ${peer.name}`, e);
          return null;
        })
    )
  );

  const peerBurritos = rawBurritos
    .flat()
    .filter((b) => b !== null)
    .filter((b) => (filter ? b.entry.type === filter : true))
    .sort((a, b) => a.entry.distance - b.entry.distance) as BurritoPeerEntry[];

  const mostSimilar = peerBurritos[0];
  const burritos = peerBurritos.filter((b) => {
    const similarityGap = b.entry.distance - mostSimilar.entry.distance;
    console.log(similarityGap);
    if (similarityGap < 0.05) {
      return true;
    } else {
      return false;
    }
  });
  // .sort((a, b) => b.entry.created - a.entry.created);

  // console.log(burritos);
  return burritos;
};

// TODO add search?
// TODO add list of participants

export default async function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const type = searchParams?.type as string;
  const burritos = searchParams?.query
    ? await fetchSimilarBurritos(
        searchParams.query as string,
        type ? (type as string) : undefined
      )
    : await fetchLatestBurritos(type);
  console.log(burritos.length);

  return (
    <main className="flex flex-col w-full items-center p-8">
      <div className="flex flex-col max-w-2xl gap-8 items-center">
        <Link href="/">
          <img src="/header.svg" className="h-24" />
        </Link>

        <div className="flex flex-col gap-4 w-2/3 p-4 shadow-lg bg-white rounded-2xl">
          <EntryTypeSelector selected={type ? type : "all"} />
          <Search />
        </div>

        <div className="flex flex-col gap-28 pt-8">
          {burritos.map((burrito, i) => (
            <Entry key={i} entry={burrito.entry} peer={burrito.peer} />
          ))}
        </div>
      </div>
    </main>
  );
}
