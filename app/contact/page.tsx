"use client"

import Link from "next/link"
import { Footer } from "../components/footer"
import { Header } from "../components/header"
import { useState, useRef } from "react"
import { 
  Phone, Mail, MapPin, Clock, MessageSquare, 
  Send, User, Briefcase, Globe, CheckCircle,
  Navigation, Loader2, AlertCircle, ExternalLink
} from "lucide-react"
import { quoteLimits, quoteServices, type QuoteDetails } from "@/lib/quotations/contracts"

const emptyQuote: QuoteDetails = {
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: "",
}

export default function ContactPage() {
  const [formData, setFormData] = useState(emptyQuote)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionMessage, setSubmissionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const inFlight = useRef(false)
  const submission = useRef<{ payload: string; id: string } | null>(null)
  
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleQuoteSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (inFlight.current) return
    const website = new FormData(event.currentTarget).get("website")
    inFlight.current = true
    setIsSubmitting(true)
    setSubmissionMessage(null)
    try {
      const payload = JSON.stringify({ ...formData, website })
      if (submission.current?.payload !== payload) {
        submission.current = { payload, id: crypto.randomUUID() }
      }
      const response = await fetch("/api/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, website, submissionId: submission.current.id }),
        signal: AbortSignal.timeout(20000),
      })
      const result = await response.json()
      if (!response.ok || result.success !== true) {
        if (response.status === 409) submission.current = null
        setSubmissionMessage({ type: "error", text: result.error || "Please check your details and try again." })
        return
      }
      setFormData(emptyQuote)
      submission.current = null
      setSubmissionMessage({ type: "success", text: "Your quotation request was received. We’ll use the details you provided to follow up." })
    } catch {
      setSubmissionMessage({ type: "error", text: "We couldn’t confirm your request. Please try again or contact us on WhatsApp." })
    } finally {
      inFlight.current = false
      setIsSubmitting(false)
    }
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

  return (
    <>
    <Header />
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-page-primary scroll-mt-20">
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
                <p className="text-secondary mb-8" id="quote-status">
                  Tell us about your project to request a quote. You can also{" "}
                  <a className="underline" href="https://wa.me/923224432533">contact us on WhatsApp</a>.
                </p>

                <form id="quote" onSubmit={handleQuoteSubmit} method="post" action="/api/quotations" aria-describedby="quote-status" aria-busy={isSubmitting} className="space-y-6 scroll-mt-24">
                  <div hidden aria-hidden="true">
                    <label htmlFor="quote-website">Leave this field empty</label>
                    <input id="quote-website" name="website" tabIndex={-1} autoComplete="off" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="quote-name" className="block text-sm font-medium text-primary mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="quote-name"
                        name="name"
                        autoComplete="name"
                        maxLength={quoteLimits.name}
                        disabled={isSubmitting}
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-page-primary border border-light text-primary placeholder:text-secondary focus:outline-none focus:border-accent transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="quote-email" className="block text-sm font-medium text-primary mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="quote-email"
                        name="email"
                        autoComplete="email"
                        maxLength={quoteLimits.email}
                        disabled={isSubmitting}
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
                      <label htmlFor="quote-phone" className="block text-sm font-medium text-primary mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="quote-phone"
                        name="phone"
                        autoComplete="tel"
                        maxLength={quoteLimits.phone}
                        disabled={isSubmitting}
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-page-primary border border-light text-primary placeholder:text-secondary focus:outline-none focus:border-accent transition-colors"
                        placeholder="+92 300 1234567"
                      />
                    </div>
                    <div>
                      <label htmlFor="quote-company" className="block text-sm font-medium text-primary mb-2">
                        <Briefcase className="w-4 h-4 inline mr-2" />
                        Company Name
                      </label>
                      <input
                        type="text"
                        id="quote-company"
                        name="company"
                        autoComplete="organization"
                        maxLength={quoteLimits.company}
                        disabled={isSubmitting}
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-page-primary border border-light text-primary placeholder:text-secondary focus:outline-none focus:border-accent transition-colors"
                        placeholder="Your Company"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="quote-service" className="block text-sm font-medium text-primary mb-2">
                      <Globe className="w-4 h-4 inline mr-2" />
                      Service Interested In *
                    </label>
                    <select
                      id="quote-service"
                      name="service"
                      disabled={isSubmitting}
                      value={formData.service}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-page-primary border border-light text-primary focus:outline-none focus:border-accent transition-colors"
                    >
                      <option value="">Select a service</option>
                      {quoteServices.map(service => (
                        <option key={service} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="quote-message" className="block text-sm font-medium text-primary mb-2">
                      <MessageSquare className="w-4 h-4 inline mr-2" />
                      Your Message *
                    </label>
                    <textarea
                      id="quote-message"
                      name="message"
                      maxLength={quoteLimits.message}
                      disabled={isSubmitting}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg bg-page-primary border border-light text-primary placeholder:text-secondary focus:outline-none focus:border-accent transition-colors resize-none"
                      placeholder="Tell us about your project requirements, quantity, timeline, and any specific details..."
                    />
                  </div>

                  {submissionMessage && (
                    <p role={submissionMessage.type === "error" ? "alert" : "status"} className="rounded-xl border border-light bg-page-primary p-4 text-primary">
                      {submissionMessage.text}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-accent text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    {isSubmitting ? "Sending…" : "Send Message"}
                  </button>

                  <p className="text-sm text-secondary text-center">
                    We use your contact details to respond to your quotation request.
                  </p>
                </form>
              </div>
            </div>

            {/* Map & Additional Info */}
            <div className="space-y-8">
              {/* Map Section with Directions */}
              <div id="location" className="scroll-mt-24 rounded-2xl overflow-hidden border border-light bg-page-primary">
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
                    <p>We&apos;ll ask for location permission to provide accurate directions.</p>
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

              {/* FAQ Preview */}
              <div className="bg-page-primary rounded-2xl p-6 border border-light">
                <h3 className="text-xl font-bold text-primary mb-4">Quick Questions</h3>
                <div className="space-y-4">
                  {[
                    { q: "What's your typical turnaround time?", a: "Include your deadline in your quote request so we can confirm the turnaround." },
                    { q: "Do you offer bulk discounts?", a: "Include the quantity in your quote request to discuss pricing." },
                    { q: "How can I share my design files?", a: "Contact us by email or WhatsApp to discuss which files to send." },
                  ].map((faq, index) => (
                    <div key={index} className="pb-4 border-b border-light last:border-0">
                      <p className="font-medium text-primary mb-1">{faq.q}</p>
                      <p className="text-secondary">{faq.a}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href="/#faq"
                  className="inline-block mt-4 text-accent hover:underline font-medium"
                >
                  View all FAQs →
                </Link>
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
              Contact us today for a free consultation and quote. Let&apos;s create something amazing together!
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
    </main>
    <Footer />
    </>
  )
}
