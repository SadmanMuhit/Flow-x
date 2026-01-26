'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { useUser } from '@/hooks/useUser';
import { Command, Plus, Search } from 'lucide-react'
import React, { useState } from 'react'

const TopBar = () => {
  const [searchValue, setSearchValue] = useState("");
  const {user, loading} = useUser();

  if(loading){
    return null;  
  }
  return (
    <header className='h-15 bg-[#1e293b] border-b border-[#1E293B] px-6 flex items-center justify-between'>
      <div className='flex items-center flex-1 max-w-md'>
        <div className='relative w-full'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4'/>
          <Input placeholder='search workflow-x...' value={searchValue} onChange={(e)=> setSearchValue(e.target.value)} className='pl-10 bg-[#1E293B] border-[#334155] text-gray-200 placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500/20'/>
          <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
          <kbd className='px-2 py-1 text-sm text-gray-500 bg-[#334155] rounded'> 
            <Command className='w-3 h-3 inline mr-1'/>k
          </kbd>
          </div>
        </div>
      </div>
      <div className='flex items-center space-x-4'>
        <Button className='bg-green-500 hover:bg-green-600 text-black font-medium glow'>
          <Plus className='w-4 h-4 mr-2'/>
          New workflow
        </Button>
      </div>
    </header>
  );
};

export default TopBar
