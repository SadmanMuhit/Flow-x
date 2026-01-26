"use client";
import KpiCard from '@/components/dashboard/kpi-card'
import RunTable from '@/components/dashboard/run-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react'

const Page = () => {
  const handleUpgrade = () => {

  }
  return (
    <div className='p-6 space-y-6'>
      <div>
        <h1 className='text-3xl font-bold text-white mb-2'>Overview</h1>
        <p className='text-gray-400'>Monitor your automation workflows and system performance</p>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <KpiCard
        title='Active workflow'
        value={10}
        subtitle='Running automations'
        />
        <KpiCard
        title='Runs (30d)'
        value={5}
        subtitle='Total executions'
        />
        <KpiCard
        title='Sussess Rate'
        value={4}
        progress={90}
        subtitle='Overall reliability '
        />
        <KpiCard
        title='Credits Left'
        value={100}
        progress={90}
        subtitle='Usage remaining'
        action={{
          label: "Upgrade",
          onClick: handleUpgrade,
        }}
        />
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2'>
          <Card className='bg-[#121826] border-[#1E293B ]'>
            <CardHeader>
              <CardTitle className='text-white'>Recent Runs</CardTitle>
            </CardHeader>
            <CardContent>
              <RunTable/>
            </CardContent>
          </Card>
        </div>
      <div>
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolores facere quibusdam repellendus quos, nihil magni voluptatibus laboriosam accusantium facilis sapiente minus velit corrupti architecto deleniti rem, quia perspiciatis. Doloremque, repellendus?</p>
      </div>
      </div>
    </div>
  )
}

export default Page
