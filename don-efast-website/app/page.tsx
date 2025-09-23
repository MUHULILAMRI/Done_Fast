import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { PackagesSection } from "@/components/packages-section"
import { ContactSection } from "@/components/contact-section"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <PackagesSection />
      <ContactSection />
      <FloatingWhatsApp />
      <Footer />
    </main>
  )
}
