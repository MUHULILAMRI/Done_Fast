"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Syahril Akbar, S.Kom. CADS., MTCNA",
    title: "Mahasiswa S1",
    avatar: "/placeholder-user.jpg",
    rating: 5,
    quote: "Mantapki tawwa Done Fast! Terima kasih banyak!",
  },
  {
    name: "Sony Achmad Djalil., S.Kom., MTCNA",
    title: "Mahasiswa S1",
    avatar: "/placeholder-user.jpg",
    rating: 5,
    quote: "Recomendasi mentong ini jokian, satset baru cepat selesai sesuai dengan nama Done Fast",
  },
  {
    name: "Risal, S.Pd",
    title: "Mahasiswa Pendidikan",
    avatar: "/placeholder-user.jpg",
    rating: 5,
    quote: "Mantap",
  },
]

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${i < rating ? "text-coral-500 fill-coral-500" : "text-slate-600"}`}
        />
      ))}
    </div>
  )
}

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Apa Kata Klien Kami?</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto text-balance">
            Kami bangga telah membantu ratusan klien mencapai tujuan mereka.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-slate-800/50 border border-slate-700 rounded-xl flex flex-col p-6 transition-all duration-300 hover:border-coral-500"
            >
              <CardContent className="p-0 flex-grow">
                <StarRating rating={testimonial.rating} />
                <p className="text-slate-300 mt-4 text-lg leading-relaxed italic">"{testimonial.quote}"</p>
              </CardContent>
              <CardHeader className="p-0 mt-6 pt-6 border-t border-slate-700">
                <div className="flex items-center gap-4">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-14 h-14 rounded-full object-cover" />
                  <div>
                    <p className="font-bold text-white text-lg">{testimonial.name}</p>
                    <p className="text-sm text-slate-400">{testimonial.title}</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
