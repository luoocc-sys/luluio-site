import HeroSection from './components/HeroSection'
import LoveDashboard from './components/LoveDashboard'
import AboutSection from './components/AboutSection'
import FeaturedVideoSection from './components/FeaturedVideoSection'
import PhilosophySection from './components/PhilosophySection'
// import TravelMap from './components/TravelMap'  // TODO: enable after testing
import ServicesSection from './components/ServicesSection'
import PhotoGallery from './components/PhotoGallery'

function App() {
  return (
    <main>
      <HeroSection />
      <LoveDashboard />
      <AboutSection />
      <FeaturedVideoSection />
      <PhilosophySection />
      {/* <TravelMap /> */}
      <ServicesSection />
      <PhotoGallery />
    </main>
  )
}

export default App
