import { Metadata } from 'next'
import LandingBackground from '@/app/_components/LandingBackground'
import LandingHeroCard from '@/app/_components/LandingHeroCard'

export const metadata: Metadata = {
  title: 'Home',
}

const Home = () => (
  <div className="min-h-screen relative">
    <LandingBackground />
    <LandingHeroCard />
  </div>
);

export default Home;
