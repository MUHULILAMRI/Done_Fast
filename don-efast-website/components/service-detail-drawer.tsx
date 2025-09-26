"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star, Clock, Shield, X } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import type { Service } from "@/lib/services" // Assuming you have a Service type defined

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

interface ServiceDetailDrawerProps {
  service: Service | null
  isOpen: boolean
  onClose: () => void
}

export function ServiceDetailDrawer({ service, isOpen, onClose }: ServiceDetailDrawerProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const { addToCart } = useCart()

  // Reset selection when service changes
  useEffect(() => {
    if (service) {
      setSelectedOptions([])
    }
  }, [service])

  const handleOptionSelection = (optionId: string) => {
    setSelectedOptions((prev) =>
      prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]
    )
  }

  const totalPrice = useMemo(() => {
    if (!service || !service.subOptions) return service?.price || 0

    if (selectedOptions.length === 0) {
      return service.price || 0 // Return base price if no options are selected
    }

    return selectedOptions.reduce((total, optionId) => {
      const subOption = service.subOptions?.find((opt) => opt.id === optionId)
      return total + (subOption?.price || 0)
    }, 0)
  }, [selectedOptions, service])

  const handleAddToCart = () => {
    if (!service) return

    if (service.subOptions && selectedOptions.length > 0) {
      selectedOptions.forEach((optionId) => {
        const subOption = service.subOptions?.find((opt) => opt.id === optionId)
        if (subOption) {
          addToCart({
            service_slug: service.id,
            service_title: service.title,
            package_name: subOption.name,
            price: subOption.price,
          })
        }
      })
    } else if (!service.subOptions) {
      addToCart({
        service_slug: service.id,
        service_title: service.title,
        package_name: "Paket Tunggal",
        price: service.price || 0,
      })
    }
    onClose() // Close drawer after adding to cart
  }

  if (!service) {
    return null
  }

  const IconComponent = service.icon

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="bg-slate-900 border-slate-800 text-white max-h-[90vh]">
        <div className="mx-auto w-full max-w-3xl overflow-y-auto p-4">
          <DrawerHeader className="text-left">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-coral-500/20 rounded-lg flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-coral-500" />
                    </div>
                    <div>
                        <DrawerTitle className="text-white text-2xl mb-1">{service.title}</DrawerTitle>
                        <Badge variant="outline" className="text-slate-400 border-slate-600">
                            {service.category}
                        </Badge>
                    </div>
                </div>
                <DrawerClose asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <X className="w-5 h-5" />
                    </Button>
                </DrawerClose>
            </div>
            <DrawerDescription className="text-slate-300 text-base">{service.description}</DrawerDescription>
          </DrawerHeader>

          <div className="px-4 space-y-6">
            {/* Pricing/Options */}
            <div className="space-y-4">
              <h3 className="text-white text-lg font-semibold">
                {service.subOptions ? "Pilih Opsi Paket" : "Harga Paket"}
              </h3>
              {!service.subOptions ? (
                <div className="flex justify-between items-center p-4 rounded-lg border border-slate-700 bg-slate-800/50">
                  <p className="font-medium leading-none text-white">Paket Tunggal</p>
                  <div className="font-semibold text-coral-500 text-xl">{formatCurrency(service.price || 0)}</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {service.subOptions.map((option) => {
                    const isOptionSelected = selectedOptions.includes(option.id)
                    return (
                      <div
                        key={option.id}
                        className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                          isOptionSelected ? "border-coral-500 bg-slate-800" : "border-slate-700 hover:border-slate-600"
                        }`}
                        onClick={() => handleOptionSelection(option.id)}
                      >
                        <div className="flex items-center">
                          <Checkbox
                            id={`option-${option.id}`}
                            checked={isOptionSelected}
                            onCheckedChange={() => handleOptionSelection(option.id)}
                            className="w-5 h-5 mr-4"
                          />
                          <label htmlFor={`option-${option.id}`} className="text-base font-medium leading-none text-white cursor-pointer">
                            {option.name}
                          </label>
                        </div>
                        <span className="font-semibold text-coral-500 text-lg">
                          {formatCurrency(option.price)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Features */}
            <div className="space-y-3">
              <h3 className="text-white text-lg font-semibold">Fitur Termasuk</h3>
              {service.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-slate-300">
                  <div className="w-2 h-2 bg-coral-500 rounded-full flex-shrink-0" />
                  <span>{feature}</span>
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
          </div>

          <DrawerFooter className="pt-8">
            <div className="flex justify-between items-center mb-4">
                <div className="text-slate-300">Total Harga:</div>
                <div className="text-white text-2xl font-bold">{formatCurrency(totalPrice)}</div>
            </div>
            <Button
              onClick={handleAddToCart}
              disabled={service.subOptions && selectedOptions.length === 0}
              className="w-full bg-coral-500 hover:bg-coral-600 text-white text-lg py-6 disabled:bg-slate-600"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Tambah ke Keranjang
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
