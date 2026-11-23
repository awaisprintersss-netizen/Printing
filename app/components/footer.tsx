import Link from "next/link"
import { ChevronUp, Mail, Phone, MessageCircle, MapPin, Clock, Printer, Sparkles, Heart, Shield, Truck, Headphones } from "lucide-react"

const quickLinks = [
  ["Services", "/services"], ["Portfolio", "/gallery"], ["Get a quote", "/contact#quote"],
  ["About Us", "/about"], ["Contact", "/contact"], ["FAQs", "/#faq"],
]

export function Footer() {
  const features = [
    { icon: Shield, title: "Quality Guarantee", desc: "100% satisfaction guaranteed" },
    { icon: Truck, title: "Fast Delivery", desc: "Free shipping" },
    { icon: Headphones, title: "24/7 Support", desc: "Always here to help" },
  ]

  return (
    
    <footer className="bg-page-secondary relative">
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 lg:py-20">
        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <h2 className="sr-only">Printing service information</h2>
          {features.map((feature, index) => {
            const FeatureIcon = feature.icon
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
                  <FeatureIcon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">{feature.title}</h3>
                <p className="text-secondary">{feature.desc}</p>
              </div>
            )
          })}
        </div>

        <section className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
            <Mail className="w-8 h-8 text-accent" aria-hidden="true" />
          </div>
          <h2 className="text-3xl font-bold text-primary mb-4">Request a printing quote</h2>
          <p className="text-secondary mb-8">Share your project details so we can help with the next step.</p>
          <Link prefetch={false} href="/contact#quote" className="inline-flex px-8 py-3 bg-accent text-white font-semibold rounded-full hover:opacity-90 transition-opacity">
            Get a quote
          </Link>
        </section>

        <h2 className="sr-only">Site information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                  <Printer className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary">AwaisPrinters</h3>
                <p className="text-sm text-secondary">Where Ideas Become Reality</p>
              </div>
            </div>
            <p className="text-secondary leading-relaxed">
              Professional printing services with precision and creativity since 1996.
            </p>
            
            <a href="https://wa.me/923224432533" className="inline-flex items-center gap-2 text-secondary hover:text-accent">
              <MessageCircle className="size-5" aria-hidden="true" /> Chat on WhatsApp
            </a>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-primary">Quick Links</h3>
            <div className="grid grid-cols-2 gap-4">
              {quickLinks.map(([label, href]) => (
                <Link prefetch={false}
                  key={href}
                  href={href}
                  className="text-secondary hover:text-accent transition-colors flex items-center gap-2 group"
                >
                  <div className="w-1 h-1 rounded-full bg-current opacity-0 group-hover:opacity-100 transition-opacity" />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-primary">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent mt-1 shrink-0" />
                <span className="text-secondary">H # 29/c, Tabassum Street, Sohail Shami Shaheed Road, Ichra, Lahore, Pakistan</span>
              </div>
              <a href="tel:+923224432533" className="flex items-center gap-3 text-secondary hover:text-accent transition-colors">
                <Phone className="w-5 h-5" />
                <span>+92 322 4432533</span>
              </a>
              <a href="mailto:awais.printers@yahoo.com" className="flex items-center gap-3 text-secondary hover:text-accent transition-colors">
                <Mail className="w-5 h-5" />
                <span>awais.printers@yahoo.com</span>
              </a>
            </div>
          </div>

          {/* Hours */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent" />
              Business Hours
            </h3>
            <div className="space-y-3">
              {[
                { days: 'Mon - Fri', hours: '24/7' },
                { days: 'Saturday', hours: '10:00 AM - 6:00 PM' },
                { days: 'Sunday', hours: 'Closed' },
              ].map((schedule, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-secondary">{schedule.days}</span>
                  <span className={`font-medium ${schedule.hours === 'Closed' ? 'text-red-400' : 'text-primary'}`}>
                    {schedule.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-light">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 text-secondary">
              <Heart className="w-4 h-4 text-accent fill-accent" />
              <span>Awais Printers © {new Date().getFullYear()}</span>
            </div>
            
            <div className="flex flex-wrap gap-6 text-sm text-secondary">
              <a href="/sitemap.xml" className="hover:text-accent">Sitemap</a>
              <a href="#top" className="inline-flex items-center gap-1 hover:text-accent"><ChevronUp className="size-4" aria-hidden="true" /> Back to top</a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top */}
      <div className="absolute bottom-0 left-0 right-0 h-2 flex">
          <div className="flex-1 bg-gray-400" />
          <div className="flex-1 bg-gray-600" />
          <div className="flex-1 bg-gray-400" />
          <div className="flex-1 bg-gray-600" />
          <div className="flex-1 bg-gray-400" />
          <div className="flex-1 bg-gray-600" />
        </div>
    </footer>
  )
}