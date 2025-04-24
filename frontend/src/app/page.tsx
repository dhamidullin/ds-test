import { Metadata } from 'next'
import { LandingBackground } from '@/app/_components/LandingBackground'
import { LandingHeroCard } from '@/app/_components/LandingHeroCard'

export const metadata: Metadata = {
  title: 'Home',
}

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <LandingBackground />
      <LandingHeroCard />
    </div>
  )
}
