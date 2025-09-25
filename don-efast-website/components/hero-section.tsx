import { Button } from "@/components/ui/button"
import { MessageCircle, Instagram } from "lucide-react"
import Lottie from "lottie-react"
import animationData from "@/public/animasi Donefast.json"

export function HeroSection() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center gradient-bg relative overflow-hidden">
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in slide-in-from-left duration-1000">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight">
                Layanan Joki Akademik
                <span className="block text-primary">DONE FAST</span>
              </h1>
              <p className="text-xl text-muted-foreground text-pretty max-w-2xl">
                Kami siap membantu segala masalah anda. Solusi cepat dan terpercaya untuk kebutuhan akademik Anda dengan
                kualitas terjamin.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:scale-105 pulse-glow"
                onClick={() => window.open("https://wa.me/6285998006060", "_blank")}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Hubungi via WhatsApp
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 bg-transparent"
                onClick={() => window.open("https://instagram.com/don_efast", "_blank")}
              >
                <Instagram className="w-5 h-5 mr-2" />
                Follow Instagram
              </Button>
            </div>
          </div>

          <div className="flex justify-center animate-in slide-in-from-right duration-1000 delay-300">
            <div className="relative">
                              <Lottie
                                animationData={animationData}
                                loop={true}
                                autoplay={true}
                                speed={0.5} // Set speed to 0.5 for half speed
                                className="w-full h-auto max-w-[400px]"
                                style={{ zIndex: 10 }}
                              />              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
