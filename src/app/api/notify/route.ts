const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Trim, cap length, and drop anything that is not a plain string. */
const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

const MODEL_LABEL: Record<string, string> = {
  "z-active": "Z-ACTIVE (ESP, washable, no consumables)",
  "z-pure": "Z-PURE (H13 HEPA + activated carbon)",
};

/**
 * Reservation intake for the launch batch.
 *
 * Sent through EmailJS using the same service and product-enquiry template as
 * the live zuture.co enquiry form, so reservations land in the same inbox in
 * the same format. The template variables below (first_name, reply_to,
 * selected_model, room_type, …) are the ones that template already uses.
 *
 * Unlike the live site, the call is made from the server, so the keys are never
 * shipped to the browser. That needs two things in the EmailJS dashboard:
 * Account → Security → "Allow EmailJS API for non-browser applications", and a
 * private key. Configure with environment variables (see .env.example):
 *   EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY, EMAILJS_PRIVATE_KEY
 *
 * It fails loudly on purpose. If EmailJS is not configured, or rejects the
 * send, the visitor is told it did not go through and can email instead — a
 * reservation must never be accepted on screen and then quietly dropped.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Malformed request" }, { status: 400 });
  }

  // Honeypot: a field people never see. Bots fill every field; say "ok" and
  // send nothing, so they learn nothing either.
  if (clean(body.website, 200)) return Response.json({ ok: true });

  const email = clean(body.email, 254);
  const name = clean(body.name, 120);

  if (!EMAIL.test(email)) {
    return Response.json({ error: "Invalid email" }, { status: 422 });
  }
  if (name.length < 2) {
    return Response.json({ error: "Name required" }, { status: 422 });
  }

  const model = clean(body.model, 32);
  const [first, ...rest] = name.split(/\s+/);
  const params = {
    selected_model: MODEL_LABEL[model] ?? (model || "Not chosen"),
    first_name: first,
    last_name: rest.join(" "),
    reply_to: email,
    phone: clean(body.phone, 32) || "Not given",
    quantity: "1",
    room_size: clean(body.room_size, 16) ? `${clean(body.room_size, 16)} sq ft` : "Not given",
    room_type: clean(body.space, 64) || "Not given",
    requirements: "Pre-launch reservation from the Zuture launch site. No payment taken.",
    time: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
  };

  const { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY, EMAILJS_PRIVATE_KEY } =
    process.env;

  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    console.error("[zuture] reservation NOT sent — EmailJS is not configured:", params);
    return Response.json({ error: "Reservations are not connected yet" }, { status: 503 });
  }

  try {
    const res = await fetch(
      process.env.EMAILJS_ENDPOINT ?? "https://api.emailjs.com/api/v1.0/email/send",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          ...(EMAILJS_PRIVATE_KEY ? { accessToken: EMAILJS_PRIVATE_KEY } : {}),
          template_params: params,
        }),
        signal: AbortSignal.timeout(10000),
      },
    );
    if (!res.ok) {
      console.error(`[zuture] reservation NOT sent — EmailJS ${res.status}: ${await res.text()}`, params);
      return Response.json({ error: "Could not send" }, { status: 502 });
    }
  } catch (err) {
    console.error("[zuture] reservation NOT sent — EmailJS unreachable:", String(err), params);
    return Response.json({ error: "Could not send" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
