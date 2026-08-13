import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import LandingGuide from '@/components/home/landing-guide'
import LandingHero from '@/components/home/landing-hero'

const HomePage = () => {
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) return
    const id = location.hash.replace('#', '')
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [location.hash])

  return (
    <div className="bg-background">
      <LandingHero />
      <LandingGuide />
    </div>
  )
}

export default HomePage
