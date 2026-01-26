"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockTemplate, Template } from '@/lib/mock';
import { Search } from 'lucide-react';
import React, { useState } from 'react'

const Templates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const categories = ['all', ...Array.from(new Set(mockTemplate.map(t => t.category)))];

  const filteredTemplates = mockTemplate.filter((template)=>{
    const matchesSearch =
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });
  const handleUseTemplate = (template: Template) => {
    console.log("Use Template");
  };
  const handlePreview = (template: Template) => {
    setPreviewTemplate(template)
  }
  return (
    <div className='p-6 space-y-6'>
      <div>
        <h1 className='text-3xl font-bold text-white mb-2'>Template Gallery</h1>
        <p className='text-gray-400'>Get started quickly with pre-built automation template</p>
      </div>
      <div className='flex items-center space-x-4 bg-[#121826] p-4 rounded-lg border border-[#1E293B]'>
        <div className='relative flex-1 max-w-md'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4'/>
          <Input placeholder='Search template...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className='pl-10 bg-[#1E293B] border-[#334155] text-gray-200'/>
        </div>
          <div className='flex items-center space-x-2'>
            {categories.map((category)=>(
              <Button key={category} variant={selectedCategory === category ? "default" : "outline"} size="sm" onClick={()=> setSelectedCategory(category)} className={
                selectedCategory === category ? "bg-green-500 hover:bg-green-600 text-black" : "border-[#334155] text-gray-300 hover:bg-[#1E293B]"
              }>
                {category === "all" ? "All" : category}
              </Button>
            ))}
          </div>
      </div>
    </div>
  )
}

export default Templates
