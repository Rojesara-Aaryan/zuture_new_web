import { llmsFull } from "@/lib/llms";

/**
 * /llms-full.txt — every page of the site as plain text (see lib/llms.ts).
 * Static: built once per deploy from the same data the pages render.
 */
export const dynamic = "force-static";

export function GET() {
  return new Response(llmsFull(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
