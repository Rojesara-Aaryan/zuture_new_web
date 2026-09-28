/**
 * Reservations, sent from the visitor's browser through EmailJS — exactly how
 * the live zuture.co enquiry form sends, with the same service, the same
 * product-enquiry template and the same template variables, so they land in
 * the same inbox in the same format.
 *
 * An earlier version sent from a server route instead. That needs a private
 * key and EmailJS's "non-browser applications" switch, and until both were set
 * every reservation failed with "That did not go through". Browser sending
 * needs neither, and is already proven by the live site.
 *
 * None of these values is a secret. An EmailJS public key exists to be shipped
 * to browsers (the live site's bundle already carries all three), and abuse is
 * limited in the EmailJS dashboard — Account → Security → allowed domains.
 * Override any of them with NEXT_PUBLIC_EMAILJS_* variables if they change.
 */
const EMAILJS = {
  endpoint: "https://api.emailjs.com/api/v1.0/email/send",
  service: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_j9s90s3",
  template: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_lcz4hsq",
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "4LZl370JAA3y8iFQ2",
};

const MODEL_LABEL: Record<string, string> = {
  "z-active": "Z-ACTIVE (ESP, washable, no consumables)",
  "z-pure": "Z-PURE (H13 HEPA + activated carbon)",
};

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export type Reservation = {
  name: string;
  email: string;
  phone?: string;
  model: string;
  roomSize?: string;
  space?: string;
};

/** Resolves on success; throws with EmailJS's own reason on failure. */
export async function sendReservation(r: Reservation): Promise<void> {
  const name = clean(r.name, 120);
  const [first, ...rest] = name.split(/\s+/);
  const roomSize = clean(r.roomSize, 16);

  const res = await fetch(EMAILJS.endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: EMAILJS.service,
      template_id: EMAILJS.template,
      user_id: EMAILJS.publicKey,
      // The variables the live site's product-enquiry template already uses.
      template_params: {
        selected_model: MODEL_LABEL[r.model] ?? (r.model || "Not chosen"),
        first_name: first,
        last_name: rest.join(" "),
        reply_to: clean(r.email, 254),
        phone: clean(r.phone, 32) || "Not given",
        quantity: "1",
        room_size: roomSize ? `${roomSize} sq ft` : "Not given",
        room_type: clean(r.space, 64) || "Not given",
        requirements: "Pre-launch reservation from the Zuture launch site. No payment taken.",
        time: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      },
    }),
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    throw new Error(`EmailJS ${res.status}: ${await res.text().catch(() => "")}`);
  }
}
