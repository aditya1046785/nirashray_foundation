import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    const campaigns = await prisma.crowdfundingCampaign.findMany({
        orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ success: true, data: campaigns });
}

export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session?.user || !["SUPER_ADMIN", "ADMIN"].includes(session.user.role)) {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }
    const { title, description, target, raised, image, category, isActive } = await request.json();
    
    if (!title || !description || !target || !image || !category) {
        return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    try {
        const campaign = await prisma.crowdfundingCampaign.create({
            data: { 
                title, 
                description, 
                target: Number(target), 
                raised: Number(raised) || 0, 
                image, 
                category, 
                isActive: isActive ?? true 
            }
        });
        return NextResponse.json({ success: true, data: campaign });
    } catch (e) {
        console.error("Create campaign error:", e);
        return NextResponse.json({ success: false, error: "Failed to create campaign." }, { status: 500 });
    }
}
