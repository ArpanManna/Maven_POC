import { Content } from '@/components/HomePage/Content'
import { Faq } from '@/components/HomePage/FAQ'
import Feature from '@/components/HomePage/Feature'
import Footer from '@/components/HomePage/Footer'
import HeroSection from '@/components/HomePage/HeroSection'
import Nav from '@/components/Nav'

export default function Home() {

  return (
    <>
      <Nav />
      <HeroSection />
      <Feature />
      <Content />
      <Faq />
      <Footer />
    </>
  )
}
