import {auth} from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const session = await auth.api.getSession(req );
    if (!session) {
        return NextResponse.json({ user: null }, { status: 401 });
    }
    return NextResponse.json({ user: session.user });
}