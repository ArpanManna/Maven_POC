import ComparisonTable from '@/components/ComparisonTable'
import { Content } from '@/components/HomePage/Content'
import { Faq } from '@/components/HomePage/FAQ'
import Feature from '@/components/HomePage/Feature'
import Footer from '@/components/HomePage/Footer'
import HeroSection from '@/components/HomePage/HeroSection'
import ProtocolFeatures from '@/components/ProtocolFeatures'

export default function Home() {

  return (
    <>
      <HeroSection />
      <Feature />
      <Content />

      <ProtocolFeatures />
      <ComparisonTable />
      <Faq />
      <Footer />
    </>
  )
}
