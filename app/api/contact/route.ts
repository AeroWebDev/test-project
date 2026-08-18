import { NextResponse } from "next/server";

const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_URL;
const CONTACT_EMAIL = "aeroteam.agency@gmail.com";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    if (name.length < 2 || name.length > 80) {
      return NextResponse.json({ message: "Name must be between 2 and 80 characters." }, { status: 400 });
    }

    if (message.length < 5 || message.length > 2000) {
      return NextResponse.json({ message: "Message must be between 5 and 2000 characters." }, { status: 400 });
    }

    // Send to Discord webhook if configured
    if (DISCORD_WEBHOOK) {
      await fetch(DISCORD_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: [
            {
              title: "📬 New Contact Message — RoBcodes",
              color: 0xa855f7,
              fields: [
                { name: "Name", value: name, inline: true },
                { name: "Email", value: email, inline: true },
                { name: "Message", value: message },
              ],
              footer: { text: "RoBcodes Contact Form" },
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      });
    }

    return NextResponse.json({ success: true, message: "Message sent successfully." });
  } catch (err: any) {
    console.error("Contact API error:", err);
    return NextResponse.json({ message: "Server error. Please try again." }, { status: 500 });
  }
}
