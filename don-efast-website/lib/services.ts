import { createClient } from "@/lib/supabase/client";
import {
  BookOpen,
  Code,
  FileText,
  Microscope,
  Cable as Cube,
  Users,
} from "lucide-react";

import { LucideIcon } from "lucide-react";

export type SubOption = {
  id: string;
  name: string;
  price: number;
  features: string[];
};

export type Service = {
  id: string;
  title: string;
  description: string;
  price?: number;
  icon: LucideIcon; // This will be a component
  db_icon: string; // This will be the string name from the DB
  category: string;
  popular: boolean;
  features: string[];
  deliveryTime: string;
  revisions: string;
  subOptions?: SubOption[];
};

// Map string icon names from DB to LucideIcon components
const iconMap: { [key: string]: LucideIcon } = {
  FileText,
  BookOpen,
    Code,
  Microscope,
  Cube,
  Users,
};

// New function to get services from Supabase
export async function getServices(): Promise<Service[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching services:", error);
    return [];
  }

  // Map the data from the database to the Service type
  return data.map((service: any) => ({
    id: service.id,
    title: service.title,
    description: service.description,
    price: service.price,
    icon: iconMap[service.icon] || FileText, // Default to FileText if icon not found
    db_icon: service.icon, // Store the string name for forms
    category: service.category,
    popular: service.popular,
    features: service.features || [],
    deliveryTime: service.delivery_time,
    revisions: service.revisions,
    subOptions: service.sub_options || [],
  }));
}

export const categories = ["All", "Academic", "Programming", "Design", "Consultation"];
