"use client"

import { Footer } from "../components/footer"
import { Header } from "../components/header"
import { useState, useEffect } from "react"


import { 
  Target, Award, Users, Clock, Shield, Star,
  Heart, TrendingUp, Globe, Zap, CheckCircle,
  Printer, Palette, Truck, Headphones
} from "lucide-react"
import { useTheme } from "@/app/theme-provider"

export default function AboutPage() {
  const { theme } = useTheme()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const values = [
    { icon: Heart, title: "Passion", description: "We love what we do and it shows in every print." },
    { icon: Shield, title: "Integrity", description: "Honest pricing, transparent processes, reliable service." },
    { icon: Star, title: "Excellence", description: "Striving for perfection in every project we undertake." },
    { icon: Users, title: "Collaboration", description: "Working together with clients to achieve their vision." },
    { icon: TrendingUp, title: "Innovation", description: "Embracing new technologies and techniques." },
    { icon: Globe, title: "Sustainability", description: "Eco-friendly practices and materials." },
  ]

  const team = [
    { name: "Awais Rasool", role: "Founder & CEO", experience: "28 years", speciality: "Printing Technology" },
    { name: "Haji Ahmed Ashraf", role: "Co Founder", experience: "28 years", speciality: "Design & Branding" },
  ]

  const stats = [
    { icon: Globe, value: "15+", label: "Countries Served" },
    { icon: Clock, value: "28", label: "Years Experience" },
    { icon: Zap, value: "99.8%", label: "Satisfaction Rate" },
  ]

  const services = [
    { icon: Palette, title: "Design Services", description: "Professional graphic design and brand identity development" },
    { icon: Printer, title: "Print Production", description: "High-quality printing using latest technology" },
    { icon: Truck, title: "Delivery & Logistics", description: "Nationwide delivery with real-time tracking" },
    { icon: Headphones, title: "24/7 Support", description: "Round-the-clock customer support and consultation" },
  ]

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-page-primary">
          {/* Hero Section Skeleton */}
          <section className="relative py-20 bg-gradient-to-r from-page-secondary to-page-tertiary overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-page-primary/5"></div>
            </div>
            <div className="container mx-auto px-4 relative">
              <div className="max-w-4xl mx-auto text-center">
                <div className="h-16 bg-white/10 rounded-lg mb-6 animate-pulse mx-auto max-w-2xl"></div>
                <div className="h-6 bg-white/10 rounded mb-4 animate-pulse max-w-3xl mx-auto"></div>
                <div className="h-6 bg-white/10 rounded mb-8 animate-pulse max-w-2xl mx-auto"></div>
                <div className="flex flex-wrap gap-4 justify-center">
                  <div className="h-12 w-32 bg-white/20 rounded-full animate-pulse"></div>
                  <div className="h-12 w-40 bg-white/20 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section Skeleton */}
          <section className="py-20 bg-page-primary">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <div className="h-8 bg-page-secondary/30 rounded mb-4 animate-pulse max-w-md mx-auto"></div>
                <div className="h-4 bg-page-secondary/20 rounded animate-pulse max-w-lg mx-auto"></div>
              </div>
              <div className="flex justify-center">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20 max-w-6xl">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-accent/20 to-page-tertiary/20 rounded-full mb-6 animate-pulse mx-auto"></div>
                      <div className="h-12 bg-page-secondary/30 rounded mb-3 animate-pulse max-w-24 mx-auto"></div>
                      <div className="h-6 bg-page-secondary/20 rounded animate-pulse max-w-32 mx-auto"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Our Story Section Skeleton */}
          <section className="py-16 bg-page-secondary">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="h-8 bg-page-primary/30 rounded mb-6 animate-pulse max-w-sm"></div>
                  <div className="space-y-4">
                    <div className="h-4 bg-page-primary/20 rounded animate-pulse"></div>
                    <div className="h-4 bg-page-primary/20 rounded animate-pulse max-w-3xl"></div>
                    <div className="h-4 bg-page-primary/20 rounded animate-pulse"></div>
                    <div className="h-4 bg-page-primary/20 rounded animate-pulse max-w-2xl"></div>
                    <div className="h-4 bg-page-primary/20 rounded animate-pulse"></div>
                    <div className="h-4 bg-page-primary/20 rounded animate-pulse max-w-xl"></div>
                  </div>
                </div>
                <div className="relative">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="aspect-square bg-page-primary/20 rounded-2xl animate-pulse"></div>
                      <div className="aspect-square bg-page-primary/20 rounded-2xl animate-pulse"></div>
                    </div>
                    <div className="space-y-4 pt-8">
                      <div className="aspect-square bg-page-primary/20 rounded-2xl animate-pulse"></div>
                      <div className="aspect-square bg-page-primary/20 rounded-2xl animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Our Values Section Skeleton */}
          <section className="py-16 bg-page-secondary">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <div className="h-8 bg-page-primary/30 rounded mb-4 animate-pulse max-w-md mx-auto"></div>
                <div className="h-4 bg-page-primary/20 rounded animate-pulse max-w-lg mx-auto"></div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-page-primary rounded-2xl p-6 border border-light/50">
                    <div className="w-14 h-14 bg-accent/20 rounded-full mb-4 animate-pulse"></div>
                    <div className="h-6 bg-page-secondary/30 rounded mb-3 animate-pulse"></div>
                    <div className="h-4 bg-page-secondary/20 rounded mb-2 animate-pulse"></div>
                    <div className="h-4 bg-page-secondary/20 rounded animate-pulse max-w-sm"></div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Our Team Section Skeleton */}
          <section className="py-16 bg-page-primary">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <div className="h-8 bg-page-secondary/30 rounded mb-4 animate-pulse max-w-md mx-auto"></div>
                <div className="h-4 bg-page-secondary/20 rounded animate-pulse max-w-lg mx-auto"></div>
              </div>
              <div className="flex justify-center items-center">
                <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 max-w-4xl">
                  {[1, 2].map((i) => (
                    <div key={i} className="bg-page-secondary rounded-2xl p-8 border border-light/50 w-full md:w-[400px]">
                      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="w-20 h-20 bg-gradient-to-r from-accent/20 to-page-tertiary/20 rounded-full animate-pulse flex-shrink-0"></div>
                        <div className="text-center md:text-left flex-1">
                          <div className="h-6 bg-page-primary/30 rounded mb-1 animate-pulse max-w-32"></div>
                          <div className="h-4 bg-accent/30 rounded mb-4 animate-pulse max-w-24"></div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-page-primary/20 rounded-full animate-pulse"></div>
                              <div>
                                <div className="h-3 bg-page-primary/20 rounded mb-1 animate-pulse w-16"></div>
                                <div className="h-4 bg-page-primary/20 rounded animate-pulse w-20"></div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-page-primary/20 rounded-full animate-pulse"></div>
                              <div>
                                <div className="h-3 bg-page-primary/20 rounded mb-1 animate-pulse w-16"></div>
                                <div className="h-4 bg-page-primary/20 rounded animate-pulse w-24"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Services Overview Section Skeleton */}
          <section className="py-16 bg-page-secondary">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <div className="h-8 bg-page-primary/30 rounded mb-4 animate-pulse max-w-md mx-auto"></div>
                <div className="h-4 bg-page-primary/20 rounded animate-pulse max-w-lg mx-auto"></div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="text-center">
                    <div className="w-20 h-20 bg-accent/20 rounded-2xl mb-6 animate-pulse mx-auto"></div>
                    <div className="h-6 bg-page-primary/30 rounded mb-3 animate-pulse"></div>
                    <div className="h-4 bg-page-primary/20 rounded mb-2 animate-pulse"></div>
                    <div className="h-4 bg-page-primary/20 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Quality Commitment Section Skeleton */}
          <section className="py-16 bg-gradient-to-r from-accent/5 to-transparent">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <div className="w-20 h-20 bg-accent/20 rounded-full mb-6 animate-pulse mx-auto"></div>
                <div className="h-8 bg-page-primary/30 rounded mb-6 animate-pulse max-w-md mx-auto"></div>
                <div className="space-y-6">
                  <div className="h-4 bg-page-primary/20 rounded animate-pulse max-w-2xl mx-auto"></div>
                  <div className="h-4 bg-page-primary/20 rounded animate-pulse max-w-xl mx-auto"></div>
                  <div className="grid md:grid-cols-3 gap-6 mt-8">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-2 justify-center">
                        <div className="w-5 h-5 bg-accent/30 rounded-full animate-pulse"></div>
                        <div className="h-4 bg-page-primary/20 rounded animate-pulse w-32"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section Skeleton */}
          <section className="py-16 bg-gradient-to-r from-page-secondary to-page-tertiary">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <div className="h-8 bg-white/20 rounded mb-6 animate-pulse max-w-md mx-auto"></div>
                <div className="h-6 bg-white/10 rounded mb-8 animate-pulse max-w-2xl mx-auto"></div>
                <div className="flex flex-wrap gap-4 justify-center">
                  <div className="h-4 bg-white/10 rounded mb-4 animate-pulse max-w-xl mx-auto"></div>
                  <div className="h-12 w-40 bg-white/20 rounded-full animate-pulse"></div>
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
      <section className="relative py-20 bg-gradient-to-r from-page-secondary to-page-tertiary overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
          }} />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">
              About Awais Printers
            </h1>
            <p className="text-xl text-secondary mb-8 max-w-3xl mx-auto">
              For over 28 years, we've been transforming ideas into tangible realities through 
              exceptional printing services. From humble beginnings to industry leadership, 
              our journey has been defined by passion, innovation, and unwavering commitment to quality.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-8 py-3 bg-accent text-white font-semibold rounded-full hover:opacity-90 transition-opacity">
                Our Story
              </button>
              <button className="px-8 py-3 bg-page-primary text-primary font-semibold rounded-full border-2 border-light hover:border-accent transition-all">
                Meet Our Team
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-page-primary">
  <div className="container mx-auto px-4">
    {/* Title (optional) */}
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-primary mb-4">Our Achievements</h2>
      <p className="text-secondary max-w-2xl mx-auto">
        With decades of experience, we've built a reputation for excellence across the globe.
      </p>
    </div>

    {/* Centered stats - exactly as in image */}
    <div className="flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20 max-w-6xl">
        {/* First Stat */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 mb-6">
            <Globe className="w-10 h-10 text-blue-500" />
          </div>
          <div className="text-5xl font-bold text-primary mb-3">15+</div>
          <div className="text-lg text-secondary font-semibold">Countries Served</div>
        </div>

        {/* Second Stat */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500/10 to-emerald-500/10 mb-6">
            <Clock className="w-10 h-10 text-green-500" />
          </div>
          <div className="text-5xl font-bold text-primary mb-3">28</div>
          <div className="text-lg text-secondary font-semibold">Years Experience</div>
        </div>

        {/* Third Stat */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 mb-6">
            <Star className="w-10 h-10 text-purple-500" />
          </div>
          <div className="text-5xl font-bold text-primary mb-3">99.8%</div>
          <div className="text-lg text-secondary font-semibold">Satisfaction Rate</div>
        </div>
      </div>
    </div>
  </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-page-secondary">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">Our Journey</h2>
              <div className="space-y-4 text-secondary">
                <p>
                  Founded in 1999 by Awais Rasool, our company began as a passion-driven venture with 
                  a steadfast focus on quality and craftsmanship. Through dedication and an unwavering
                  commitment to excellence, we have grown from our humble beginnings into a trusted
                  and reputable business.
                </p>
                <p>
                  We have consistently evolved by investing in cutting-edge technology and expanding 
                  our capabilities to meet the changing needs of the industry. Our journey reflects a
                  continuous pursuit of innovation, blending skilled craftsmanship with modern
                  solutions to deliver exceptional value.
                </p>
                <p>
                  Today, we are supported by a dedicated team of passionate professionals who uphold
                  our core values in every project. Our story is a testament to the power of dedication,
                  strategic innovation, and a relentless focus on building lasting partnerships through
                  superior service.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="aspect-square rounded-2xl bg-accent/10 flex items-center justify-center">
                    <Printer className="w-16 h-16 text-accent" />
                  </div>
                  <div className="aspect-square rounded-2xl bg-page-tertiary flex items-center justify-center">
                    <Palette className="w-16 h-16 text-primary" />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="aspect-square rounded-2xl bg-page-tertiary flex items-center justify-center">
                    <Award className="w-16 h-16 text-primary" />
                  </div>
                  <div className="aspect-square rounded-2xl bg-accent/10 flex items-center justify-center">
                    <Users className="w-16 h-16 text-accent" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

  
      {/* Our Values */}
      <section className="py-16 bg-page-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Our Core Values</h2>
            <p className="text-secondary max-w-2xl mx-auto">
              The principles that guide everything we do at Awais Printers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-page-primary rounded-2xl p-6 border border-light hover:border-accent transition-colors">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 mb-4">
                  <value.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{value.title}</h3>
                <p className="text-secondary">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-page-primary">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-primary mb-4">Meet Our Leadership</h2>
      <p className="text-secondary max-w-2xl mx-auto">
        The talented individuals behind our success, bringing decades of combined experience.
      </p>
    </div>

    {/* Centered container with flexbox */}
    <div className="flex justify-center items-center">
      <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 max-w-4xl">
        {team.map((member, index) => (
          <div key={index} className="bg-page-secondary rounded-2xl p-8 border border-light hover:border-accent transition-colors w-full md:w-[400px]">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-accent to-page-tertiary flex items-center justify-center flex-shrink-0">
                <div className="text-white text-xl font-bold">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
              
              {/* Content */}
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-primary mb-1">{member.name}</h3>
                <p className="text-accent font-medium mb-4">{member.role}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <div className="text-sm text-secondary">Experience</div>
                      <div className="font-semibold text-primary">{member.experience}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                      <Target className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <div className="text-sm text-secondary">Speciality</div>
                      <div className="font-semibold text-primary">{member.speciality}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 bg-page-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">What We Offer</h2>
            <p className="text-secondary max-w-2xl mx-auto">
              Comprehensive printing solutions backed by expertise and cutting-edge technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-accent/10 mb-6">
                  <service.icon className="w-10 h-10 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{service.title}</h3>
                <p className="text-secondary">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Commitment */}
      <section className="py-16 bg-gradient-to-r from-accent/5 to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 mb-6">
              <Shield className="w-10 h-10 text-accent" />
            </div>
            <h2 className="text-3xl font-bold text-primary mb-6">Our Quality Promise</h2>
            <div className="space-y-6 text-secondary text-lg">
              <p>
                Every project at Awais Printers undergoes rigorous quality checks at multiple stages. 
                From design approval to final delivery, we maintain the highest standards in the industry.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                {[
                  "100% Satisfaction Guarantee",
                  "Industry-Leading Color Accuracy",
                  "Premium Materials Only"
                ].map((point, index) => (
                  <div key={index} className="flex items-center gap-2 justify-center">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
    <Footer />
    </>
  )
}