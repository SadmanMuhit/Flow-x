import React, { useState } from 'react'
import { email, z } from 'zod';
import { Dialog, DialogContent } from '../ui/dialog';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
interface AuthMOdalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const loginSchema= z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(8, "password must be at least 8 characters long")
});

const signSchema= z.object({
    first: z.string().min(1, "first name is required"),
    last: z.string().min(1, "last name is required"),
    email: z.email("invalid email address"),
    password: z.string().min(8, "password must be at least 8 characters long"),
    confirm: z.string(),
}).refine((data)=> data.password === data.confirm,{
    message: "passwords do not match",
    path: ["confirm"],
});

const AuthModal = ({isOpen, onOpenChange}: AuthMOdalProps) => {
    const [activeTab, setActiveTab] = useState("signin");
    const {signup, login, error, loading} = useAuth();
    const [from, setForm] = useState({
        first: "",
        last: "",
        email: "",
        password: "",
        confirm: "",
    });
    const [validationErrors, setValidationErrors]= useState<Record<string, string>>({});
    async function handelRegister(e:React.FormEvent){
        e.preventDefault();
        setValidationErrors({});

        try {
            const validateData= signSchema.parse(from);

            const name = `${validateData.first} ${validateData.last}`; 
            const ok = await signup(name,validateData.email,validateData.password);
            
            if(ok){
                toast.success("Check your email for activiting your account");  
            }
        } catch (err:any) {
            if(err instanceof z.ZodError){
                const errors: Record<string, string> ={};
                err.issues.forEach((issue)=>{
                    if(issue.path[0]){
                        errors[issue.path[0] as string] = issue.message;
                    }
                });
                setValidationErrors(errors)
            }
        }
    }
    async function handleLogin(e: React.FormEvent){
        e.preventDefault();
        setValidationErrors({});

        try{
            const validateData = loginSchema.parse({
                email: from.email,
                password: from.password
            });
            const ok = await login(validateData.email, validateData.password);
            if(ok){
                onOpenChange(false);
            }
        }catch(err){
            if(err instanceof z.ZodError){
                const errors: Record<string, string> ={};
                err.issues.forEach((issue) =>{
                    if(issue.path[0]){
                        errors[issue.path[0] as string] = issue.message;
                    }
                });
                setValidationErrors(errors);
            }
        }
    }


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-4xl bg-background/95 backdrop-blur-xl border-primary/20 p-0 overflow-hidden'>
        <div className='grid grid-cols-1 lg:grid-cols-2 min-h-125'>
            <div className='hidden lg:flex flex-col justify-center p-8 bg-gradient-hero relative overflow-hidden'>
                <div className='space-y-6'>
                    <div className='flex items-center gap-3'>
                        <Link href="/">
                        <div className='flex items-center gap-2 animate-fade-in'>
                            <Image src={require("@/assests/logo.png")} alt='' width={200} height={190}/>
                        </div>
                        </Link>
                        </div>
                        <div className='space-y-4 -mt-17.5'>
                            <h2 className='text-3xl font-bold leading-tight mt-5'>Automate Everything <br/>
                            <span className='text-primary'>smarter.</span>
                            </h2>
                            <p className='text-lg text-muted-foreground'>join thousands of developers building the future of workflow automation with AI superpowers.</p>
                        </div>
                        <div className='space-y-3'>
                            {[
                                "Free forever plan available",
                                "No credit card required",
                                "Setup in 2 minutes",
                            ].map((txt, i)=>(
                                <div key={i} className='flex items-center gap-2 text-sm text-muted-foreground'>
                                    <CheckCircle className='w-4 h-4 text-primary'/>
                                    <span>{txt}</span>
                                </div>
                            ))}
                        </div>
                    </div>
        <div className='absolute top-1/3 right-1/3 w-3 h-3 bg-neon-blue rounded-full animate-float opacity-30'></div>
        <div className='absolute bottom-1/3 left-1/3 w-5 h-5 bg-neon-purple rounded-full animate-node-glow opacity-20'></div>
        <div className='absolute top-1/2 right-1/4 w-2 h-2 bg-neon-cyan rounded-full animate-glow-pulse opacity-25'></div>
                </div>
                <div className='flex flex-col justify-center p-8'>
                    <div className='w-full max-w-md mx-auto space-y-6'>
                         <div className='text-center space-y-2'>
                            <h3 className='text-2xl font-bold '>Welcome to FlowX</h3>
                            <p className='text-muted-foreground'>{activeTab === "signin" ? "sign in to your account" : "create a new account"}</p>
                         </div>
                         <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
                            <TabsList className='grid w-full grid-cols-2 bg-muted/20'>
                            <TabsTrigger value='signin' disabled={loading} className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'>
                                Sign In
                            </TabsTrigger>
                            <TabsTrigger value='register' disabled={loading} className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'>
                                Register
                            </TabsTrigger>
                            </TabsList>
                            <TabsContent value='signin' className='space-y-4 mt-6'>
                                <form onSubmit={handleLogin}>
                                    <div className='space-y-4'>
                                        <div className='space-y-2'>
                                            <Label htmlFor='signin-email' className='text-sm font-medium'>Email Address</Label>
                                          <Input id='signin-email' type='email' value={from.email} onChange={(e)=> setForm({...from, email: e.target.value})} placeholder='Enter your email address' className='h-11 bg-muted/20 border-primary/20 focus:border-primary focus:ring-primary/20'/>
                                            {validationErrors.email && (<p className='text-red-500 text-xs'>
                                                {validationErrors.email}
                                            </p>)}
                                        </div>
                                        <div className='space-y-2'>
                                            <Label htmlFor='signin-password' className='text-sm font-medium'>Password</Label>
                                          <Input id='signin-password' type='password' value={from.password} onChange={(e)=> setForm({...from, password: e.target.value})} placeholder='Enter your password' className='h-11 bg-muted/20 border-primary/20 focus:border-primary focus:ring-primary/20'/>
                                            {validationErrors.password && (<p className='text-red-500 text-xs'>
                                                {validationErrors.password} 
                                            </p>)}
                                        </div>
                                        <div className='flex items-center justify-between text-sm'>
                                            <label className='flex items-center gap-2 cursor-pointer'>
                                                <Checkbox className='rounded border-primary/20'/>
                                                <span className='text-muted-foreground'>Remember me</span>
                                            </label>
                                            <button className='text-primary hover:underline'>Forget Password?</button>
                                        </div>
                                        <Button type='submit' className='w-full h-11 bg-gradient-primary hover:shadow-glow-primary' variant="hero">Sign In <ArrowRight className='ml-2 w-4 h-4'/></Button>
                                    </div>
                                </form>
                                <div className='text-center text-sm text-muted-foreground'>
                                    Don't have an account?
                                    <button className='text-primary hover:underline font-medium' onClick={()=> setActiveTab("register")}>sign up for free</button>
                                </div>
                            </TabsContent>
                            <TabsContent value='register' className='space-y-4 mt-6'>
                                <form onSubmit={handelRegister}>
                                    <div className='space-y-4'>
                                        <div className='grid grid-cols-2 gap-3'>
                                            <div className='space-y-2'>
                                                <Label htmlFor='register-first' className='text-sm font-medium'></Label>
                                                <Input id='register-first' type='text' value={from.first} onChange={(e) => setForm({...from, first: e.target.value})} placeholder='john' className='h-11 bg-muted/20 border-primary/20 focus:border-primary focus:ring-primary/20'/>
                                                {validationErrors.first && (<p className='text-red-500 text-sm'>{validationErrors.first}</p>)}
                                            </div> 
                                            <div className='space-y-2'>
                                                <Label htmlFor='register-last' className='text-sm font-medium'></Label>
                                                <Input id='register-last' type='text' value={from.last} onChange={(e) => setForm({...from, last: e.target.value})} placeholder='Deo' className='h-11 bg-muted/20 border-primary/20 focus:border-primary focus:ring-primary/20'/>
                                                {validationErrors.last && (<p className='text-red-500 text-sm'>{validationErrors.last}</p>)}
                                            </div> 
                                        </div>
                                        <div className='space-y-2'>
                                            <Label htmlFor='register-email' className='text-sm font-medium'>Email Address</Label>
                                            <Input id ='register-email' type='email' value={from.email} onChange={(e) => setForm({...from, email: e.target.value})} placeholder='Enter your email address' className='h-11 bg-muted/20 border-primary/20 focus:border-primary focus:ring-primary/20'/>
                                            {validationErrors.email && (<p className='text-red-500 text-xs'>
                                                {validationErrors.email}
                                            </p>)}
                                        </div>
                                        <div className='space-y-2'>
                                            <Label htmlFor='register-password'>Password</Label>
                                            <Input id='register-password' type='password' value={from.password} onChange={(e) => setForm({...from, password: e.target.value})} placeholder='Create a strong password' className='h-11 bg-muted/20 border-primary/20 focus:border-primary focus:ring-primary/20'/>
                                            <div className='text-xs text-muted-foreground'>Must be at least 8 characters with numbers and symbols</div>
                                            {validationErrors.password &&(<p className='text-red-500 text-sm'>{validationErrors.password}</p>)}
                                        </div>
                                        <div className='space-y-2'>
                                            <Label htmlFor='register-confirm' className='text-sm font-medium'>Confirm Password</Label>
                                            <Input id='register-confirm' type='password' value={from.confirm} onChange={(e) => setForm({...from, confirm: e.target.value})} placeholder='Confirm your password' className='h-11 bg-muted/20 border-primary/20 focus:border-primary focus:ring-primary/20'/>
                                            <div className='text-xs text-muted-foreground'>Must be at least 8 characters with numbers and symbols</div>
                                            {validationErrors.password &&(<p className='text-red-500 text-sm'>{validationErrors.password}</p>)}
                                        </div>
                                            <div className="flex items-start gap-2 text-sm">
                                            <Checkbox className="mt-1" />
                                            <span className="text-muted-foreground">
                                                I agree to the{" "}
                                                <button className="text-primary hover:underline">Terms of service</button>{" "}
                                                and{" "}
                                                <button className="text-primary hover:underline">privacy policy</button>
                                            </span>
                                            </div>
                                            <Button type='submit' disabled={loading} className='w-full h-11 bg-gradient-primary hover:shadow-glow-primary' variant="hero">Create Account <ArrowRight className='ml-2 w-4 h-4'/></Button>
                                            {error && <p className='text-red-500 text-sm'>{error}</p>}
                                        </div>
                                </form>
                                <div className='text-center text-sm text-muted-foreground'>
                                    Already have an account?
                                    <button className='text-primary hover:underline font-medium' onClick={()=> setActiveTab("signin")}>Sign in  </button>
                                </div>
                            </TabsContent>
                         </Tabs>    
                    </div>
                </div>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default AuthModal
