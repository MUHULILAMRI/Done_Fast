"use client"

import { useCart } from "./cart-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Minus, ShoppingCart, MessageCircle, Trash2, Loader2 } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export function CartSidebar() {
  const { state, dispatch, removeFromCart, updateQuantity, clearCart } = useCart()

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)

  const generateWhatsAppMessage = () => {
    if (state.items.length === 0) return ""

    let message = "Halo, saya ingin memesan layanan ini:\n\n"
    let grandTotal = 0

    state.items.forEach((item, index) => {
      const priceNumber = Number.parseInt(item.price.replace(/[^\d]/g, ""))
      const subtotal = priceNumber * item.quantity
      grandTotal += subtotal

      message += `${index + 1}. *${item.serviceName} - ${item.packageName}*\n`
      message += `   - Harga: ${item.price}\n`
      message += `   - Jumlah: ${item.quantity}\n`
      message += `   - Subtotal: Rp ${subtotal.toLocaleString("id-ID")}\n\n`
    })

    message += `*Total Pesanan: Rp ${grandTotal.toLocaleString("id-ID")}*\n\n`
    message += "Mohon tunggu konfirmasi dari admin untuk lebih lanjut mengenai proses pemesanan. Terima kasih!"

    return encodeURIComponent(message)
  }

  return (
    <Sheet open={state.isOpen} onOpenChange={() => dispatch({ type: "TOGGLE_CART" })}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="relative border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white bg-transparent"
          disabled={state.isLoading}
        >
          {state.isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-coral-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center p-0">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="bg-slate-900 border-slate-700 text-white w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-white flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Keranjang Layanan ({totalItems})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto py-6">
            {state.isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 text-slate-400 mx-auto mb-4 animate-spin" />
                <p className="text-slate-400">Memuat keranjang...</p>
              </div>
            ) : state.items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 mb-2">Keranjang masih kosong</p>
                <p className="text-sm text-slate-500">Tambahkan layanan yang Anda butuhkan</p>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white text-sm">{item.serviceName}</h4>
                        <p className="text-coral-500 text-sm font-medium">{item.packageName}</p>
                        <p className="text-slate-400 text-sm">{item.price}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 p-1 h-auto"
                        disabled={state.isLoading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 p-0 border-slate-600 hover:bg-slate-700"
                          disabled={state.isLoading}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-white font-medium min-w-[2rem] text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 p-0 border-slate-600 hover:bg-slate-700"
                          disabled={state.isLoading}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {state.items.length > 0 && (
            <div className="border-t border-slate-700 pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Total Item:</span>
                <span className="text-white font-semibold">{totalItems} layanan</span>
              </div>

              <Separator className="bg-slate-700" />

              <div className="space-y-3">
                <a
                  href={`https://wa.me/6285998006060?text=${generateWhatsAppMessage()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full bg-coral-500 hover:bg-coral-600 text-white" disabled={state.isLoading}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Pesan via WhatsApp
                  </Button>
                </a>

                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
                  disabled={state.isLoading}
                >
                  {state.isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Kosongkan Keranjang
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
