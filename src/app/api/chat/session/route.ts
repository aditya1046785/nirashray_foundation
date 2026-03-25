import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST — admin controls: start or stop a chat session
export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session?.user || !["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(session.user.role)) {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const { action, title } = await request.json();

    if (action === "start") {
        // End any existing live sessions first
        await prisma.chatSession.updateMany({
            where: { isLive: true },
            data: { isLive: false, endedAt: new Date() },
        });

        const chatSession = await prisma.chatSession.create({
            data: {
                title: title || "Live Chat",
                isLive: true,
                startedAt: new Date(),
            },
        });
        return NextResponse.json({ success: true, data: chatSession });
    }

    if (action === "stop") {
        await prisma.chatSession.updateMany({
            where: { isLive: true },
            data: { isLive: false, endedAt: new Date() },
        });
        return NextResponse.json({ success: true, message: "Session ended." });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
}

// GET — list all past sessions (admin only)
export async function GET(request: NextRequest) {
    const session = await auth();
    if (!session?.user || !["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(session.user.role)) {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const sessions = await prisma.chatSession.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { _count: { select: { messages: true } } },
    });

    return NextResponse.json({ success: true, data: sessions });
}
