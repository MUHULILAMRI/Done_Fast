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
} from "lucide-react"
import type { CartItem } from "@/lib/cart-database"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

const barChartConfig = {
  revenue: {
    label: "Pendapatan",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const pieChartConfig = {
  pending: {
    label: "Pending",
    color: "hsl(var(--chart-1))",
  },
  proses: {
    label: "Proses",
    color: "hsl(var(--chart-2))",
  },
  success: {
    label: "Success",
    color: "hsl(var(--chart-3))",
  },
  failed: {
    label: "Failed",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export default function AdminDashboardPage() {
  const [data, setData] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const { data: cartData, error: cartError } = await createClient()
        .from("cart_items")
        .select("*")
        .order("created_at", { ascending: false })

      if (cartError) {
        setError(cartError.message)
      } else {
        setData(cartData as CartItem[])
      }
      setLoading(false)
    }
    fetchData()
  }, [])

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

    const revenueByService = data.reduce((acc, item) => {
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
      <h1 className="text-3xl font-bold text-white">Dasbor Analitik</h1>

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
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {analytics.recentOrders.map((item) => (
                <TableRow key={item.id} className="border-slate-700">
                  <TableCell>
                    <div className="font-medium text-white">{item.customer_name || "N/A"}</div>
                    <div className="text-sm text-slate-400">{item.customer_phone}</div>
                  </TableCell>
                  <TableCell>{item.service_title}</TableCell>
                  <TableCell>{formatCurrency(item.price * item.quantity)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
                        item.status === "success"
                          ? "bg-green-500/20 text-green-400"
                          : item.status === "proses"
                          ? "bg-blue-500/20 text-blue-400"
                          : item.status === "failed"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {item.status || "pending"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}