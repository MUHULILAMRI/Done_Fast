"use client"

import { useEffect, useState, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
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
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  DollarSign,
  ShoppingCart,
  CheckCircle,
  Loader as LoaderIcon, // Renamed to avoid conflict
  Trash2,
  MessageSquare,
} from "lucide-react"
import type { CartItem } from "@/lib/cart-database"
import { Loader2 } from "lucide-react"

import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

// Helper function to format WhatsApp number
const formatWaNumber = (phone: string | null | undefined) => {
  if (!phone) return ''
  let cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('0')) {
    return '62' + cleaned.substring(1)
  }
  if (cleaned.startsWith('62')) {
    return cleaned
  }
  return '62' + cleaned
}

const barChartConfig = {
  revenue: {
    label: "Pendapatan",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const pieChartConfig = {
  pending: {
    label: "Pesanan Diterima",
    color: "#facc15", // Yellow-400
  },
  proses: {
    label: "Dalam Pengerjaan",
    color: "#3b82f6", // Blue-500
  },
  success: {
    label: "Pesanan Selesai",
    color: "#22c55e", // Green-500
  },
  failed: {
    label: "Gagal",
    color: "#ef4444", // Red-500
  },
} satisfies ChartConfig

const statusDisplay: { [key: string]: { label: string; color: string } } = {
  pending: { label: "Pesanan Diterima", color: "bg-yellow-500/20 text-yellow-400" },
  proses: { label: "Dalam Pengerjaan", color: "bg-blue-500/20 text-blue-400" },
  success: { label: "Pesanan Selesai", color: "bg-green-500/20 text-green-400" },
  failed: { label: "Gagal", color: "bg-red-500/20 text-red-400" },
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState("all")

  useEffect(() => {
    const supabase = createClient()

    // Helper to check if a date string is within the selected date range
    const isWithinRange = (dateStr: string) => {
      if (dateRange === "all") return true

      const date = new Date(dateStr)
      const now = new Date()
      const daysToSubtract = {
        "7d": 7,
        "30d": 30,
        "90d": 90,
      }[dateRange]

      if (!daysToSubtract) return true

      const pastDate = new Date()
      pastDate.setDate(now.getDate() - daysToSubtract)
      pastDate.setHours(0, 0, 0, 0) // Start of the day

      return date >= pastDate
    }

    const fetchData = async () => {
      setLoading(true)
      let query = supabase.from("cart_items").select("*").order("created_at", { ascending: false })

      if (dateRange !== "all") {
        const date = new Date()
        const daysToSubtract = {
          "7d": 7,
          "30d": 30,
          "90d": 90,
        }[dateRange]

        if (daysToSubtract) {
          date.setDate(date.getDate() - daysToSubtract)
          date.setHours(0, 0, 0, 0) // Start of the day
          query = query.gte("created_at", date.toISOString())
        }
      }

      const { data: cartData, error: cartError } = await query

      if (cartError) {
        setError(cartError.message)
      } else {
        setData(cartData as CartItem[])
      }
      setLoading(false)
    }

    fetchData()

    const channel = supabase
      .channel("cart_items_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "cart_items" },
        (payload) => {
          console.log("Realtime change received:", payload)
          const newData = payload.new as CartItem
          const oldId = (payload.old as { id: string })?.id

          setData((currentData) => {
            if (payload.eventType === "INSERT") {
              return isWithinRange(newData.created_at) ? [newData, ...currentData] : currentData
            }

            if (payload.eventType === "UPDATE") {
              const itemIsInRange = isWithinRange(newData.created_at)
              const itemIsInCurrentData = currentData.some((item) => item.id === newData.id)

              if (itemIsInRange && !itemIsInCurrentData) {
                // Add item that moved into range, and re-sort
                return [...currentData, newData].sort(
                  (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                )
              } else if (!itemIsInRange && itemIsInCurrentData) {
                // Remove item that moved out of range
                return currentData.filter((item) => item.id !== newData.id)
              } else {
                // Update item already in range
                return currentData.map((item) => (item.id === newData.id ? newData : item))
              }
            }

            if (payload.eventType === "DELETE") {
              return currentData.filter((item) => item.id !== oldId)
            }

            return currentData
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [dateRange])

  const analytics = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        totalRevenue: 0,
        totalOrders: 0,
        successfulOrders: 0,
        pendingOrders: 0,
        revenueByService: [],
        ordersByStatus: [],
        recentOrders: [],
      }
    }

    const successfulItems = data.filter((item) => item.status === "success")
    const totalRevenue = successfulItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

    const COLOR_PALETTE = ["#3b82f6", "#22c55e", "#f97316", "#8b5cf6", "#ec4899", "#14b8a6"]

    const revenueByService = data
      .reduce((acc, item) => {
        if (item.status !== "success") return acc
        const service = item.service_title
        const revenue = item.price * item.quantity
        const existing = acc.find((s) => s.name === service)
        if (existing) {
          existing.revenue += revenue
        } else {
          acc.push({ name: service, revenue })
        }
        return acc
      }, [] as { name: string; revenue: number }[])
      .map((item, index) => ({
        ...item,
        fill: COLOR_PALETTE[index % COLOR_PALETTE.length],
      }))

    const ordersByStatus = Object.entries(
      data.reduce((acc, item) => {
        const status = item.status || "pending"
        acc[status] = (acc[status] || 0) + 1
        return acc
      }, {} as { [key: string]: number })
    ).map(([name, count]) => ({ name, count }))

    return {
      totalRevenue,
      totalOrders: data.length,
      successfulOrders: successfulItems.length,
      pendingOrders: data.filter((item) => item.status === "pending" || item.status === "proses").length,
      revenueByService: revenueByService.sort((a, b) => b.revenue - a.revenue),
      ordersByStatus,
      recentOrders: data.slice(0, 5),
    }
  }, [data])

  const [itemToDelete, setItemToDelete] = useState<CartItem | null>(null)

  const handleDelete = async () => {
    if (!itemToDelete) return

    const supabase = createClient()
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .match({ id: itemToDelete.id })

    if (error) {
      toast.error(`Gagal menghapus pesanan: ${error.message}`)
    } else {
      toast.success("Pesanan telah berhasil dihapus.")
    }
    setItemToDelete(null) // Close the dialog
  }

  const updateCartItemStatus = async (itemId: string, newStatus: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("cart_items").update({ status: newStatus }).eq("id", itemId)

    if (error) {
      toast.error(`Gagal memperbarui status: ${error.message}`)
    } else {
      const statusLabel = statusDisplay[newStatus]?.label || newStatus
      toast.success(`Status pesanan diperbarui menjadi "${statusLabel}"`)
      // The real-time subscription will handle the UI update
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-coral-500" />
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">Error loading dashboard data: {error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Dasbor Analitik</h1>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700 text-white focus:ring-coral-500">
            <SelectValue placeholder="Pilih rentang waktu" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-white">
            <SelectItem value="all">Semua Waktu</SelectItem>
            <SelectItem value="7d">7 Hari Terakhir</SelectItem>
            <SelectItem value="30d">30 Hari Terakhir</SelectItem>
            <SelectItem value="90d">90 Hari Terakhir</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-slate-800/50 border-slate-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Pendapatan</CardTitle>
            <DollarSign className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.totalRevenue)}</div>
            <p className="text-xs text-slate-500">Dari pesanan yang sukses</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Pesanan</CardTitle>
            <ShoppingCart className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalOrders}</div>
            <p className="text-xs text-slate-500">Semua status pesanan</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Pesanan Sukses</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.successfulOrders}</div>
            <p className="text-xs text-slate-500">Pesanan yang telah selesai</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Pesanan Pending/Proses</CardTitle>
            <LoaderIcon className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.pendingOrders}</div>
            <p className="text-xs text-slate-500">Pesanan yang perlu ditindaklanjuti</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3 bg-slate-800/50 border-slate-700 text-white">
          <CardHeader>
            <CardTitle className="text-white">Pendapatan per Layanan</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barChartConfig} className="h-80 w-full">
              <BarChart data={analytics.revenueByService} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  className="text-xs"
                />
                <YAxis
                  tickFormatter={(value) => formatCurrency(Number(value))}
                  className="text-xs"
                />
                <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Bar dataKey="revenue" radius={4}>
                  {analytics.revenueByService.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700 text-white">
          <CardHeader>
            <CardTitle className="text-white">Komposisi Status Pesanan</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ChartContainer config={pieChartConfig} className="h-80 w-full">
              <PieChart accessibilityLayer>
                <Tooltip content={<ChartTooltipContent hideLabel />} />
                <Pie data={analytics.ordersByStatus} dataKey="count" nameKey="name">
                  {analytics.ordersByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`var(--color-${entry.name})`} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card className="bg-slate-800/50 border-slate-700 text-white">
        <CardHeader>
          <CardTitle className="text-white">Pesanan Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-700/50 hover:bg-slate-700/50">
                <TableHead className="text-white">Pelanggan</TableHead>
                <TableHead className="text-white">Layanan</TableHead>
                <TableHead className="text-white">Harga</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analytics.recentOrders.map((item) => (
                <TableRow key={item.id} className="border-slate-700">
                  <TableCell>
                    <div className="font-medium text-white">{item.customer_name || "N/A"}</div>
                    {item.customer_phone && (
                        <a
                        href={`https://wa.me/${formatWaNumber(item.customer_phone)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-slate-400 hover:text-coral-500 flex items-center gap-2 mt-1"
                        >
                        <MessageSquare className="w-3 h-3" />
                        {item.customer_phone}
                        </a>
                    )}
                  </TableCell>
                  <TableCell>{item.service_title}</TableCell>
                  <TableCell>{formatCurrency(item.price * item.quantity)}</TableCell>
                  <TableCell>
                    <Select
                      value={item.status || "pending"}
                      onValueChange={(newStatus) => updateCartItemStatus(item.id!, newStatus)}
                    >
                      <SelectTrigger
                        className={`w-[180px] text-xs border-none focus:ring-0 ${statusDisplay[item.status || "pending"]?.color || "bg-gray-500/20 text-gray-400"}`}>
                        <SelectValue placeholder="Ubah Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700 text-white">
                        {Object.entries(statusDisplay).map(([value, { label }]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setItemToDelete(item)}
                      className="text-slate-400 hover:text-red-500 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={itemToDelete !== null} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus data pesanan secara permanen dari server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-700 bg-transparent hover:bg-slate-800 text-slate-300">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">Lanjutkan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}