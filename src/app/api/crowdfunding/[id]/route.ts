import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user || !["SUPER_ADMIN", "ADMIN"].includes(session.user.role)) {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    try {
        await prisma.crowdfundingCampaign.delete({
            where: { id }
        });
        return NextResponse.json({ success: true, message: "Campaign deleted." });
    } catch (e) {
        console.error("Delete campaign error:", e);
        return NextResponse.json({ success: false, error: "Failed to delete campaign." }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user || !["SUPER_ADMIN", "ADMIN"].includes(session.user.role)) {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    try {
        const body = await request.json();

        // Only pick valid Prisma schema fields — prevents rejection from extra keys like createdAt/updatedAt
        const data: Record<string, unknown> = {};
        if (body.title !== undefined) data.title = String(body.title);
        if (body.description !== undefined) data.description = String(body.description);
        if (body.target !== undefined) data.target = Number(body.target);
        if (body.raised !== undefined) data.raised = Number(body.raised);
        if (body.image !== undefined) data.image = String(body.image);
        if (body.category !== undefined) data.category = String(body.category);
        if (body.isActive !== undefined) data.isActive = Boolean(body.isActive);

        const campaign = await prisma.crowdfundingCampaign.update({
            where: { id },
            data,
        });
        return NextResponse.json({ success: true, data: campaign });
    } catch (e) {
        console.error("Update campaign error:", e);
        return NextResponse.json({ success: false, error: "Failed to update campaign." }, { status: 500 });
    }
}
