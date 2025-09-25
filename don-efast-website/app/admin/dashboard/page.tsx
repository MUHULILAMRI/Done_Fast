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
import { Loader2, LogOut, Search, ChevronLeft, ChevronRight, ClipboardCopy } from "lucide-react"
import type { CartItem } from "@/lib/cart-database"

// Define a more detailed type for the admin dashboard
interface AdminCartItem extends CartItem {
  users: {
    full_name: string | null
    phone: string | null
  } | null
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

export default function AdminDashboardPage() {
  const [allCartItems, setAllCartItems] = useState<AdminCartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const [messageTemplate, setMessageTemplate] = useState("")
  const [hasCopied, setHasCopied] = useState(false)
  const itemsPerPage = 10

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuthAndFetchItems = async () => {
      setLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/admin/login")
        return
      }

      try {
        // 1. Fetch all cart items
        const { data: cartData, error: cartError } = await supabase
          .from("cart_items")
          .select("*")
          .order("created_at", { ascending: false })

        if (cartError) {
          throw cartError
        }

        // 2. Extract unique user IDs from cart items
        const userIds = [...new Set(cartData.map((item) => item.user_id).filter(Boolean))]

        let usersData: { id: string; full_name: string | null; phone: string | null }[] = []

        // 3. Fetch user details if there are any user IDs
        if (userIds.length > 0) {
          const { data: fetchedUsers, error: usersError } = await supabase
            .from("users")
            .select("id, full_name, phone")
            .in("id", userIds)

          if (usersError) {
            console.error("Error fetching user details:", usersError.message)
          } else {
            usersData = fetchedUsers
          }
        }

        // 4. Create a map of user details for easy lookup
        const usersMap = new Map(usersData.map((user) => [user.id, user]))

        // 5. Merge cart items with user details
        const combinedData: AdminCartItem[] = cartData.map((item) => ({
          ...item,
          users: item.user_id ? usersMap.get(item.user_id) || null : null,
        }))

        setAllCartItems(combinedData)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndFetchItems()
  }, [router, supabase])

  const handleLogout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

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
    const userName = item.users?.full_name || "Pelanggan"
    const phone = item.users?.phone || "Tidak ada nomor"

    const message = `Halo, CS Done Fast.

Mohon diproses pesanan untuk pelanggan atas nama:
- Nama: ${userName}
- No. WA: ${phone}

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

  const filteredAndSearchedItems = useMemo(() => {
    let items = allCartItems

    if (filterStatus !== "all") {
      items = items.filter((item) => item.status === filterStatus)
    }

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase()
      items = items.filter(
        (item) =>
          item.service_title.toLowerCase().includes(lowerCaseQuery) ||
          item.package_name.toLowerCase().includes(lowerCaseQuery) ||
          item.user_id?.toLowerCase().includes(lowerCaseQuery) ||
          item.session_id?.toLowerCase().includes(lowerCaseQuery)
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
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
        <Loader2 className="h-8 w-8 animate-spin text-coral-500" />
        <p className="ml-2 text-white">Memuat dasbor...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-4 text-white">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <Button onClick={handleLogout} className="bg-coral-500 hover:bg-coral-600">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    )
  }

  return (
    <div className="p-4">
      <Card className="bg-slate-800/50 border-slate-700 text-white">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="text-3xl font-bold text-coral-500">Dasbor Admin</CardTitle>
          <div className="flex gap-2">
            <Button onClick={handleLogout} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Daftar Item Keranjang (Semua Pengguna)</h2>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Cari item keranjang..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1) // Reset to first page on search
                }}
                className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-coral-500"
              />
            </div>
            <Select
              value={filterStatus}
              onValueChange={(value) => {
                setFilterStatus(value)
                setCurrentPage(1) // Reset to first page on filter change
              }}
            >
              <SelectTrigger className="w-[180px] bg-slate-700 border-slate-600 text-white">
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
            <p className="text-slate-400">Tidak ada item di keranjang saat ini yang cocok dengan filter Anda.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="bg-slate-700/50">
                    <TableHead className="text-white">ID</TableHead>
                    <TableHead className="text-white">Layanan</TableHead>
                    <TableHead className="text-white">Paket</TableHead>
                    <TableHead className="text-white">Harga</TableHead>
                    <TableHead className="text-white">Jumlah</TableHead>
                    <TableHead className="text-white">Status</TableHead>
                    <TableHead className="text-white">Pengguna/Sesi</TableHead>
                    <TableHead className="text-white">Dibuat</TableHead>
                    <TableHead className="text-white">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedItems.map((item) => (
                    <TableRow key={item.id} className="border-slate-700 hover:bg-slate-700/30">
                      <TableCell className="font-medium text-sm">{item.id?.substring(0, 8)}...</TableCell>
                      <TableCell>{item.service_title}</TableCell>
                      <TableCell>{item.package_name}</TableCell>
                      <TableCell>{formatCurrency(item.price)}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        <Select
                          value={item.status || "pending"}
                          onValueChange={(newStatus) => updateCartItemStatus(item.id!, newStatus)}
                          disabled={loading}
                        >
                          <SelectTrigger className="w-[120px] bg-slate-700 border-slate-600 text-white">
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
                      <TableCell className="text-sm">
                        {item.user_id ? `User: ${item.user_id.substring(0, 8)}...` : `Session: ${item.session_id?.substring(0, 8)}...`}
                      </TableCell>
                      <TableCell className="text-sm">{new Date(item.created_at!).toLocaleString()}</TableCell>
                      <TableCell>
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-end items-center space-x-2 mt-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || loading}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-slate-300">
                Halaman {currentPage} dari {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || loading}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
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
              className={`w-full ${hasCopied ? "bg-green-600 hover:bg-green-700" : "bg-coral-500 hover:bg-coral-600"}`}
            >
              {hasCopied ? "Tersalin!" : "Salin Pesan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}