"use client";

import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { PackagesSection } from "@/components/packages-section"
import { HowToOrderSection } from "@/components/how-to-order-section"
import { ContactSection } from "@/components/contact-section"
import { TestimonialsSection } from "@/components/testimonials-section"
// import { FloatingWhatsApp } from "@/components/floating-whatsapp" // Removed
import { Footer } from "@/components/footer"
// import { RobotFullWithMovingEyes } from "@/components/robot-full-with-moving-eyes" // Removed

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <HowToOrderSection />
      <ServicesSection />
      <PackagesSection />
      <TestimonialsSection />
      <ContactSection />
      {/* <FloatingWhatsApp /> */}
      <Footer />

      {/* Robot Full Body with Moving Eyes Component - Fixed Position */}
      {/* Moved to HeroSection */}
    </main>
  )
}
