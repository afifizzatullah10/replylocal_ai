import { NextResponse } from "next/server";

/**
 * Waitlist signups — validated JSON, logged on the server only.
 * Read entries from your terminal (local) or host logs (e.g. Vercel → Logs).
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email =
    typeof body === "object" &&
    body !== null &&
    "email" in body &&
    typeof (body as { email: unknown }).email === "string"
      ? (body as { email: string }).email.trim()
      : "";
  const phone =
    typeof body === "object" &&
    body !== null &&
    "phone" in body &&
    typeof (body as { phone: unknown }).phone === "string"
      ? (body as { phone: string }).phone.trim()
      : "";

  if (!email && !phone) {
    return NextResponse.json(
      { error: "Provide an email or phone number." },
      { status: 400 },
    );
  }

  const entry = {
    receivedAt: new Date().toISOString(),
    email: email || null,
    phone: phone || null,
  };

  console.info("[waitlist]", JSON.stringify(entry));

  return NextResponse.json({ ok: true });
}
