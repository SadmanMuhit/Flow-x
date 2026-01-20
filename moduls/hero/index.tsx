import React from 'react'
import herobanner from '@/assests/herobanner.png'
import { ArrowRight, Play, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
const HeroSection = () => {
  return (
    <section className='relative min-h-screen flex items-center justify-center overflow-hidden pt-16'>
      <div className=' absolute inset-0 bg-gradient-hero opacity-95' style={
        {
            backgroundImage: `url(${herobanner.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay',
        }
      }/>
      <div className='absolute inset-0 bg-background/60'/>
      <div className='absolute inset-0'>
        <div className='absolute top-1/4 left-1/4 w-4 h-4 bg-neon-green rounded-full animate-glow-pulse'></div>
        <div className='absolute top-1/3 right-1/3 w-3 h-3 bg-neon-blue rounded-full animate-float' style={{animationDelay:'1s'}}></div>
        <div className='absolute bottom-1/3 left-1/3 w-5 h-5 bg-neon-purple rounded-full animate-node-glow' style={{animationDelay:'2s'}}></div>
        <div className='absolute top-1/2 right-1/4 w-2 h-2 bg-neon-cyan rounded-full animate-glow-pulse' style={{animationDelay:'3s'}}></div>
      </div>
      <div className='relative z-10 text-center max-w-6xl mx-auto px-6'>
        <div className='animate-fade-in'>
            <div className='inline-flex items-center gap-2 bg-secondary/50 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2 mb-8'>
                <Zap className='w-4 h-4 text-primary' />
                <span className='text-sm font-medium'>Next Generation AI Solutions</span>
            </div>
            <h1 className='text-6xl md:text-8xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent leading-tight'>
                Automate Everything <br/> <span className='text-accent'>Smarter.</span>
            </h1>
            <p className='text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed'>Flowx is the next-gen open SaaS to build and run workflows with AI superpowers. Connect any service, Automate any process</p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
                <Button size="lg" variant="hero" className='text-lg px-8 py-6'>
                    Get Started Free
                    <ArrowRight className='ml-2 w-5 h-5'/>
                </Button>
                <Button size="lg" variant="secondary" className='text-lg px-8 py-6'>
                    <Play className='mr-2 w-5 h-5' />
                    View Templates
                </Button>
            </div>
            <div className='mt-16 flex items-center justify-center gap-8 text-sm text-muted-foreground'>
                <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-primary rounded-full animate-glow-pulse'></div>
                        <span>Free Forever Plan</span>
                </div>
                <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-neon-blue rounded-full animate-glow-pulse' style={{animationDelay:'0.5s'}}></div>
                        <span>No Credit Card Required</span>
                </div>
                <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-accent rounded-full animate-glow-pulse' style={{animationDelay:'1s'}}></div>
                        <span>Setup in 2 minutes</span>
                </div>
            </div>
        </div>
      </div>

      <div className='absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent'></div>
    </section>
  )
}

export default HeroSection
