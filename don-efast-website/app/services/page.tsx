"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Star,
  Clock,
  Shield,
  Search,
  ShoppingCart,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useCart } from "@/components/cart-provider"
import { services, categories } from "@/lib/services" // Import from new file

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]) // Stores IDs of selected sub-options
  const { addToCart } = useCart()

  const filteredServices = services.filter((service) => {
    const matchesCategory = selectedCategory === "All" || service.category === selectedCategory
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.features.some((feature) => feature.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (service.subOptions &&
        service.subOptions.some(
          (option) =>
            option.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            option.features.some((feature) => feature.toLowerCase().includes(searchQuery.toLowerCase()))
        ))

    return matchesCategory && matchesSearch
  })

  const getCategoryCount = (category: string) => {
    if (category === "All") return services.length
    return services.filter((service) => service.category === category).length
  }

  const handleOptionSelection = (optionId: string) => {
    setSelectedOptions((prev) => {
      const newSelection = prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]
      console.log("Selected Options after toggle:", newSelection)
      return newSelection
    })
  }

  const totalPrice = selectedOptions.reduce((total, optionId) => {
    // Find the service and then the sub-option
    for (const service of services) {
      if (service.subOptions) {
        const subOption = service.subOptions.find((opt) => opt.id === optionId)
        if (subOption) {
          return total + subOption.price
        }
      }
      // If a service doesn't have subOptions but was somehow selected (shouldn't happen with current logic)
      // const mainService = services.find((s) => s.id === optionId);
      // if (mainService) return total + mainService.price;
    }
    return total
  }, 0)

  const handleAddToCartSingle = (service: (typeof services)[0]) => {
    console.log("Adding single service to cart:", service)
    addToCart({
      service_slug: service.id,
      service_title: service.title,
      package_name: "Paket Tunggal", // Default package name for single services
      price: service.price || 0,
    })
  }

  const handleAddToCart = () => {
    console.log("Attempting to add to cart. Selected options:", selectedOptions)
    selectedOptions.forEach((optionId) => {
      for (const service of services) {
        if (service.subOptions) {
          const subOption = service.subOptions.find((opt) => opt.id === optionId)
          if (subOption) {
            addToCart({
              service_slug: service.id,
              service_title: service.title,
              package_name: subOption.name,
              price: subOption.price,
            })
          }
        }
      }
    })
    setSelectedOptions([]) // Clear selection after adding to cart
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />
      <FloatingWhatsApp />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-balance">
            Pilih <span className="text-coral-500">Layanan</span> Sesuai Kebutuhan
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto text-pretty">
            Centang layanan yang Anda inginkan dan lihat total harganya secara otomatis.
          </p>

          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Cari layanan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-coral-500"
            />
          </div>
        </div>
      </section>

      {/* Services Grid & Price Calculator */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === selectedCategory ? "default" : "outline"}
                className={
                  category === selectedCategory
                    ? "bg-coral-500 hover:bg-coral-600 text-white border-coral-500"
                    : "border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
                }
                onClick={() => setSelectedCategory(category)}
              >
                {category}
                <Badge variant="secondary" className="ml-2 bg-slate-700 text-slate-300 text-xs">
                  {getCategoryCount(category)}
                </Badge>
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Services List */}
            <div className="lg:col-span-2 space-y-4">
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => {
                  const IconComponent = service.icon
                  // const isSelected = selectedOptions.includes(service.id) // No longer selecting main service
                  return (
                    <Card
                      key={service.id}
                      className={`bg-slate-800/50 border-2 transition-all duration-300 group ${
                        // isSelected ? "border-coral-500" : "border-slate-700"
                        "border-slate-700" // Border based on sub-option selection
                      }`}
                    >
                      <CardHeader className="relative pb-4">
                        {service.popular && (
                          <Badge className="absolute -top-2 -right-2 bg-coral-500 text-white">
                            <Star className="w-3 h-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 bg-coral-500/20 rounded-lg">
                            <IconComponent className="w-6 h-6 text-coral-500" />
                          </div>
                          <div>
                            <CardTitle className="text-white text-xl">{service.title}</CardTitle>
                            <Badge variant="outline" className="text-slate-400 border-slate-600 mt-1">
                              {service.category}
                            </Badge>
                          </div>
                        </div>
                        <CardDescription className="text-slate-300 text-base">{service.description}</CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-6 pt-0">
                        {/* Base Price / Sub-options */}
                        {!service.subOptions ? (
                          <div className="flex justify-between items-center p-3 rounded-lg border border-slate-600">
                            <div>
                              <p className="text-sm font-medium leading-none text-white">Paket Tunggal</p>
                              <p className="text-xs text-slate-400">Layanan ini tidak memiliki opsi tambahan</p>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-coral-500">{formatCurrency(service.price || 0)}</div>
                              <Button
                                size="sm"
                                variant="outline"
                                className="mt-2 border-coral-500 text-coral-500 hover:bg-coral-500 hover:text-white"
                                onClick={() => handleAddToCartSingle(service)}
                              >
                                Tambah
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <p className="text-white text-lg font-semibold">Pilih Opsi:</p>
                            {service.subOptions.map((option) => {
                              const isOptionSelected = selectedOptions.includes(option.id)
                              return (
                                <div
                                  key={option.id}
                                  className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                                    isOptionSelected ? "border-coral-500 bg-slate-700/50" : "border-slate-600 hover:bg-slate-800/70"
                                  }`}
                                  onClick={() => handleOptionSelection(option.id)}
                                >
                                  <div className="flex items-center">
                                    <Checkbox
                                      id={`option-${option.id}`}
                                      checked={isOptionSelected}
                                      onCheckedChange={() => handleOptionSelection(option.id)}
                                      className="w-5 h-5 mr-3"
                                    />
                                    <label
                                      htmlFor={`option-${option.id}`}
                                      className="text-sm font-medium leading-none text-white cursor-pointer"
                                    >
                                      {option.name}
                                    </label>
                                  </div>
                                  <span className="font-semibold text-coral-500">
                                    {formatCurrency(option.price)}
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        )}

                        {/* Features */}
                        <div className="space-y-3">
                          <p className="text-white text-lg font-semibold">Fitur Termasuk:</p>
                          {(service.subOptions ? service.features : service.features).map((feature, index) => (
                            <div key={index} className="flex items-center gap-3 text-slate-300">
                              <div className="w-2 h-2 bg-coral-500 rounded-full flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>

                        {/* Service Info */}
                        <div className="flex justify-between text-sm text-slate-400 pt-4 border-t border-slate-700">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{service.deliveryTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            <span>{service.revisions}</span>
                          </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="space-y-3 pt-4">
                          <div className="flex gap-3 mt-3">
                            <Link href={`/services/${service.id}`} className="flex-1">
                              <Button
                                variant="outline"
                                className="w-full border-coral-500 text-coral-500 hover:bg-coral-500 hover:text-white bg-transparent"
                              >
                                Detail Paket
                              </Button>
                            </Link>
                            <Link
                              href={`https://wa.me/6285998006060?text=Halo, saya tertarik dengan layanan ${service.title}`}
                              className="flex-1"
                            >
                              <Button className="w-full bg-coral-500 hover:bg-coral-600 text-white">
                                Pesan Sekarang
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              ) : (
                <div className="col-span-full text-center py-16 bg-slate-800/50 rounded-lg">
                  <div className="text-slate-400 text-lg mb-4">Tidak ada layanan yang ditemukan</div>
                  <p className="text-slate-500 mb-6">Coba ubah kategori atau kata kunci pencarian Anda</p>
                  <Button
                    onClick={() => {
                      setSelectedCategory("All")
                      setSearchQuery("")
                    }}
                    className="bg-coral-500 hover:bg-coral-600 text-white"
                  >
                    Reset Filter
                  </Button>
                </div>
              )}
            </div>

            {/* Price Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white text-xl">Ringkasan Pesanan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedOptions.length > 0 ? (
                      <div className="space-y-3">
                        {selectedOptions.map((optionId) => {
                          let optionName = ""
                          let optionPrice = 0
                          for (const service of services) {
                            if (service.subOptions) {
                              const subOption = service.subOptions.find((opt) => opt.id === optionId)
                              if (subOption) {
                                optionName = `${service.title} - ${subOption.name}`
                                optionPrice = subOption.price
                                break
                              }
                            }
                          }
                          return (
                            <div key={optionId} className="flex justify-between items-center text-slate-300">
                              <span>{optionName}</span>
                              <span className="font-semibold">{formatCurrency(optionPrice)}</span>
                            </div>
                          )
                        })}
                        <div className="border-t border-slate-700 my-3"></div>
                        <div className="flex justify-between items-center text-white text-lg font-bold">
                          <span>Total</span>
                          <span>{formatCurrency(totalPrice)}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-400">Pilih layanan untuk melihat ringkasan harga.</p>
                    )}
                    <Button
                      onClick={handleAddToCart}
                      disabled={selectedOptions.length === 0}
                      className="w-full mt-6 bg-coral-500 hover:bg-coral-600 text-white disabled:bg-slate-600"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Tambah ke Keranjang
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
