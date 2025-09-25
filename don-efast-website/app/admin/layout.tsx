"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, ShoppingCart, Users, Settings, LogOut, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"

const adminNavItems = [
  { href: "/admin/dashboard", icon: Home, label: "Dasbor" },
  // { href: "/admin/orders", icon: ShoppingCart, label: "Pesanan" }, // Future feature
  // { href: "/admin/users", icon: Users, label: "Pengguna" }, // Future feature
  // { href: "/admin/settings", icon: Settings, label: "Pengaturan" }, // Future feature
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/admin/login")
      } else {
        setIsAuthenticated(true)
      }
      setLoading(false)
    }

    // Only run checkUser if not on the login page
    if (pathname !== "/admin/login") {
      checkUser()
    } else {
      setLoading(false) // If on login page, no need to check auth, just render
    }
  }, [pathname, router, supabase])

  const handleLogout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
        <Loader2 className="h-8 w-8 animate-spin text-coral-500" />
        <p className="ml-2 text-white">Memuat...</p>
      </div>
    )
  }

  // If on login page, just render children (the login form)
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  // If not authenticated and not on login page, it means checkUser redirected, so nothing to render here
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {/* Sidebar for larger screens */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-slate-800 bg-slate-900 p-4">
        <div className="flex items-center justify-center h-16 border-b border-slate-800 mb-6">
          <h1 className="text-2xl font-bold text-coral-500">Admin Panel</h1>
        </div>
        <nav className="flex-1 space-y-2">
          {adminNavItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "default" : "ghost"}
                className={`w-full justify-start ${pathname === item.href ? "bg-coral-500 hover:bg-coral-600 text-white" : "text-slate-300 hover:bg-slate-800"}`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-6 border-t border-slate-800">
          <Button onClick={handleLogout} className="w-full justify-start text-slate-300 hover:bg-slate-800" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-3 h-5 w-5" />}
            Logout
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between h-16 border-b border-slate-800 bg-slate-900 px-4">
          <h1 className="text-xl font-bold text-coral-500">Admin Panel</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-slate-900 border-slate-800 text-white">
              <div className="flex items-center justify-center h-16 border-b border-slate-800 mb-6">
                <h1 className="text-2xl font-bold text-coral-500">Admin Panel</h1>
              </div>
              <nav className="flex-1 space-y-2">
                {adminNavItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={pathname === item.href ? "default" : "ghost"}
                      className={`w-full justify-start ${pathname === item.href ? "bg-coral-500 hover:bg-coral-600 text-white" : "text-slate-300 hover:bg-slate-800"}`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </nav>
              <div className="mt-auto pt-6 border-t border-slate-800">
                <Button onClick={handleLogout} className="w-full justify-start text-slate-300 hover:bg-slate-800" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-3 h-5 w-5" />}
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}