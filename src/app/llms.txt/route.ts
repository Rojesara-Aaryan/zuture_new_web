import { llmsIndex } from "@/lib/llms";

/**
 * /llms.txt — the site, summarised for language models (see lib/llms.ts).
 * Static: built once per deploy from the same data the pages render.
 */
export const dynamic = "force-static";

export function GET() {
  return new Response(llmsIndex(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
