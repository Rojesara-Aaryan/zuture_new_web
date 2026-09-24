import Chrome from "@/components/Chrome";

/**
 * The site pages share one persistent shell. The policy pages sit outside this
 * group deliberately — they carry their own stripped-back header and must not
 * inherit the intro, the progress rule or the marketing footer.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <Chrome>{children}</Chrome>;
}
