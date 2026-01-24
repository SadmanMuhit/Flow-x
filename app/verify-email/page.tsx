"use client"
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { email } from 'zod';

export default function verifyEamilPage(){
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<"loading" | "success" | "error">(
        "loading"
    );
    const [message, setMessage] = useState("");
    const [user, setUser] = useState<any>(null);

    useEffect(()=>{
        const token = searchParams.get("token");

        if(!token){
            setStatus("error");
            setMessage("Invalid verification link. please try agian");
            return;
        }
        const verifyEmail = async () =>{
            try{
                const response = await fetch(`/api/auth/veriy-email?token=${token}`);
                const data = await response.json();

                if(response.ok){
                    setStatus("success");
                    setMessage("Your email has been verified successfully!");
                    setUser(data.user);
                }else{
                    setStatus("error");
                    setMessage(data.error || "verification failed. Please try again.")
                }
            }catch(error){
                setStatus("error");
                setMessage("someting went wrong. please try again");    
            }
        };
        verifyEmail();
    },[searchParams]);
    return(
         <div className='min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900'></div>
    )
}
