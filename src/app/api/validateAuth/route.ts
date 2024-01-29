import { validateAuth } from "@/features/peers";
import { z } from "zod";

const ValidateAuthRequestSchema = z.object({
  token: z.string(),
});

export async function POST(request: Request) {
  const json = await request.json();
  console.log("raw json", json);
  const { token } = ValidateAuthRequestSchema.parse(json);
  console.log("parsed token", token);

  const peer = validateAuth(token);

  return new Response(JSON.stringify({ peer }));
}
