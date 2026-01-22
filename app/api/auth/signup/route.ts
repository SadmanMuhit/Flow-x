import {auth} from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request){
    const body = await req.json();

    const {email, password,name} =body;

    try {
        await auth.api.signUpEmail({
            body:{
                email,
                password,
                name,
            },
        });
        return NextResponse.json({message: "signup successful. please check your email and click the varification link to activate your account."},{status: 200});
    } catch (error:any) {
        return NextResponse.json({error:error.message},{status: 500});
    }
}
