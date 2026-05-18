"use client"

import { Footer } from "../components/footer"
import { Header } from "../components/header"
import { useState, useEffect } from "react"
import { 
  Phone, Mail, MapPin, Clock, MessageSquare, 
  Send, User, Briefcase, Globe, CheckCircle,
  Share2, Camera, MessageCircle, Link, Play,
  Navigation, Loader2, AlertCircle, ExternalLink
} from "lucide-react"
import { useTheme } from "@/app/theme-provider"

export default function ContactPage() {
  const { theme } = useTheme()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // Directions states
  const [isGettingDirections, setIsGettingDirections] = useState(false)
  const [directionsError, setDirectionsError] = useState("")
  const [directionsSuccess, setDirectionsSuccess] = useState("")

  // Destination coordinates - UPDATE THESE WITH YOUR ACTUAL LOCATION
  const DESTINATION = {
    lat: 31.534300, // Lahore, Pakistan coordinates (approximate for Ichra)
    lng: 74.313390,
    address: "H # 29/c, Tabassum Street, Sohail Shami Shaheed Road, Ichra, Lahore, Pakistan",
    name: "Awais Printers Office"
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({ name: "", email: "", phone: "", company: "", service: "", message: "" })
    
    setTimeout(() => setIsSubmitted(false), 5000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  // Function to get user's current location
  const getCurrentLocation = (): Promise<{lat: number, lng: number}> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"))
        return
      }

      const timeoutId = setTimeout(() => {
        reject(new Error("Location request timed out"))
      }, 10000)

      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeoutId)
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          clearTimeout(timeoutId)
          let errorMessage
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location permission denied. Please enable location services."
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable."
              break
            case error.TIMEOUT:
              errorMessage = "Location request timed out."
              break
            default:
              errorMessage = "An unknown error occurred."
              break
          }
          reject(new Error(errorMessage))
        },
        {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 0
        }
      )
    })
  }

  // Main function to get directions
  const getDirections = async () => {
    try {
      setIsGettingDirections(true)
      setDirectionsError("")
      setDirectionsSuccess("")

      const userLocation = await getCurrentLocation()
      
      setDirectionsSuccess("Opening Google Maps with directions...")
      
      // Create Google Maps URL with directions
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${DESTINATION.lat},${DESTINATION.lng}&travelmode=driving&dir_action=navigate`
      
      // Open Google Maps in a new tab after a short delay
      setTimeout(() => {
        window.open(mapsUrl, '_blank', 'noopener,noreferrer')
        setIsGettingDirections(false)
        setTimeout(() => setDirectionsSuccess(""), 3000)
      }, 1000)

    } catch (error) {
      console.error('Error getting directions:', error)
      
      // Show error message
      setDirectionsError(error instanceof Error ? error.message : "Failed to get directions")
      setIsGettingDirections(false)
      
      // Fallback: Open Google Maps with just destination (no user location)
      setTimeout(() => {
        const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${DESTINATION.lat},${DESTINATION.lng}`
        window.open(fallbackUrl, '_blank', 'noopener,noreferrer')
        setDirectionsError("Opened Google Maps with destination only")
        setTimeout(() => setDirectionsError(""), 3000)
      }, 1500)
    }
  }

  // Alternative function without location permission
  const openGoogleMaps = () => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${DESTINATION.lat},${DESTINATION.lng}`
    window.open(mapsUrl, '_blank', 'noopener,noreferrer')
    setDirectionsSuccess("Opening Google Maps...")
    setTimeout(() => setDirectionsSuccess(""), 3000)
  }

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone Numbers",
      details: [
        { label: "Primary", value: "+92 322 4432533" },
      ],
      color: "text-blue-500"
    },
    {
      icon: Mail,
      title: "Email Addresses",
      details: [
        { label: "General Inquiries", value: "awais.printers@yahoo.com" },
      ],
      color: "text-red-500"
    },
    {
      icon: MapPin,
      title: "Office Locations",
      details: [
        { label: "Head Office", value: "H # 29/c, Tabassum Street, Sohail Shami Shaheed Road, Ichra, Lahore, Pakistan" },
      ],
      color: "text-green-500"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: [
        { label: "Monday - Friday", value: "24/7" },
        { label: "Saturday", value: "10:00 AM - 6:00 PM" },
        { label: "Sunday", value: "Emergency Services Only" },
      ],
      color: "text-yellow-500"
    }
  ]

  const services = [
    "Business Cards",
    "Brochures & Flyers",
    "Banners & Signage",
    "Packaging",
    "Labels & Stickers",
    "Letterheads",
    "Catalogs",
    "Presentation Folders",
    "Leather Patches",
    "Woven Labels",
    "Hang Tags",
    "Screen Printing",
    "Offset Printing",
    "Digital Printing",
    "Foil Stamping",
    "Embossing",
    "Die Cutting",
    "Lamination"
  ]

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-page-primary">
          {/* Loading skeleton remains the same */}
          {/* ... (keep your existing loading skeleton code) ... */}
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
      <section className="relative py-20 bg-gradient-to-r from-page-secondary to-page-tertiary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">
              Get in Touch With Us
            </h1>
            <p className="text-xl text-secondary mb-8 max-w-3xl mx-auto">
              Have questions about printing? Need a quote? Want to discuss your project? 
              Our team is ready to help you bring your ideas to life.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a 
                href="tel:+923224862371" 
                className="px-8 py-3 bg-accent text-white font-semibold rounded-full hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Call Now
              </a>
              <a 
                href="mailto:awais.printers@yahoo.com" 
                className="px-8 py-3 bg-page-primary text-primary font-semibold rounded-full border-2 border-light hover:border-accent transition-all flex items-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Email Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information Grid */}
      <section className="py-16 bg-page-primary">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-page-secondary rounded-2xl p-6 border border-light hover:border-accent transition-colors">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full bg-current/10 mb-4 ${info.color}`}>
                  <info.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-4">{info.title}</h3>
                <div className="space-y-3">
                  {info.details.map((detail, idx) => (
                    <div key={idx}>
                      <p className="text-sm text-secondary font-medium">{detail.label}</p>
                      <p className="text-primary font-medium">{detail.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-16 bg-page-secondary">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <div className="sticky top-24">
                <h2 className="text-3xl font-bold text-primary mb-2">Send Us a Message</h2>
                <p className="text-secondary mb-8">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>

                {isSubmitted && (
                  <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <div className="flex items-center gap-3 text-green-600">
                      <CheckCircle className="w-6 h-6" />
                      <div>
                        <p className="font-semibold">Message Sent Successfully!</p>
                        <p className="text-sm">We'll contact you soon.</p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-page-primary border border-light text-primary placeholder:text-secondary focus:outline-none focus:border-accent transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-page-primary border border-light text-primary placeholder:text-secondary focus:outline-none focus:border-accent transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-page-primary border border-light text-primary placeholder:text-secondary focus:outline-none focus:border-accent transition-colors"
                        placeholder="+92 300 1234567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        <Briefcase className="w-4 h-4 inline mr-2" />
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-page-primary border border-light text-primary placeholder:text-secondary focus:outline-none focus:border-accent transition-colors"
                        placeholder="Your Company"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      <Globe className="w-4 h-4 inline mr-2" />
                      Service Interested In *
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-page-primary border border-light text-primary focus:outline-none focus:border-accent transition-colors"
                    >
                      <option value="">Select a service</option>
                      {services.map((service, index) => (
                        <option key={index} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      <MessageSquare className="w-4 h-4 inline mr-2" />
                      Your Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg bg-page-primary border border-light text-primary placeholder:text-secondary focus:outline-none focus:border-accent transition-colors resize-none"
                      placeholder="Tell us about your project requirements, quantity, timeline, and any specific details..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-accent text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>

                  <p className="text-sm text-secondary text-center">
                    By submitting this form, you agree to our Privacy Policy and Terms of Service.
                  </p>
                </form>
              </div>
            </div>

            {/* Map & Additional Info */}
            <div className="space-y-8">
              {/* Map Section with Directions */}
              <div className="rounded-2xl overflow-hidden border border-light bg-page-primary">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-accent" />
                    Our Location
                  </h3>
                  
                  <div className="mb-6 p-4 bg-page-secondary rounded-xl border border-light">
                    <p className="text-primary font-medium mb-1">{DESTINATION.name}</p>
                    <p className="text-secondary text-sm">{DESTINATION.address}</p>
                  </div>

                  {/* Directions Status Messages */}
                  {directionsSuccess && (
                    <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <p className="text-sm">{directionsSuccess}</p>
                      </div>
                    </div>
                  )}

                  {directionsError && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-5 h-5" />
                        <p className="text-sm">{directionsError}</p>
                      </div>
                    </div>
                  )}

                  {/* Directions Buttons */}
                  <div className="grid gap-3">
                    <button
                      onClick={getDirections}
                      disabled={isGettingDirections}
                      className="w-full py-3 bg-accent text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isGettingDirections ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Getting Your Location...
                        </>
                      ) : (
                        <>
                          <Navigation className="w-5 h-5" />
                          Get Directions (With Your Location)
                        </>
                      )}
                    </button>

                    <button
                      onClick={openGoogleMaps}
                      className="w-full py-3 bg-page-secondary text-primary font-semibold rounded-lg border border-light hover:border-accent transition-colors flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-5 h-5" />
                      Open in Google Maps
                    </button>
                  </div>

                  <div className="mt-4 text-xs text-secondary text-center">
                    <p>We'll ask for location permission to provide accurate directions.</p>
                    <p>Your location data is only used to calculate the route.</p>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-2xl p-6 border border-red-500/20">
                <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                  <Phone className="w-6 h-6 text-red-500" />
                  24/7 Emergency Support
                </h3>
                <p className="text-secondary mb-4">
                  For urgent printing needs or technical support outside business hours.
                </p>
                <a 
                  href="tel:+923224862371"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 text-white font-semibold rounded-full hover:opacity-90 transition-opacity"
                >
                  <Phone className="w-5 h-5" />
                  Call Emergency Hotline
                </a>
              </div>

              {/* Social Media */}
              <div className="bg-page-primary rounded-2xl p-6 border border-light">
                <h3 className="text-xl font-bold text-primary mb-4">Connect With Us</h3>
                <p className="text-secondary mb-6">
                  Follow us on social media for updates, tips, and special offers.
                </p>
                <div className="grid grid-cols-5 gap-4">
                  {[
                    { icon: Share2, label: "Facebook", color: "bg-blue-600 hover:bg-blue-700" },
                    { icon: Camera, label: "Instagram", color: "bg-linear-to-br from-pink-600 to-purple-700 hover:from-pink-700 hover:to-purple-800" },
                    { icon: MessageCircle, label: "Twitter", color: "bg-sky-500 hover:bg-sky-600" },
                    { icon: Link, label: "LinkedIn", color: "bg-blue-700 hover:bg-blue-800" },
                    { icon: Play, label: "YouTube", color: "bg-red-600 hover:bg-red-700" },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href="#"
                      className={`${social.color} aspect-square rounded-xl flex items-center justify-center text-white transition-colors`}
                      aria-label={social.label}
                    >
                      <social.icon className="w-6 h-6" />
                    </a>
                  ))}
                </div>
              </div>

              {/* FAQ Preview */}
              <div className="bg-page-primary rounded-2xl p-6 border border-light">
                <h3 className="text-xl font-bold text-primary mb-4">Quick Questions</h3>
                <div className="space-y-4">
                  {[
                    { q: "What's your typical turnaround time?", a: "3-5 business days" },
                    { q: "Do you offer bulk discounts?", a: "Yes, for orders over 500 units" },
                    { q: "Can I upload my design files?", a: "Yes, via our online portal" },
                  ].map((faq, index) => (
                    <div key={index} className="pb-4 border-b border-light last:border-0">
                      <p className="font-medium text-primary mb-1">{faq.q}</p>
                      <p className="text-secondary">{faq.a}</p>
                    </div>
                  ))}
                </div>
                <a 
                  href="/faq" 
                  className="inline-block mt-4 text-accent hover:underline font-medium"
                >
                  View all FAQs →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-page-secondary to-page-tertiary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-primary mb-6">
              Ready to Start Your Printing Project?
            </h2>
            <p className="text-xl text-secondary mb-8">
              Contact us today for a free consultation and quote. Let's create something amazing together!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a 
                href="tel:+923224432533" 
                className="px-8 py-4 bg-accent text-white font-semibold rounded-full hover:opacity-90 transition-opacity text-lg flex items-center gap-2"
              >
                <Phone className="w-6 h-6" />
                Call Now: +92 322 4432533
              </a>
              <a 
                href="https://wa.me/923224432533" 
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-green-600 text-white font-semibold rounded-full hover:opacity-90 transition-opacity text-lg flex items-center gap-2"
              >
                <MessageSquare className="w-6 h-6" />
                WhatsApp Chat
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
    <Footer />
    </>
  )
}