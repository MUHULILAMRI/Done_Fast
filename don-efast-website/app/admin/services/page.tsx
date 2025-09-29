"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { PlusCircle, Edit, Trash2, Loader2 } from "lucide-react";
import { Service, getServices, categories } from "@/lib/services"; // Import getServices and categories
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Icon mapping for display in forms
import {
  BookOpen,
  Code,
  FileText,
  Microscope,
  Cable as Cube,
  Users,
} from "lucide-react";

const iconOptions = [
  { value: "FileText", label: "File Text", component: FileText },
  { value: "BookOpen", label: "Book Open", component: BookOpen },
  { value: "Code", label: "Code", component: Code },
  { value: "Microscope", label: "Microscope", component: Microscope },
  { value: "Cube", label: "Cube", component: Cube },
  { value: "Users", label: "Users", component: Users },
];

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  const [formState, setFormState] = useState({
    id: "",
    title: "",
    description: "",
    price: 0,
    icon: "FileText", // Store as string
    category: "Academic",
    popular: false,
    features: "", // Comma separated string
    deliveryTime: "",
    revisions: "",
    subOptions: "", // JSON string
  });

  const fetchServices = async () => {
    setLoading(true);
    const fetchedServices = await getServices();
    setServices(fetchedServices);
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setFormState((prev) => ({
      ...prev,
      [id]: checked,
    }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleOpenDialog = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormState({
        id: service.id,
        title: service.title,
        description: service.description,
        price: service.price || 0,
        icon: service.db_icon, // Use the string name
        category: service.category,
        popular: service.popular,
        features: service.features.join(", "), // Convert array to comma separated string
        deliveryTime: service.deliveryTime,
        revisions: service.revisions,
        subOptions: JSON.stringify(service.subOptions || [], null, 2), // Convert array to JSON string
      });
    } else {
      setEditingService(null);
      setFormState({
        id: "",
        title: "",
        description: "",
        price: 0,
        icon: "FileText",
        category: "Academic",
        popular: false,
        features: "",
        deliveryTime: "",
        revisions: "",
        subOptions: "[]",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveService = async () => {
    const supabase = createClient();
    const servicePayload = {
      id: formState.id || formState.title.toLowerCase().replace(/\s+/g, '-'), // Generate ID if new
      title: formState.title,
      description: formState.description,
      price: Number(formState.price),
      icon: formState.icon,
      category: formState.category,
      popular: formState.popular,
      features: formState.features.split(", ").map((f) => f.trim()).filter(Boolean), // Convert string to array
      delivery_time: formState.deliveryTime, // Match DB column name
      revisions: formState.revisions,
      sub_options: JSON.parse(formState.subOptions), // Match DB column name
    };

    let error;
    if (editingService) {
      // Update existing service
      const { error: updateError } = await supabase
        .from("services")
        .update(servicePayload)
        .eq("id", editingService.id);
      error = updateError;
    } else {
      // Insert new service
      const { error: insertError } = await supabase.from("services").insert(servicePayload);
      error = insertError;
    }

    if (error) {
      toast.error(`Gagal menyimpan layanan: ${error.message}`);
    } else {
      toast.success("Layanan berhasil disimpan!");
      setIsDialogOpen(false);
      fetchServices(); // Refresh list
    }
  };

  const handleDeleteService = async () => {
    if (!serviceToDelete) return;

    const supabase = createClient();
    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", serviceToDelete.id);

    if (error) {
      toast.error(`Gagal menghapus layanan: ${error.message}`);
    } else {
      toast.success("Layanan berhasil dihapus!");
      setServiceToDelete(null);
      fetchServices(); // Refresh list
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-coral-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading services: {error}</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Manajemen Layanan</h1>
        <Button onClick={() => handleOpenDialog()} className="bg-coral-500 hover:bg-coral-600 text-white">
          <PlusCircle className="mr-2 h-4 w-4" /> Tambah Layanan Baru
        </Button>
      </div>

      <Card className="bg-slate-800/50 border-slate-700 text-white">
        <CardHeader>
          <CardTitle>Daftar Layanan</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-700/50 hover:bg-slate-700/50">
                <TableHead className="text-white">ID</TableHead>
                <TableHead className="text-white">Judul</TableHead>
                <TableHead className="text-white">Kategori</TableHead>
                <TableHead className="text-white">Harga</TableHead>
                <TableHead className="text-white">Populer</TableHead>
                <TableHead className="text-white text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => {
                const IconComponent = iconOptions.find(opt => opt.value === service.db_icon)?.component || FileText;
                return (
                  <TableRow key={service.id} className="border-slate-700">
                    <TableCell className="font-medium text-white">{service.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4 text-coral-500" />
                        {service.title}
                      </div>
                    </TableCell>
                    <TableCell>{service.category}</TableCell>
                    <TableCell>{service.price ? `Rp${service.price.toLocaleString("id-ID")}` : "N/A"}</TableCell>
                    <TableCell>{service.popular ? "Ya" : "Tidak"}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(service)}
                        className="text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 mr-2"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setServiceToDelete(service)}
                        className="text-slate-400 hover:text-red-500 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Service Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-slate-900 border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle>{editingService ? "Edit Layanan" : "Tambah Layanan Baru"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Judul</Label>
              <Input id="title" value={formState.title} onChange={handleInputChange} className="col-span-3 bg-slate-800 border-slate-700 text-white" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Deskripsi</Label>
              <Textarea id="description" value={formState.description} onChange={handleInputChange} className="col-span-3 bg-slate-800 border-slate-700 text-white" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">Harga</Label>
              <Input id="price" type="number" value={formState.price} onChange={handleInputChange} className="col-span-3 bg-slate-800 border-slate-700 text-white" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="icon" className="text-right">Ikon</Label>
              <Select value={formState.icon} onValueChange={(value) => handleSelectChange("icon", value)}>
                <SelectTrigger className="col-span-3 bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Pilih Ikon" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  {iconOptions.map((icon) => (
                    <SelectItem key={icon.value} value={icon.value}>
                      <div className="flex items-center gap-2">
                        <icon.component className="h-4 w-4" /> {icon.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Kategori</Label>
              <Select value={formState.category} onValueChange={(value) => handleSelectChange("category", value)}>
                <SelectTrigger className="col-span-3 bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  {categories.filter(cat => cat !== "All").map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="popular" className="text-right">Populer</Label>
              <Checkbox id="popular" checked={formState.popular} onCheckedChange={(checked) => handleCheckboxChange("popular", checked as boolean)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="features" className="text-right">Fitur (pisahkan dengan koma)</Label>
              <Input id="features" value={formState.features} onChange={handleInputChange} className="col-span-3 bg-slate-800 border-slate-700 text-white" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deliveryTime" className="text-right">Waktu Pengiriman</Label>
              <Input id="deliveryTime" value={formState.deliveryTime} onChange={handleInputChange} className="col-span-3 bg-slate-800 border-slate-700 text-white" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="revisions" className="text-right">Revisi</Label>
              <Input id="revisions" value={formState.revisions} onChange={handleInputChange} className="col-span-3 bg-slate-800 border-slate-700 text-white" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subOptions" className="text-right">Sub Opsi (JSON)</Label>
              <Textarea id="subOptions" value={formState.subOptions} onChange={handleInputChange} className="col-span-3 bg-slate-800 border-slate-700 text-white font-mono text-xs" rows={6} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-slate-700 bg-transparent hover:bg-slate-800 text-slate-300">Batal</Button>
            <Button onClick={handleSaveService} className="bg-coral-500 hover:bg-coral-600 text-white">Simpan Layanan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={serviceToDelete !== null} onOpenChange={(open) => !open && setServiceToDelete(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus layanan &quot;{serviceToDelete?.title}&quot; secara permanen dari database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-700 bg-transparent hover:bg-slate-800 text-slate-300">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteService} className="bg-red-600 hover:bg-red-700 text-white">Lanjutkan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
