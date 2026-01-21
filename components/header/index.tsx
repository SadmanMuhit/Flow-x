'use client';
import { Item } from '@radix-ui/react-accordion'
import { BookOpen, CreditCard, Github, Menu, Users, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import AuthModal from '../auth/auth.modal';

const navItems =[
  {name: "Features", href: "#features", icon: Zap},
  {name: "Templates", href: "#templates", icon: BookOpen},
  {name: "Pricing", href: "#pricing", icon: CreditCard},
  {name: "Community", href: "#community", icon: Users},
  {name: "Github", href: "#github", icon: Github}
]

const Header = () => {
  const [inOpen, setInOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen]= useState(false);
  return (
    <header className='fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-primary/10'>
      <div className='container max-w-7xl mx-auto px-6'>
        <div className='flex items-center justify-between h-16'>
          <Link href={"/"}>
          <div className='flex items-center gap-2 animate-fade-in'>
            <Image src={require("@/assests/logo.png")} alt='' width={200} height={190}/>
          </div>
          </Link>
          <nav className='hidden md:flex items-center gap-8'>
            {navItems.map((Item, index)=>(
              <Link href={Item.href} key={Item.name} className='flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary animate-fade-in' style={{animationDelay:`${index * 0.1}s`}}>
                <Item.icon className='w-4 h-4'/>
                {Item.name}
              </Link>
            ))}
          </nav>
          <div className='hidden md:flex items-center gap-3 animate-fade-in'>
            <Button variant="ghost" size="sm" className='hover:!text-white' onClick={() => setIsAuthOpen(true)}>Sign In</Button>
            <Button variant="hero" size="sm" onClick={() => setIsAuthOpen(true)}>Get Started Free</Button>
          </div>
          <Sheet open={inOpen} onOpenChange={setInOpen}>
            <SheetTrigger asChild className='md:hidden'>
              <Button variant={"ghost"} size={"sm"} className='p-2'>
                <Menu className='w-5 h-5'/>
              </Button>
            </SheetTrigger>
            <SheetContent side='right' className='w-80 bg-background/95 backdrop-blur-xl border-primary/10'>
            <div className='flex items-center justify-between px-2'>
               <Link href={"/"}>
          <div className='flex items-center gap-2 animate-fade-in'>
            <Image src={require("@/assests/logo.png")} alt='' width={200} height={190}/>
          </div>
          </Link>
            </div>
            <nav className='space-y-4 mb-8 -mt-14 px-2'>
              {navItems.map((Item, index) => (
                <a key={Item.name} href={Item.href} onClick={()=> setIsOpen(false)} className='flex items-center gap-3 text-base font-medium text-muted-foreground hover:text-primary transition-colors p-3 rounded-lg hover:bg-white/50 animate-fade-in' style={{animationDelay:`${index * 0.1}s`}}>
                  <Item.icon className='w-5 h-5'/>
                  {Item.name}
                </a>
              ))}
            </nav>
            <div className='space-y-3 px-4'>
              <div className='w-[80%] mx-auto flex flex-col gap-y-4 justify-start'>
              <Button variant="ghost" size="lg" className='w-full justify-start'>Sign In</Button>
            <Button variant="hero" size="sm" className='justify-start' onClick={() =>{
              setIsOpen(false);
            }}>Get Started Free</Button>
            </div>
            </div>
            </SheetContent>
          </Sheet>
        <AuthModal isOpen={isAuthOpen} onOpenChange={setIsAuthOpen}/>
        </div>

      </div>

    </header>
  )
}

export default Header
