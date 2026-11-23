import Link from "next/link"
import { Palette, Truck, Shield, Clock, CheckCircle, Users, Target, MessageSquare, Printer, Cpu, Monitor, PrinterIcon as PrintIcon, Scissors, Thermometer, Grid, Hash, Type, Star, Layers } from "lucide-react"
import { Header } from "../components/header"
import { Footer } from "../components/footer"
import { ServiceCatalog } from "./service-catalog"
import { publicMetadata } from "@/lib/site-metadata"

export const metadata = publicMetadata("/services")

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

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="min-h-screen bg-page-primary scroll-mt-20">
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
                <Link href="/contact#quote"
                  className="px-8 py-3 bg-accent text-white font-semibold rounded-full hover:opacity-90 transition-opacity"
                >
                  Request a quote
                </Link>
                <a href="#service-catalog" className="px-8 py-3 bg-page-primary text-primary font-semibold rounded-full border-2 border-light hover:border-accent transition-all flex items-center gap-2">
                  Explore services
                </a>
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
                With decades of experience, we&apos;ve built a reputation for excellence across the globe.
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
        <ServiceCatalog />
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
                    
                    {index < processSteps.length - 1 && (index + 1) % 3 !== 0 && (
                      <div aria-hidden="true" className="hidden lg:block absolute -right-8 top-1/2 w-8 h-0.5 bg-accent/20">
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-[6px] border-r-0 border-t-[6px] border-b-[6px] border-l-accent/20 border-t-transparent border-b-transparent"></div>
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
                We&apos;re more than just a printing service - we&apos;re your partners in bringing
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
      </main>
      <Footer />
    </>
  )
}
