import {auth} from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request){
    const body = await req.json();

    const {email, password} =body;

    try {
        const session = await auth.api.signInEmail({
            body:{
                email,
                password,
            },
        });
        return NextResponse.json({message: "login in", session});
    } catch (err:any) {
        if(err.message && err.message.includes("email") && err.message.includes("verified")){
            return NextResponse.json({error: "please verify your email address before logging in. Check your email for the verification link."}, {status: 403});
        }
        return NextResponse.json({error: err.message}, {status: 400});
    }
}