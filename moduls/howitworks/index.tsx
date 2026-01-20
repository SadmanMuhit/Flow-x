import React from 'react'
import { BarChart3, PlayCircle, Webhook, Workflow } from 'lucide-react'
const steps= [{
  icon: Webhook,
  title: 'Trigger',
  description: 'Start workflows from webhook, schedules, froms, or any event.',
  details: ["Webhooks", "Cron jobs","stripe events","gmail", "Http requests",],
},
{
  icon: Workflow,
  title: 'Build workflow',
  description: "Drag-and-drop visual editor with 200+ integrations",
  details:[
    "visual editor",
    "AI Nodes",
    "Code Blocks",
    "Conditions",
    "Loops",
  ],
},
{
  icon: PlayCircle,
  title: 'run & monitor',
  description: 'execute workflows with real-time logs and error handling.',
  details:[
    "Live execution",
    "Error retry",
    "Debug logs",
    "Performance",
    "Alerts",
  ],
},
{
  icon: BarChart3,
  title: 'scale & optimize',
  description: 'monitor performance and scale workflows automatically.',
  details:[
    "Analytics",
    "Auto Scale",
    "Load Balancing",
    "Team Collaboration",
    "API Access",
  ],
},
];
const HowItWorksSection = () => {
  return (
    <section className='py-24 px-6 bg-linear-to-b from-background to-secondary/20'>
        <div className='container max-w-7xl mx-auto'>
            <div className='text-center mb-16 animate-fade-in'>
                <h2 className='text-4xl md:text-5xl font-bold mb-6 bg-gradient-secondary bg-clip-text text-transparent'>How It Works</h2>
                <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>Build Powerful Workflows with Our Intuitive Platform</p>           
            </div>
        </div>
    </section>
  )
}

export default HowItWorksSection
