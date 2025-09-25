"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CustomerInfoModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (name: string, phone: string) => void
}

export function CustomerInfoModal({ isOpen, onClose, onSubmit }: CustomerInfoModalProps) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim()) {
      setError("Nama dan Nomor WhatsApp tidak boleh kosong.")
      return
    }
    // Basic validation for Indonesian phone number
    if (!/^(\+62|0)8[1-9][0-9]{7,10}$/.test(phone)) {
      setError("Format Nomor WhatsApp tidak valid. Contoh: 081234567890")
      return
    }

    // Format phone to +62
    const formattedPhone = phone.startsWith("0") ? `62${phone.substring(1)}` : phone.replace(/\+/, "")

    onSubmit(name, formattedPhone)
    setName("")
    setPhone("")
    setError("")
  }

  const handleClose = () => {
    setName("")
    setPhone("")
    setError("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-coral-500">Informasi Pemesan</DialogTitle>
          <DialogDescription className="text-slate-400">
            Silakan isi nama dan nomor WhatsApp Anda untuk melanjutkan pemesanan.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-slate-300">
              Nama
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-coral-500"
              placeholder="Nama Lengkap Anda"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="whatsapp" className="text-right text-slate-300">
              No. WhatsApp
            </Label>
            <Input
              id="whatsapp"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="col-span-3 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-coral-500"
              placeholder="Contoh: 081234567890"
            />
          </div>
          {error && <p className="col-span-4 text-center text-red-500 text-sm">{error}</p>}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            Batal
          </Button>
          <Button onClick={handleSubmit} className="bg-coral-500 hover:bg-coral-600">
            Lanjutkan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
