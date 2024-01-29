import { z } from "zod";

const SearchRequestSchema = z.object({
  query: z.string(),
});

type SearchResponse = {};

export async function POST(request: Request) {
  const data = await request.json();
  const { query } = SearchRequestSchema.parse(data);

  // TODO how to handle, I want to see all austins related to surfing?

  // generate embedding for the query

  // query all participants for the embedding

  // sort by distance

  // return top 10
}
