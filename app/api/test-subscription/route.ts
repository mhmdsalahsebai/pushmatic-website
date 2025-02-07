import { NextResponse } from "next/server";
import webPush from "web-push";

export async function POST(req: Request) {
  try {
    const subscription = await req.json();

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: "Invalid subscription data" },
        { status: 400 }
      );
    }

    const vapidKeys = {
      publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      privateKey: process.env.VAPID_PRIVATE_KEY!,
    };

    webPush.setVapidDetails(
      "mailto:your-email@example.com",
      vapidKeys.publicKey,
      vapidKeys.privateKey
    );

    const payload = JSON.stringify({
      title: "Pushmatic Test",
      body: "This is a test push notification from Pushmatic!",
    });

    await webPush.sendNotification(subscription, payload);

    return NextResponse.json({ data: { success: true } }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to send push notification" },
      { status: 500 }
    );
  }
}
