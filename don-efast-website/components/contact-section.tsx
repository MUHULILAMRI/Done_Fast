"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Instagram } from "lucide-react"

export function ContactSection() {
  return (
    <section id="kontak" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-in fade-in duration-1000">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Hubungi Kami</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Siap membantu Anda 24/7. Konsultasi gratis untuk menentukan solusi terbaik
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="group hover:scale-105 transition-all duration-300 hover:shadow-xl animate-in slide-in-from-left duration-1000">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/20 transition-colors">
                <MessageCircle className="w-8 h-8 text-green-500" />
              </div>
              <CardTitle className="text-xl">WhatsApp</CardTitle>
              <CardDescription>Chat langsung untuk konsultasi cepat</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-2xl font-bold">085998006060</p>
              <Button
                className="w-full bg-green-500 hover:bg-green-600 text-white transition-all duration-300 hover:scale-105"
                onClick={() => window.open("https://wa.me/6285998006060", "_blank")}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat Sekarang
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:scale-105 transition-all duration-300 hover:shadow-xl animate-in slide-in-from-right duration-1000 delay-200">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-colors">
                <Instagram className="w-8 h-8 text-purple-500" />
              </div>
              <CardTitle className="text-xl">Instagram</CardTitle>
              <CardDescription>Follow untuk update dan portfolio terbaru</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-2xl font-bold">@don_efast</p>
              <Button
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-all duration-300 hover:scale-105"
                onClick={() => window.open("https://instagram.com/don_efast", "_blank")}
              >
                <Instagram className="w-4 h-4 mr-2" />
                Follow Instagram
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
