"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Search, Filter, ChevronRight, MessageSquare, FileText, Package, Tag, Layers, Folder, BookOpen, FileCheck, Cpu, Printer, Grid, Star, ArrowRight, X, ChevronLeft, CheckCircle, type LucideIcon } from "lucide-react"
import { MediaFrame } from "@/app/components/media-frame"

type Service = {
  id: number;
  title: string;
  category: string;
  icon: LucideIcon;
  image?: string;
  imageAlt?: string;
  images?: string[];
  description: string;
  color: string;
  features?: string[];
  popular?: boolean;
}

// Main Service Categories
const serviceCategories = [
  { id: "all", name: "All Services", icon: Grid },
  { id: "garment", name: "Garment Accessories", icon: Tag },
  { id: "business", name: "Business Printing", icon: FileText },
  { id: "packaging", name: "Packaging", icon: Package },
  { id: "labels", name: "Labels & Stickers", icon: Tag },
  { id: "specialty", name: "Specialty Printing", icon: Layers },
]

// Detailed Services Data
const detailedServices: Service[] = [
  {
    id: 1,
    title: "Garment Accessories",
    category: "garment",
    icon: Tag,
    image: "/images/garment-accesories.jpeg",
    imageAlt: "Assorted garment tags, labels and trims",
    description: "Custom labels, tags, and accessories for clothing and textiles",
    color: "from-purple-500 to-pink-500",
    popular: true
  },
  {
    id: 2,
    title: "Business Cards",
    category: "business",
    icon: FileText,
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
    description: "Effective marketing materials for your business",
    color: "from-green-500 to-emerald-500",
    features: ["Full-color printing", "Various fold options", "Glossy/matte finishes"]
  },
  {
    id: 4,
    title: "Letterheads & Envelopes",
    category: "business",
    icon: FileCheck,
    description: "Professional corporate stationery sets",
    color: "from-teal-500 to-blue-500",
    features: ["Custom watermarking", "Matching envelopes", "Premium paper options"]
  },
  {
    id: 5,
    title: "Presentation Folders",
    category: "business",
    icon: Folder,
    description: "Custom folders for meetings and presentations",
    color: "from-orange-500 to-red-500"
  },
  {
    id: 6,
    title: "Catalogs & Booklets",
    category: "business",
    icon: BookOpen,
    description: "Professional catalogs for product showcasing",
    color: "from-indigo-500 to-purple-500"
  },
  {
    id: 7,
    title: "Product Packaging",
    category: "packaging",
    icon: Package,
    description: "Custom packaging solutions for your products",
    color: "from-yellow-500 to-orange-500",
    popular: true
  },
  {
    id: 8,
    title: "Retail Bags",
    category: "packaging",
    icon: Package,
    description: "Branded shopping bags for retail businesses",
    color: "from-pink-500 to-rose-500"
  },
  {
    id: 9,
    title: "Labels & Stickers",
    category: "labels",
    icon: Tag,
    description: "Custom labels for products and branding",
    color: "from-red-500 to-orange-500"
  },
  {
    id: 10,
    title: "Foam Board Printing",
    category: "specialty",
    icon: Layers,
    description: "Lightweight display boards for exhibitions",
    color: "from-green-500 to-emerald-500"
  },
  {
    id: 11,
    title: "Digital Printing",
    category: "business",
    icon: Cpu,
    description: "High-quality digital printing for short runs",
    color: "from-sky-500 to-blue-500"
  },
  {
    id: 12,
    title: "Offset Printing",
    category: "business",
    icon: Printer,
    image: "/images/Offset Printing.jpg",
    imageAlt: "Rollers on a printing press",
    description: "Cost-effective printing for large quantities",
    color: "from-emerald-500 to-green-500"
  },
  {
    id: 13,
    title: "Screen Printing",
    category: "specialty",
    icon: Grid,
    image: "/images/Screen Printing.jpg",
    imageAlt: "Squeegee on a screen printing setup",
    description: "Vibrant printing on various materials",
    color: "from-rose-500 to-pink-500"
  },
  {
    id: 14,
    title: "Foil Stamping",
    category: "specialty",
    icon: Star,
    image: "/images/Foil Printing.jpg",
    imageAlt: "Metallic foil rolls used in printing",
    description: "Luxury metallic finishes for premium products",
    color: "from-yellow-500 to-amber-500"
  },
]

