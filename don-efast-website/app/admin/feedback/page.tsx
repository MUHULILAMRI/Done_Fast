"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Search, ChevronLeft, ChevronRight, MessageSquare, Trash2, Eye } from "lucide-react"
import { toast } from "sonner"

interface FeedbackItem {
  id: string
  created_at: string
  name: string | null
  email: string | null
  message: string
  is_read: boolean
}

const itemsPerPage = 10

export default function AdminFeedbackPage() {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterReadStatus, setFilterReadStatus] = useState("all") // 'all', 'read', 'unread'
  const [currentPage, setCurrentPage] = useState(1)
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<FeedbackItem | null>(null)

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuthAndFetchFeedback = async () => {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/admin/login")
        return
      }

      try {
        const { data, error } = await supabase
          .from("feedback")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) {
          throw error
        }
        setFeedbackItems(data as FeedbackItem[])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndFetchFeedback()
  }, [router, supabase])

  const updateFeedbackReadStatus = async (id: string, isRead: boolean) => {
    try {
      const { error } = await supabase.from("feedback").update({ is_read: isRead }).eq("id", id)
      if (error) {
        throw error
      }
      setFeedbackItems((prevItems) =>
        prevItems.map((item) => (item.id === id ? { ...item, is_read: isRead } : item))
      )
      toast.success(`Status pesan diperbarui menjadi ${isRead ? "dibaca" : "belum dibaca"}`)
    } catch (err: any) {
      toast.error("Gagal memperbarui status: " + err.message)
    }
  }

  const deleteFeedback = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pesan ini?")) return
    try {
      const { error } = await supabase.from("feedback").delete().eq("id", id)
      if (error) {
        throw error
      }
      setFeedbackItems((prevItems) => prevItems.filter((item) => item.id !== id))
      toast.success("Pesan berhasil dihapus.")
    } catch (err: any) {
      toast.error("Gagal menghapus pesan: " + err.message)
    }
  }

  const filteredAndSearchedItems = useMemo(() => {
    let items = feedbackItems

    if (filterReadStatus === "read") {
      items = items.filter((item) => item.is_read)
    } else if (filterReadStatus === "unread") {
      items = items.filter((item) => !item.is_read)
    }

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase()
      items = items.filter(
        (item) =>
          (item.name && item.name.toLowerCase().includes(lowerCaseQuery)) ||
          (item.email && item.email.toLowerCase().includes(lowerCaseQuery)) ||
          item.message.toLowerCase().includes(lowerCaseQuery)
      )
    }
    return items
  }, [feedbackItems, filterReadStatus, searchQuery])

  const totalPages = Math.ceil(filteredAndSearchedItems.length / itemsPerPage)
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAndSearchedItems.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAndSearchedItems, currentPage, itemsPerPage])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-950 p-4">
        <Loader2 className="h-8 w-8 animate-spin text-coral-500" />
        <p className="ml-2 text-white">Memuat Kritik & Saran...</p>
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
      <h1 className="text-3xl font-bold text-white">Kritik & Saran Pengguna</h1>

      <Card className="bg-slate-800/50 border-slate-700 text-white">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Cari berdasarkan nama, email, atau pesan..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-coral-500"
              />
            </div>
            <Select
              value={filterReadStatus}
              onValueChange={(value) => {
                setFilterReadStatus(value)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px] bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Filter Status Baca" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="read">Sudah Dibaca</SelectItem>
                <SelectItem value="unread">Belum Dibaca</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {paginatedItems.length === 0 ? (
            <p className="text-center text-slate-400 py-12">Tidak ada kritik atau saran yang cocok dengan filter Anda.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="bg-slate-700/50 hover:bg-slate-700/50">
                    <TableHead className="text-white">ID</TableHead>
                    <TableHead className="text-white">Pengirim</TableHead>
                    <TableHead className="text-white">Pesan</TableHead>
                    <TableHead className="text-white">Status</TableHead>
                    <TableHead className="text-white">Tanggal</TableHead>
                    <TableHead className="text-white text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedItems.map((item) => (
                    <TableRow key={item.id} className="border-slate-700 hover:bg-slate-700/30">
                      <TableCell className="font-medium text-sm">#{item.id?.substring(0, 8)}</TableCell>
                      <TableCell className="text-sm">
                        <p className="font-medium text-white">{item.name || "Anonim"}</p>
                        <p className="text-xs text-slate-400">{item.email || "Tidak Ada Email"}</p>
                      </TableCell>
                      <TableCell className="text-sm text-slate-300 max-w-xs truncate">
                        {item.message}
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={item.is_read}
                          onCheckedChange={(checked) => updateFeedbackReadStatus(item.id, checked as boolean)}
                          id={`read-${item.id}`}
                          className="w-4 h-4"
                        />
                        <label htmlFor={`read-${item.id}`} className="ml-2 text-sm text-slate-400">
                          {item.is_read ? "Dibaca" : "Belum Dibaca"}
                        </label>
                      </TableCell>
                      <TableCell className="text-sm text-slate-400">{new Date(item.created_at!).toLocaleString()}</TableCell>
                      <TableCell className="flex gap-2 justify-end">
                        <Button
                          size="icon"
                          variant="outline"
                          className="border-indigo-500 text-indigo-500 hover:bg-indigo-500/20"
                          onClick={() => {
                            setSelectedMessage(item)
                            setIsMessageDialogOpen(true)
                            if (!item.is_read) updateFeedbackReadStatus(item.id, true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Lihat Pesan</span>
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="border-red-500 text-red-500 hover:bg-red-500/20"
                          onClick={() => deleteFeedback(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Hapus Pesan</span>
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

      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-coral-500">Detail Pesan</DialogTitle>
            <DialogDescription className="text-slate-400">
              Pesan dari {selectedMessage?.name || "Anonim"} ({selectedMessage?.email || "Tidak Ada Email"})
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              readOnly
              value={selectedMessage?.message}
              className="h-64 bg-slate-700/50 border-slate-600 text-white whitespace-pre-wrap"
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setIsMessageDialogOpen(false)} className="bg-coral-500 hover:bg-coral-600">
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
