import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const eventName = request.headers.get("x-github-event");
        const payload = await request.json();

        console.log(`Received GitHub Webhook: ${eventName}`);

        if (eventName === "installation") {
            if (payload.action === "created") {
                console.log(`App installed on account: ${payload.installation.account.login}`);
            } else if (payload.action === "deleted") {
                console.log(`App uninstalled from account: ${payload.installation.account.login}`);
            }
        }

        return NextResponse.json({ message: "Webhook received" }, { status: 200 });

    }
    catch (error) {
        console.error("🚨 Webhook Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}