const categoryNames = new Map(serviceCategories.map(category => [category.id, category.name]))
const categoryCounts: Record<string, number> = { all: detailedServices.length }
for (const service of detailedServices) categoryCounts[service.category] = (categoryCounts[service.category] ?? 0) + 1
type ServiceSort = "featured" | "alphabetical" | "category"

export function ServiceCatalog() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sort, setSort] = useState<ServiceSort>("featured")
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const serviceDialog = useRef<HTMLDialogElement>(null)
  const hasSelection = selectedService !== null

  useEffect(() => {
    if (hasSelection && !serviceDialog.current?.open) serviceDialog.current?.showModal()
  }, [hasSelection])

  const closeService = () => serviceDialog.current?.close()
  const query = searchQuery.trim().toLowerCase()
  const filteredServices = detailedServices.filter(service =>
    (selectedCategory === "all" || service.category === selectedCategory) &&
    [service.title, service.description, ...(service.features ?? [])].some(text => text.toLowerCase().includes(query))
  ).sort((left, right) => {
    const alphabetical = left.title.localeCompare(right.title, "en")
    if (sort === "alphabetical") return alphabetical
    if (sort === "category") return (categoryNames.get(left.category) ?? "").localeCompare(categoryNames.get(right.category) ?? "", "en") || alphabetical
    return Number(!!right.popular) - Number(!!left.popular) || left.id - right.id
  })

  return (
    <>
        {/* Service Categories Navigation */}
        <section id="service-catalog" className="py-8 bg-page-secondary scroll-mt-20 lg:sticky lg:top-20 z-40 border-b border-light">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary" />
                <input
                  type="text"
                  aria-label="Search services"
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
                      aria-pressed={selectedCategory === cat.id}
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
                        <span className="text-xs opacity-75">({categoryCounts[cat.id] ?? 0})</span>
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
            <h2 className="sr-only">Service results</h2>
            <div className="flex flex-wrap justify-between items-center gap-3 mb-8">
              <div className="text-secondary">
                Showing <span className="font-semibold text-primary">{filteredServices.length}</span> services
                {selectedCategory !== "all" && (
                  <span> in <span className="font-semibold text-primary">{serviceCategories.find(c => c.id === selectedCategory)?.name}</span></span>
                )}
              </div>
              <div className="text-sm text-secondary">
                Sort by: <select aria-label="Sort services" value={sort} onChange={event => setSort(event.target.value as ServiceSort)} className="bg-page-primary text-primary rounded px-1 py-0.5">
                  <option value="featured">Featured first</option>
                  <option value="alphabetical">Alphabetical</option>
                  <option value="category">Category</option>
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
                            Featured
                          </span>
                        </div>
                      )}
                      
                      <div className="mt-6">
                        <div className="h-1 w-12 bg-accent mx-auto rounded-full"></div>
                        <div className="text-center mt-3">
                          <button 
                            onClick={() => {
                              setSelectedService(service)
                              setCurrentImageIndex(0)
                            }}
                            aria-label={"Learn more about " + service.title}
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
        {/* SERVICE DETAILS MODAL */}
        {selectedService && (
          <dialog
            ref={serviceDialog}
            aria-labelledby="service-title"
            onClose={() => setSelectedService(null)}
            onClick={event => { if (event.target === event.currentTarget) closeService() }}
            className="m-auto w-[calc(100%-2rem)] max-w-4xl max-h-[90dvh] overflow-y-auto rounded-2xl bg-page-primary text-primary backdrop:bg-black/70"
          >
            <div className="relative">
              <button
                onClick={closeService}
                aria-label="Close service details"
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
                        <MediaFrame
                          src={(selectedService.images && selectedService.images[currentImageIndex]) || selectedService.image}
                          alt={selectedService.imageAlt ?? selectedService.title}
                          icon={selectedService.icon}
                          detail
                          sizes="(min-width: 900px) 400px, (min-width: 768px) 45vw, calc(100vw - 80px)"
                          className="object-contain"
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
                      <h2 id="service-title" className="text-3xl font-bold text-primary mb-4">
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
                      <Link
                        href="/contact#quote"
                        className="flex-1 px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      >
                        <MessageSquare className="w-5 h-5" />
                        Get Quote
                      </Link>
                      <button 
                        onClick={closeService}
                        className="flex-1 px-6 py-3 bg-page-secondary text-primary font-semibold rounded-lg border border-light hover:border-accent transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </dialog>
        )}
    </>
  )
}
