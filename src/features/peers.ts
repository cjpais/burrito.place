// TODO need to add secret?
// TODO allow data query endpoint without secret?

export type BurritoPeer = {
  name: string;
  display: string;
  url: string;
  // token: string;
};

const PEER_NAMES = [
  "alex",
  "austin",
  "baylynne",
  "caroline",
  "chandler",
  "dham",
  "gorum",
  "jon",
  "jordan",
  "kevin",
  "kristen",
  "psql",
  "cj",
];

export const PEERS: BurritoPeer[] = PEER_NAMES.map((name) => ({
  name,
  display: `${name}.burrito`,
  url: `https://${name}.burrito.place`,
}));

// THIS IS ATROCIOUS
export const getAuth = (peer: string) => {
  const peersAuth = process.env.PEERS_AUTH;
  if (!peersAuth) throw new Error("PEERS_AUTH not set");

  try {
    const json = JSON.parse(peersAuth);
    return json[peer];
  } catch (e) {
    throw new Error("PEERS_AUTH is not valid JSON");
  }
};
