/**
 * Structured data, rendered as a plain script tag.
 *
 * Next's JSON-LD guide recommends a native <script> rather than next/script,
 * since this is data, not code. JSON.stringify does not escape "<", so it is
 * replaced with its unicode escape to keep a stray "</script>" in any string
 * from closing the tag early.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\u003c") }}
    />
  );
}
