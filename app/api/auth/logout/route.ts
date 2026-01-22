import {auth} from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request){
    try {
        await auth.api.signOut({
            headers: req.headers,
        });
        return NextResponse.json({message: "logged out"});
    } catch (err:any) {
        return NextResponse.json({error: err.message}, {status: 400});
    }
}