"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { getServices, categories, type Service } from "@/lib/services"
import { ServiceDetailDrawer } from "@/components/service-detail-drawer"

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

export default function ServicesPage() {
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    const fetchServicesData = async () => {
      setLoadingServices(true);
      const servicesData = await getServices();
      setAllServices(servicesData);
      setLoadingServices(false);
    };
    fetchServicesData();
  }, []);

  const filteredServices = allServices.filter((service) => {
    const matchesCategory = selectedCategory === "All" || service.category === selectedCategory;
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryCount = (category: string) => {
    if (category === "All") return allServices.length;
    return allServices.filter((service) => service.category === category).length;
  };

  if (loadingServices) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <Loader2 className="h-8 w-8 animate-spin text-coral-500" />
        <p className="ml-2">Memuat layanan...</p>
      </div>
    );
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
            Jelajahi semua layanan kami dan temukan solusi yang paling tepat untuk Anda.
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

      {/* Services Grid */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
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

          {/* Services List */}
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service) => {
                const IconComponent = service.icon
                return (
                  <Card
                    key={service.id}
                    className="bg-slate-800/50 border border-slate-700 rounded-xl flex flex-col transition-all duration-300 hover:border-coral-500 hover:shadow-2xl hover:shadow-coral-500/10"
                  >
                    <CardHeader className="relative">
                      {service.popular && (
                        <Badge className="absolute top-0 right-0 -mt-2 -mr-2 bg-coral-500 text-white">
                          <Star className="w-3 h-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                      <div className="flex items-center gap-4">
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
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col">
                      <CardDescription className="text-slate-300 text-base mb-6 flex-grow">
                        {service.description.substring(0, 120)}...
                      </CardDescription>
                      <div className="pt-4 border-t border-slate-700">
                        <p className="text-sm text-slate-400">Mulai dari</p>
                        <p className="text-2xl font-bold text-coral-500">{formatCurrency(service.price || 0)}</p>
                      </div>
                    </CardContent>
                    <div className="p-6 pt-0">
                        <Button 
                            className="w-full bg-coral-500 hover:bg-coral-600 text-white"
                            onClick={() => setSelectedService(service)}
                        >
                            Pilih Paket
                        </Button>
                    </div>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-800/50 rounded-lg">
              <p className="text-slate-400 text-lg mb-4">Tidak ada layanan yang ditemukan</p>
              <p className="text-slate-500 mb-6">Coba ubah kategori atau kata kunci pencarian Anda.</p>
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
      </section>

      <Footer />

      <ServiceDetailDrawer 
        service={selectedService} 
        isOpen={selectedService !== null} 
        onClose={() => setSelectedService(null)} 
      />
    </div>
  )
}
