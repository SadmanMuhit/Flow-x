"use client";
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Activity, Workflow, LayoutTemplate as Template, CreditCard, Settings, User, LogOut } from 'lucide-react';
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
    {
        name: "Overview",
        href: "/dashboard",
        icon: Activity,
    },
    {
        name: "Workflow",
        href: "/dashboard/workflow",
        icon: Workflow,
    },
    {
        name: "Templates",
        href: "/dashboard/template",
        icon: Template,
    },
    {
        name: "Billing",
        href: "/dashboard/billing",
        icon: CreditCard,
    },
    {
        name: "Setting",
        href: "/dashboard/setting",
        icon: Settings,
    },
]

const Sidebar = () => {
    const pathname = usePathname()
    const router = useRouter();
    const {logout} = useAuth();
  return (
    <div className='w-64 bg-[#121826] border-r border-[#1e293b] flex flex-col'>
        <div className='px-4 pt-3 pb-2'>
            <Link href={"/"} className='flex items-center'>
            <Image src={require("@/assests/logo.png")} alt='flowx' width={250} height={190} className='-m-15'/>
            </Link>
        </div>
    <nav className='flex-1 px-4 pt-0'>
        <ul className='space-y-5'>
            {navItems.map((item) =>{
                const Icon = item.icon;
                const isActive = pathname === item.href || item.href !== "/dashboard" && pathname.startsWith(item.href);

                return(
                    <li key={item.name}>
                        <Link href={item.href} className={cn("flex items-center space-x-3 px-3 py-1.5 rounded text-sm font-medium leading-tight transition-all duration-200", isActive ? "bg-green-500/10 text-green-400 glow": "text-gray-300 hover:bg-[#1e293b]")}>
                        <Icon className='w-4 h-4'/>
                        <span>{item.name}</span>
                        </Link>
                    </li>
                );
            })}
        </ul>
    </nav>
    <div className='mt-auto p-3 border-t border-[#1e293b] space-y-4 mb-2'>
        <Link href={"/dashboard/settings"} className='flex items-center space-x-2 px-3 py-2 rounded text-sm text-gray-300 hover:bg-[#1e293b] hover:text-white transition-colors'>
        <User className="w-4 h-4"/>
        <span>Profile</span>
        </Link>
        <button type='button' onClick={async () =>{
            await logout();
            router.push("/")
        }} className='w-full flex items-center space-x-2 px-3 py-2 rounded text-sm text-gray-300 hover:bg-[#1e293b]'
        >
            <LogOut className='w-4 h-4 text-red-400'/>
            <span className='text-red-400'>Log Out</span>
        </button>
    </div>
    </div>
  );
};

export default Sidebar
