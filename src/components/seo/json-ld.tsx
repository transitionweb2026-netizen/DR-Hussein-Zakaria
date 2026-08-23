/** Renders a JSON-LD structured-data <script> tag. Per Next.js's own
 * guidance (node_modules/next/dist/docs/01-app/02-guides/json-ld.md),
 * JSON.stringify alone doesn't sanitize against XSS if the payload embeds
 * untrusted strings (here: admin-entered CMS content like FAQ answers) --
 * escaping "<" to its unicode equivalent closes that off. A plain <script>
 * tag is correct here, not next/script, since this is inert data for
 * crawlers, not executable code. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
