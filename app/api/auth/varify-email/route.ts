import {auth} from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if(!token){
        return NextResponse.json({error:"Missing token"}, {status: 400});
}
try {
    const result = await auth.api.verifyEmail({
        query: {token   },
    });
    return NextResponse.json({message: "Email verified successfully", user: result?.user ?? null}, {status: 200});
} catch (error: any) {
    return NextResponse.json({error: error.message}, {status: 400});
}
}