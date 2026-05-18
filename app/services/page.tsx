"use client"

import { Footer } from "../components/footer"
import { Header } from "../components/header"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Printer, Palette, Truck, Headphones, Shield, Clock,
  CheckCircle, Star, Users, Award, Target, Zap,
  Search, Filter, ChevronRight, Download, MessageSquare,
  FileText, Package, Tag, Layers, Square, Folder,
  BookOpen, FileCheck, Cpu, Smartphone, Monitor,
  PrinterIcon as PrintIcon, Scissors, Thermometer,
  Droplets, Grid, Hash, Type, Image as ImageIcon,
  Bookmark, Share2, Heart, ArrowRight, X,
  ChevronLeft,
  LucideIcon
} from "lucide-react"
import { useTheme } from "@/app/theme-provider"

// Define the Service type
type Service = {
  id: number;
  title: string;
  category: string;
  icon: LucideIcon;
  image: string;
  images?: string[];
  description: string;
  color: string;
  features?: string[];
  popular?: boolean;
}

export default function ServicesPage() {
  const { theme } = useTheme()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  // Main Service Categories
  const serviceCategories = [
    { id: "all", name: "All Services", icon: Grid, count: 14, color: "bg-blue-500" },
    { id: "garment", name: "Garment Accessories", icon: Tag, count: 1, color: "bg-purple-500" },
    { id: "business", name: "Business Printing", icon: FileText, count: 5, color: "bg-green-500" },
    { id: "packaging", name: "Packaging", icon: Package, count: 2, color: "bg-yellow-500" },
    { id: "labels", name: "Labels & Stickers", icon: Tag, count: 1, color: "bg-pink-500" },
    { id: "specialty", name: "Specialty Printing", icon: Layers, count: 3, color: "bg-red-500" },
  ]

  // Detailed Services Data
  const detailedServices: Service[] = [
    {
      id: 1,
      title: "Garment Accessories",
      category: "garment",
      icon: Tag,
      image: "/images/garment-accesories.jpeg",
      images: [
        "/images/garment-accesories.jpeg",
      ],
      description: "Custom labels, tags, and accessories for clothing and textiles",
      color: "from-purple-500 to-pink-500",
      popular: true
    },
    {
      id: 2,
      title: "Business Cards",
      category: "business",
      icon: FileText,
      image: "https://images.unsplash.com/photo-1601933470096-0e34634ffcde?w=400&h=300&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1601933470096-0e34634ffcde?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=400&h=300&fit=crop",
      ],
      description: "Premium business cards that make a lasting impression",
      color: "from-blue-500 to-cyan-500",
      features: ["Multiple paper stocks", "Spot UV coating", "Foil stamping available"],
      popular: true
    },
    {
      id: 3,
      title: "Brochures & Flyers",
      category: "business",
      icon: BookOpen,
      image: "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=400&h=300&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
      ],
      description: "Effective marketing materials for your business",
      color: "from-green-500 to-emerald-500",
      features: ["Full-color printing", "Various fold options", "Glossy/matte finishes"]
    },
    {
      id: 4,
      title: "Letterheads & Envelopes",
      category: "business",
      icon: FileCheck,
      image: "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=400&h=300&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1579534876391-3be7d647e8f7?w=400&h=300&fit=crop",
      ],
      description: "Professional corporate stationery sets",
      color: "from-teal-500 to-blue-500",
      features: ["Custom watermarking", "Matching envelopes", "Premium paper options"]
    },
    {
      id: 5,
      title: "Presentation Folders",
      category: "business",
      icon: Folder,
      image: "https://images.unsplash.com/photo-1586232702178-f044c5f4d4b7?w=400&h=300&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1586232702178-f044c5f4d4b7?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1635003815032-85b3979e9957?w=400&h=300&fit=crop",
      ],
      description: "Custom folders for meetings and presentations",
      color: "from-orange-500 to-red-500"
    },
    {
      id: 6,
      title: "Catalogs & Booklets",
      category: "business",
      icon: BookOpen,
      image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=300&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1507842217343-583f20270319?w=400&h=300&fit=crop",
      ],
      description: "Professional catalogs for product showcasing",
      color: "from-indigo-500 to-purple-500"
    },
    {
      id: 7,
      title: "Product Packaging",
      category: "packaging",
      icon: Package,
      image: "https://images.unsplash.com/photo-1581235720708-508d4b033c4d?w=400&h=300&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1581235720708-508d4b033c4d?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=400&h=300&fit=crop",
      ],
      description: "Custom packaging solutions for your products",
      color: "from-yellow-500 to-orange-500",
      popular: true
    },
    {
      id: 8,
      title: "Retail Bags",
      category: "packaging",
      icon: Package,
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1607622814075-e51df1bdc82f?w=400&h=300&fit=crop",
      ],
      description: "Branded shopping bags for retail businesses",
      color: "from-pink-500 to-rose-500"
    },
    {
      id: 9,
      title: "Labels & Stickers",
      category: "labels",
      icon: Tag,
      image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=400&h=300&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1585864299861-9d4282aa2a4b?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1606986628025-35d57e735ae0?w=400&h=300&fit=crop",
      ],
      description: "Custom labels for products and branding",
      color: "from-red-500 to-orange-500"
    },
    {
      id: 10,
      title: "Foam Board Printing",
      category: "specialty",
      icon: Layers,
      image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=300&fit=crop",
      ],
      description: "Lightweight display boards for exhibitions",
      color: "from-green-500 to-emerald-500"
    },
    {
      id: 11,
      title: "Digital Printing",
      category: "all",
      icon: Cpu,
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1618893917897-dac4ef8f9c8f?w=400&h=300&fit=crop",
      ],
      description: "High-quality digital printing for short runs",
      color: "from-sky-500 to-blue-500"
    },
    {
      id: 12,
      title: "Offset Printing",
      category: "all",
      icon: Printer,
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1516321318423-f06e0b504b00?w=400&h=300&fit=crop",
      ],
      description: "Cost-effective printing for large quantities",
      color: "from-emerald-500 to-green-500"
    },
    {
      id: 13,
      title: "Screen Printing",
      category: "specialty",
      icon: Grid,
      image: "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=400&h=300&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1560080876-dbb072894020?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400&h=300&fit=crop",
      ],
      description: "Vibrant printing on various materials",
      color: "from-rose-500 to-pink-500"
    },
    {
      id: 14,
      title: "Foil Stamping",
      category: "specialty",
      icon: Star,
      image: "https://images.unsplash.com/photo-1585338109925-a3f44b3f7f2f?w=400&h=300&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1585338109925-a3f44b3f7f2f?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1549887534-f81c1a052f2e?w=400&h=300&fit=crop",
      ],
      description: "Luxury metallic finishes for premium products",
      color: "from-yellow-500 to-amber-500"
    },
  ]

  // Filter services based on category and search
  const filteredServices = detailedServices.filter(service => {
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory
    const matchesSearch = searchQuery === "" || 
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (service.features && service.features.some(feature => 
        feature.toLowerCase().includes(searchQuery.toLowerCase())
      ))
    
    return matchesCategory && matchesSearch
  })

  // Stats
  const stats = [
    { icon: Clock, value: "28", label: "Years Experience", color: "text-red-500" },
    { icon: Shield, value: "100%", label: "Quality Guarantee", color: "text-purple-500" },
    { icon: Truck, value: "24/7", label: "Delivery Support", color: "text-pink-500" },
  ]

  // Process Steps
  const processSteps = [
    { step: 1, title: "Consultation", description: "Discuss your project requirements", icon: MessageSquare },
    { step: 2, title: "Design", description: "Create or refine your design files", icon: Palette },
    { step: 3, title: "Proofing", description: "Review digital proofs for approval", icon: CheckCircle },
    { step: 4, title: "Printing", description: "Production with quality control", icon: Printer },
    { step: 5, title: "Finishing", description: "Apply coatings and finishing touches", icon: Scissors },
    { step: 6, title: "Delivery", description: "Careful packaging and shipping", icon: Truck },
  ]

  // Printing Technologies
  const technologies = [
    { name: "Digital Printing", icon: Cpu, description: "High-quality prints for short runs and variable data" },
    { name: "Offset Printing", icon: PrintIcon, description: "Cost-effective solution for large quantities" },
    { name: "Large Format", icon: Monitor, description: "Banners, signs, and vehicle wraps up to 10ft wide" },
    { name: "Screen Printing", icon: Grid, description: "Vibrant prints on textiles, plastics, and metals" },
    { name: "Foil Stamping", icon: Star, description: "Luxury metallic finishes for premium products" },
    { name: "Embossing", icon: Type, description: "Raised or recessed designs for tactile appeal" },
    { name: "Die Cutting", icon: Scissors, description: "Custom shapes and intricate cutouts" },
    { name: "UV Coating", icon: Thermometer, description: "Protective glossy or matte finish" },
    { name: "Lamination", icon: Layers, description: "Extra protection and durability" },
    { name: "Variable Data", icon: Hash, description: "Personalized printing for direct mail" },
  ]

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-page-primary">
          {/* Hero Section Skeleton */}
          <section className="relative py-20 bg-linear-to-r from-page-secondary to-page-tertiary overflow-hidden">
            <div className="container mx-auto px-4 relative">
              <div className="max-w-4xl mx-auto text-center">
                <div className="h-16 bg-page-primary/20 rounded-lg mb-6 animate-pulse"></div>
                <div className="h-6 bg-page-primary/20 rounded mb-4 animate-pulse max-w-3xl mx-auto"></div>
                <div className="h-6 bg-page-primary/20 rounded mb-8 animate-pulse max-w-2xl mx-auto"></div>
                <div className="flex flex-wrap gap-4 justify-center">
                  <div className="h-12 w-32 bg-page-primary/20 rounded-full animate-pulse"></div>
                  <div className="h-12 w-40 bg-page-primary/20 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Service Categories Skeleton */}
          <section className="py-16 bg-page-primary">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <div className="h-8 bg-page-primary/20 rounded mb-4 animate-pulse max-w-md mx-auto"></div>
                <div className="h-4 bg-page-primary/20 rounded animate-pulse max-w-lg mx-auto"></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="text-center">
                    <div className="w-16 h-16 bg-page-primary/20 rounded-2xl mb-3 animate-pulse mx-auto"></div>
                    <div className="h-4 bg-page-primary/20 rounded mb-2 animate-pulse"></div>
                    <div className="h-3 bg-page-primary/20 rounded animate-pulse max-w-16 mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Services Grid Skeleton */}
          <section className="py-16 bg-page-primary">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center mb-8">
                <div className="h-4 bg-page-primary/20 rounded animate-pulse w-48"></div>
                <div className="h-4 bg-page-primary/20 rounded animate-pulse w-32"></div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="bg-page-secondary rounded-2xl p-6 border border-light">
                    <div className="aspect-video bg-page-primary/20 rounded-lg mb-4 animate-pulse"></div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 bg-page-primary/20 rounded animate-pulse"></div>
                      <div className="h-5 bg-page-primary/20 rounded animate-pulse flex-1"></div>
                    </div>
                    <div className="h-4 bg-page-primary/20 rounded mb-2 animate-pulse"></div>
                    <div className="h-4 bg-page-primary/20 rounded mb-4 animate-pulse max-w-sm"></div>
                    <div className="flex gap-2 mb-4">
                      <div className="h-6 bg-page-primary/20 rounded-full animate-pulse w-16"></div>
                      <div className="h-6 bg-page-primary/20 rounded-full animate-pulse w-20"></div>
                    </div>
                    <div className="h-10 bg-page-primary/20 rounded-lg animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Printing Technologies Skeleton */}
          <section className="py-16 bg-page-secondary">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <div className="h-8 bg-page-primary/20 rounded mb-4 animate-pulse max-w-md mx-auto"></div>
                <div className="h-4 bg-page-primary/20 rounded animate-pulse max-w-lg mx-auto"></div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="text-center">
                    <div className="w-16 h-16 bg-page-primary/20 rounded-2xl mb-4 animate-pulse mx-auto"></div>
                    <div className="h-5 bg-page-primary/20 rounded mb-2 animate-pulse"></div>
                    <div className="h-4 bg-page-primary/20 rounded mb-1 animate-pulse"></div>
                    <div className="h-4 bg-page-primary/20 rounded animate-pulse max-w-32 mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Why Choose Us Skeleton */}
          <section className="py-16 bg-page-primary">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <div className="h-8 bg-page-primary/20 rounded mb-4 animate-pulse max-w-md mx-auto"></div>
                <div className="h-4 bg-page-primary/20 rounded animate-pulse max-w-lg mx-auto"></div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="text-center">
                    <div className="w-16 h-16 bg-page-primary/20 rounded-2xl mb-4 animate-pulse mx-auto"></div>
                    <div className="h-6 bg-page-primary/20 rounded mb-3 animate-pulse"></div>
                    <div className="h-4 bg-page-primary/20 rounded mb-2 animate-pulse"></div>
                    <div className="h-4 bg-page-primary/20 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section Skeleton */}
          <section className="py-16 bg-linear-to-r from-page-secondary to-page-tertiary">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <div className="h-8 bg-page-primary/20 rounded mb-6 animate-pulse max-w-md mx-auto"></div>
                <div className="h-6 bg-page-primary/20 rounded mb-8 animate-pulse max-w-2xl mx-auto"></div>
                <div className="flex flex-wrap gap-4 justify-center">
                  <div className="h-4 bg-page-primary/20 rounded mb-4 animate-pulse max-w-xl mx-auto"></div>
                  <div className="h-12 w-40 bg-page-primary/20 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-page-primary">
        {/* Hero Section */}
        <section className="relative py-20 bg-linear-to-r from-page-secondary to-page-tertiary overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")` 
            }} />
          </div>
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">
                Professional Printing Services
              </h1>
              <p className="text-xl text-secondary mb-8 max-w-3xl mx-auto">
                From business cards to large format banners, we provide comprehensive printing 
                solutions with exceptional quality and service for businesses of all sizes.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button 
                  onClick={() => router.push('/contact')}
                  className="px-8 py-3 bg-accent text-white font-semibold rounded-full hover:opacity-90 transition-opacity"
                >
                  Contact Us
                </button>
                <button className="px-8 py-3 bg-page-primary text-primary font-semibold rounded-full border-2 border-light hover:border-accent transition-all flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Download Price List
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-page-primary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">Our Achievements</h2>
              <p className="text-secondary max-w-2xl mx-auto">
                With decades of experience, we've built a reputation for excellence across the globe.
              </p>
            </div>

            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20 max-w-6xl">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-blue-500/10 to-cyan-500/10 mb-6">
                    <Clock className="w-10 h-10 text-blue-500" />
                  </div>
                  <div className="text-5xl font-bold text-primary mb-3">15+</div>
                  <div className="text-lg text-secondary font-semibold">Countries Served</div>
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-green-500/10 to-emerald-500/10 mb-6">
                    <Shield className="w-10 h-10 text-green-500" />
                  </div>
                  <div className="text-5xl font-bold text-primary mb-3">28</div>
                  <div className="text-lg text-secondary font-semibold">Years Experience</div>
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-purple-500/10 to-pink-500/10 mb-6">
                    <Truck className="w-10 h-10 text-purple-500" />
                  </div>
                  <div className="text-5xl font-bold text-primary mb-3">99.8%</div>
                  <div className="text-lg text-secondary font-semibold">Satisfaction Rate</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Categories Navigation */}
        <section className="py-8 bg-page-secondary sticky top-0 z-40 border-b border-light">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-full bg-page-primary border border-light text-primary placeholder:text-secondary focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-secondary" />
                <div className="flex flex-wrap gap-2">
                  {serviceCategories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedCategory === cat.id
                          ? 'bg-accent text-white'
                          : 'bg-page-primary text-secondary hover:text-primary hover:border-accent border border-light'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <cat.icon className="w-4 h-4" />
                        {cat.name}
                        <span className="text-xs opacity-75">({cat.count})</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 bg-page-primary">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <div className="text-secondary">
                Showing <span className="font-semibold text-primary">{filteredServices.length}</span> services
                {selectedCategory !== "all" && (
                  <span> in <span className="font-semibold text-primary">{serviceCategories.find(c => c.id === selectedCategory)?.name}</span></span>
                )}
              </div>
              <div className="text-sm text-secondary">
                Sort by: <select className="bg-transparent text-primary focus:outline-none">
                  <option>Most Popular</option>
                  <option>Alphabetical</option>
                  <option>Category</option>
                </select>
              </div>
            </div>

            {filteredServices.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-page-tertiary mb-6">
                  <Search className="w-10 h-10 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-3">No services found</h3>
                <p className="text-secondary mb-6 max-w-md mx-auto">
                  Try adjusting your search criteria or select a different category.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("all")
                    setSearchQuery("")
                  }}
                  className="px-6 py-2 bg-accent text-white font-semibold rounded-full hover:opacity-90 transition-opacity"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredServices.map((service) => (
                  <div key={service.id} className="group">
                    <div className="bg-page-secondary rounded-2xl p-6 border border-light hover:border-accent transition-all duration-300 hover:shadow-lg h-full flex flex-col">
                      <div className="mb-6 flex justify-center">
                        <div className={`w-20 h-20 rounded-2xl bg-linear-to-br ${service.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <service.icon className="w-10 h-10 text-white" />
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-primary mb-4 text-center group-hover:text-accent transition-colors">
                        {service.title}
                      </h3>
                      
                      <p className="text-secondary text-center grow">
                        {service.description}
                      </p>
                      
                      {service.popular && (
                        <div className="mt-4 flex justify-center">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                            <Star className="w-3 h-3" />
                            Popular Choice
                          </span>
                        </div>
                      )}
                      
                      <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="h-1 w-12 bg-accent mx-auto rounded-full"></div>
                        <div className="text-center mt-3">
                          <button 
                            onClick={() => {
                              setSelectedService(service)
                              setCurrentImageIndex(0)
                              setIsModalOpen(true)
                            }}
                            className="text-sm text-accent font-medium hover:underline flex items-center justify-center gap-1 mx-auto"
                          >
                            <span>Learn more</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Our Process Section */}
        <section className="py-16 bg-page-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">Our Printing Process</h2>
              <p className="text-secondary max-w-2xl mx-auto">
                From concept to delivery, we follow a meticulous 6-step process to ensure 
                exceptional quality and customer satisfaction.
              </p>
            </div>

            <div className="relative">
              <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-accent/20 transform -translate-x-1/2"></div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {processSteps.map((step, index) => (
                  <div key={step.step} className="relative">
                    <div className="bg-page-primary rounded-2xl p-6 border border-light hover:border-accent transition-colors h-full">
                      <div className="flex items-start gap-4">
                        <div className="shrink-0">
                          <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                              <step.icon className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-accent mb-1">Step {step.step}</div>
                          <h3 className="text-xl font-bold text-primary mb-2">{step.title}</h3>
                          <p className="text-secondary">{step.description}</p>
                        </div>
                      </div>
                    </div>
                    
                    {index < processSteps.length - 1 && (
                      <div className="hidden lg:block absolute -right-8 top-1/2 w-8 h-0.5 bg-accent/20">
                        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-[6px] border-r-0 border-t-[6px] border-b-[6px] border-l-accent/20 border-t-transparent border-b-transparent"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Printing Technologies */}
        <section className="py-16 bg-page-primary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">Printing Technologies</h2>
              <p className="text-secondary max-w-2xl mx-auto">
                We utilize state-of-the-art printing technologies to deliver exceptional 
                results for every project.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              {technologies.map((tech, index) => (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-4 group-hover:bg-accent/20 transition-colors">
                    <tech.icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-bold text-primary mb-2">{tech.name}</h3>
                  <p className="text-sm text-secondary">{tech.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-page-primary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">Why Choose Awais Printers?</h2>
              <p className="text-secondary max-w-2xl mx-auto">
                We're more than just a printing service - we're your partners in bringing 
                your vision to life with exceptional quality and service.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Shield,
                  title: "Quality Guarantee",
                  description: "100% satisfaction guaranteed on all our printing services"
                },
                {
                  icon: Clock,
                  title: "Fast Turnaround",
                  description: "Quick production times without compromising on quality"
                },
                {
                  icon: Users,
                  title: "Expert Team",
                  description: "Experienced professionals guiding you through every step"
                },
                {
                  icon: Target,
                  title: "Precision Printing",
                  description: "State-of-the-art equipment for perfect results every time"
                },
              ].map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
                    <benefit.icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3">{benefit.title}</h3>
                  <p className="text-secondary">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICE DETAILS MODAL */}
        {isModalOpen && selectedService && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <div 
              className="relative bg-page-primary rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-4 top-4 z-10 w-10 h-10 rounded-full bg-page-secondary flex items-center justify-center text-secondary hover:text-primary hover:bg-light transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="p-6 md:p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    {/* Image Carousel */}
                    <div className="space-y-4">
                      <div className="aspect-square rounded-2xl overflow-hidden bg-linear-to-br from-page-secondary to-page-tertiary relative group">
                        <img 
                          src={(selectedService.images && selectedService.images[currentImageIndex]) || selectedService.image} 
                          alt={selectedService.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Navigation Controls */}
                      {selectedService.images && selectedService.images.length > 1 && (
                        <div className="flex items-center justify-between gap-4">
                          <button
                            onClick={() => setCurrentImageIndex((prev) => (prev - 1 + selectedService.images!.length) % selectedService.images!.length)}
                            className="flex-1 py-3 px-4 rounded-lg bg-page-secondary border border-light hover:border-accent hover:bg-accent/10 transition-all flex items-center justify-center gap-2 text-primary font-medium"
                          >
                            <ChevronLeft className="w-5 h-5" />
                            Previous
                          </button>

                          <div className="text-center min-w-20">
                            <span className="text-sm font-semibold text-secondary">
                              {currentImageIndex + 1} / {selectedService.images.length}
                            </span>
                          </div>

                          <button
                            onClick={() => setCurrentImageIndex((prev) => (prev + 1) % selectedService.images!.length)}
                            className="flex-1 py-3 px-4 rounded-lg bg-page-secondary border border-light hover:border-accent hover:bg-accent/10 transition-all flex items-center justify-center gap-2 text-primary font-medium"
                          >
                            Next
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      )}

                      {/* Image Indicators (Dots) */}
                      {selectedService.images && selectedService.images.length > 1 && (
                        <div className="flex justify-center gap-2">
                          {selectedService.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                index === currentImageIndex
                                  ? "bg-accent w-6"
                                  : "bg-light hover:bg-secondary"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-bold text-primary mb-4">
                        {selectedService.title}
                      </h2>
                      
                      <div className="prose prose-lg max-w-none">
                        <p className="text-secondary text-lg leading-relaxed">
                          {selectedService.description}
                        </p>
                      </div>
                    </div>
                    
                    {selectedService.features && selectedService.features.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-primary mb-4">Key Features</h3>
                        <ul className="space-y-2">
                          {selectedService.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-accent shrink-0" />
                              <span className="text-secondary">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                      <a 
                        href="/contact" 
                        className="flex-1 px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      >
                        <MessageSquare className="w-5 h-5" />
                        Get Quote
                      </a>
                      <button 
                        onClick={() => setIsModalOpen(false)}
                        className="flex-1 px-6 py-3 bg-page-secondary text-primary font-semibold rounded-lg border border-light hover:border-accent transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}
