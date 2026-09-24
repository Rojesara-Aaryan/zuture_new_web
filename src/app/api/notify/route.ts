const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Trim, cap length, and drop anything that is not a plain string. */
const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

/**
 * Reservation intake for the launch batch.
 *
 * NOTE FOR ZUTURE: this currently validates and logs only — nothing is stored.
 * Point the marked block at the same CRM/inbox the live enquiry form on
 * zuture.co uses, or reservations are silently lost.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Malformed request" }, { status: 400 });
  }

  const email = clean(body.email, 254);
  const name = clean(body.name, 120);

  if (!EMAIL.test(email)) {
    return Response.json({ error: "Invalid email" }, { status: 422 });
  }
  if (name.length < 2) {
    return Response.json({ error: "Name required" }, { status: 422 });
  }

  const reservation = {
    name,
    email,
    phone: clean(body.phone, 32),
    model: clean(body.model, 32),
    roomSize: clean(body.room_size, 16),
    space: clean(body.space, 64),
    at: new Date().toISOString(),
  };

  // --- replace with a real CRM / mail call ---------------------------------
  console.info("[zuture] reservation:", reservation);
  // -------------------------------------------------------------------------

  return Response.json({ ok: true });
}
