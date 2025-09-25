"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Loader2, Search, ChevronLeft, ChevronRight, ClipboardCopy, ReceiptText } from "lucide-react"
import type { CartItem } from "@/lib/cart-database"

// Define a more detailed type for this page
interface AdminCartItem extends CartItem {
  customer_name?: string | null
  customer_phone?: string | null
}

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

const statusOptions = ["all", "pending", "proses", "success", "failed"]

export default function AdminOrdersPage() {
  const [allCartItems, setAllCartItems] = useState<AdminCartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const [messageTemplate, setMessageTemplate] = useState("")
  const [hasCopied, setHasCopied] = useState(false)
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false)
  const [selectedInvoiceItem, setSelectedInvoiceItem] = useState<AdminCartItem | null>(null)
  const itemsPerPage = 10

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuthAndFetchItems = async () => {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/admin/login")
        return
      }

      try {
        const { data, error } = await supabase
          .from("cart_items")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) {
          throw error
        }
        setAllCartItems(data as AdminCartItem[])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndFetchItems()
  }, [router, supabase])

  const updateCartItemStatus = async (itemId: string, newStatus: string) => {
    setLoading(true)
    try {
      const { error } = await supabase.from("cart_items").update({ status: newStatus }).eq("id", itemId)

      if (error) {
        setError(error.message)
      } else {
        setAllCartItems((prevItems) =>
          prevItems.map((item) => (item.id === itemId ? { ...item, status: newStatus } : item))
        )
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateTemplate = (item: AdminCartItem) => {
    const userName = item.customer_name || "Pelanggan"
    const phone = item.customer_phone || "Tidak ada nomor"

    const message = `Halo, CS Done Fast.

Detail Pesanan:
- Layanan: ${item.service_title}
- Paket: ${item.package_name}
- Jumlah: ${item.quantity}
- Total: ${formatCurrency(item.price * item.quantity)}
- Status Saat Ini: ${item.status}

Terima kasih.`

    setMessageTemplate(message)
    setHasCopied(false)
    setIsTemplateDialogOpen(true)
  }

  const handleViewInvoice = (item: AdminCartItem) => {
    setSelectedInvoiceItem(item)
    setIsInvoiceDialogOpen(true)
  }

  const filteredAndSearchedItems = useMemo(() => {
    let items = allCartItems

    if (filterStatus !== "all") {
      items = items.filter((item) => item.status === filterStatus)
    }

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase()
      items = items.filter(
        (item) =>
          (item.customer_name && item.customer_name.toLowerCase().includes(lowerCaseQuery)) ||
          (item.customer_phone && item.customer_phone.toLowerCase().includes(lowerCaseQuery)) ||
          item.service_title.toLowerCase().includes(lowerCaseQuery) ||
          item.package_name.toLowerCase().includes(lowerCaseQuery)
      )
    }
    return items
  }, [allCartItems, filterStatus, searchQuery])

  const totalPages = Math.ceil(filteredAndSearchedItems.length / itemsPerPage)
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAndSearchedItems.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAndSearchedItems, currentPage, itemsPerPage])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-950 p-4">
        <Loader2 className="h-8 w-8 animate-spin text-coral-500" />
        <p className="ml-2 text-white">Memuat Pesanan...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-slate-950 p-4 text-white">
        <p className="text-red-500 mb-4">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Daftar Pesanan</h1>
      <Card className="bg-slate-800/50 border-slate-700 text-white">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Cari berdasarkan nama, no. hp, layanan..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-coral-500"
              />
            </div>
            <Select
              value={filterStatus}
              onValueChange={(value) => {
                setFilterStatus(value)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px] bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {paginatedItems.length === 0 ? (
            <p className="text-center text-slate-400 py-12">Tidak ada pesanan yang cocok dengan filter Anda.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="bg-slate-700/50 hover:bg-slate-700/50">
                    <TableHead className="text-white">ID Pesanan</TableHead>
                    <TableHead className="text-white">Pelanggan</TableHead>
                    <TableHead className="text-white">Layanan</TableHead>
                    <TableHead className="text-white">Harga</TableHead>
                    <TableHead className="text-white">Status</TableHead>
                    <TableHead className="text-white">Dibuat</TableHead>
                    <TableHead className="text-white">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedItems.map((item) => (
                    <TableRow key={item.id} className="border-slate-700 hover:bg-slate-700/30">
                      <TableCell className="font-medium text-sm">#{item.id?.substring(0, 8)}</TableCell>
                      <TableCell className="text-sm">
                        {item.customer_name ? (
                          <div>
                            <p className="font-medium text-white">{item.customer_name}</p>
                            <p className="text-xs text-slate-400">{item.customer_phone}</p>
                          </div>
                        ) : (
                          <span className="text-slate-400">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-white">{item.service_title}</p>
                        <p className="text-xs text-slate-400">{item.package_name}</p>
                      </TableCell>
                      <TableCell>{formatCurrency(item.price * item.quantity)}</TableCell>
                      <TableCell>
                        <Select
                          value={item.status || "pending"}
                          onValueChange={(newStatus) => updateCartItemStatus(item.id!, newStatus)}
                          disabled={loading}
                        >
                          <SelectTrigger className="w-[120px] bg-slate-700 border-slate-600 text-white text-xs">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700 text-white">
                            {statusOptions.filter(s => s !== 'all').map((status) => (
                              <SelectItem key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-sm text-slate-400">{new Date(item.created_at!).toLocaleString()}</TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="border-cyan-500 text-cyan-500 hover:bg-cyan-500/20"
                          onClick={() => handleGenerateTemplate(item)}
                          disabled={loading}
                        >
                          <ClipboardCopy className="h-4 w-4" />
                          <span className="sr-only">Buat Template Pesan</span>
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="border-indigo-500 text-indigo-500 hover:bg-indigo-500/20"
                          onClick={() => handleViewInvoice(item)}
                          disabled={loading}
                        >
                          <ReceiptText className="h-4 w-4" />
                          <span className="sr-only">Lihat Invoice</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-end items-center space-x-2 mt-4 border-t border-slate-700 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || loading}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Sebelumnya
              </Button>
              <span className="text-sm text-slate-300">
                Halaman {currentPage} dari {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || loading}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Berikutnya
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
        <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-coral-500">Template Pesan untuk CS</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              readOnly
              value={messageTemplate}
              className="h-64 bg-slate-700/50 border-slate-600 text-white whitespace-pre-wrap"
            />
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(messageTemplate)
                setHasCopied(true)
                setTimeout(() => setHasCopied(false), 2000)
              }}
              className={`w-full transition-colors ${hasCopied ? "bg-green-600 hover:bg-green-700" : "bg-coral-500 hover:bg-coral-600"}`}
            >
              {hasCopied ? "Tersalin!" : "Salin Pesan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-slate-800 border-slate-700 text-white p-6">
          <DialogHeader>
            <DialogTitle className="text-coral-500 text-2xl">Faktur Pembayaran</DialogTitle>
          </DialogHeader>
          {selectedInvoiceItem && (
            <div className="space-y-4 text-slate-300">
              <div className="flex justify-between text-sm">
                <p>Invoice ID: <span className="font-medium">#{selectedInvoiceItem.id?.substring(0, 8)}</span></p>
                <p>Tanggal: <span className="font-medium">{new Date(selectedInvoiceItem.created_at!).toLocaleDateString()}</span></p>
              </div>

              <div className="border-t border-slate-700 pt-4">
                <h3 className="font-semibold text-white mb-2">Detail Pelanggan:</h3>
                <p>Nama: <span className="font-medium">{selectedInvoiceItem.customer_name || "N/A"}</span></p>
                <p>No. WA: <span className="font-medium">{selectedInvoiceItem.customer_phone || "N/A"}</span></p>
              </div>

              <div className="border-t border-slate-700 pt-4">
                <h3 className="font-semibold text-white mb-2">Detail Pesanan:</h3>
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="bg-slate-700/50 hover:bg-slate-700/50">
                      <TableHead className="text-white">Layanan</TableHead>
                      <TableHead className="text-white">Paket</TableHead>
                      <TableHead className="text-white">Harga Satuan</TableHead>
                      <TableHead className="text-white">Jumlah</TableHead>
                      <TableHead className="text-white text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="border-slate-700">
                      <TableCell>{selectedInvoiceItem.service_title}</TableCell>
                      <TableCell>{selectedInvoiceItem.package_name}</TableCell>
                      <TableCell>{formatCurrency(selectedInvoiceItem.price)}</TableCell>
                      <TableCell>{selectedInvoiceItem.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(selectedInvoiceItem.price * selectedInvoiceItem.quantity)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="border-t border-slate-700 pt-4 flex justify-between items-center text-lg font-bold text-white">
                <span>Total Pembayaran:</span>
                <span>{formatCurrency(selectedInvoiceItem.price * selectedInvoiceItem.quantity)}</span>
              </div>
            </div>
          )}
          <DialogFooter className="pt-4">
            <Button onClick={() => window.print()} className="bg-coral-500 hover:bg-coral-600">
              Cetak Faktur
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
