"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, { message: "Nama harus memiliki setidaknya 2 karakter." }).optional(),
  email: z.string().email({ message: "Format email tidak valid." }).optional(),
  message: z.string().min(10, { message: "Pesan harus memiliki setidaknya 10 karakter." }),
})

export function FeedbackSection() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  const { isSubmitting } = form.formState

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const supabase = createClient()
    const { error } = await supabase.from("feedback").insert([
      {
        name: values.name || null,
        email: values.email || null,
        message: values.message,
      },
    ])

    if (error) {
      toast.error("Gagal mengirim pesan: " + error.message)
    } else {
      toast.success("Terima kasih! Pesan Anda telah terkirim.")
      form.reset()
    }
  }

  return (
    <section id="feedback" className="py-20 bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Kritik & Saran</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto text-balance">
            Kami sangat menghargai masukan Anda untuk membuat layanan kami lebih baik lagi.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Nama (Opsional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Nama Anda" {...field} className="bg-slate-800/50 border-slate-700 text-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Email (Opsional)</FormLabel>
                      <FormControl>
                        <Input placeholder="email@contoh.com" {...field} className="bg-slate-800/50 border-slate-700 text-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Pesan Anda</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tuliskan kritik atau saran Anda di sini..."
                        {...field}
                        className="bg-slate-800/50 border-slate-700 text-white min-h-[150px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-center">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full md:w-auto bg-coral-500 hover:bg-coral-600 text-white px-8 py-6 text-lg"
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </section>
  )
}
