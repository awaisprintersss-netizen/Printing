import Image from "next/image"
import Link from "next/link"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "What printing services do you offer?",
    answer:
      "Awais Printers offers a wide variety of printing and finishing services, including hang tags, leather patches, and care labels.",
  },
  {
    question: "How can I get my print job once it is finished?",
    answer: "You can pick up your print job from our location or we can arrange delivery to your address.",
  },
  {
    question: "Can you design or help me design my print job?",
    answer: "Yes, our design team can help you create the perfect design for your printing needs.",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="bg-page-primary py-20 relative scroll-mt-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-accent text-sm font-medium mb-4 tracking-wider">FAQ</p>
          <h2 className="text-4xl md:text-5xl font-bold text-primary">
            Printing Services Frequently
            <br />
            Asked Questions
          </h2>
        </div>

        {/* Content Grid - Original Layout */}
        <div className="grid md:grid-cols-2 gap-12 items-start max-w-7xl mx-auto">
          {/* Left Side - Image */}
          <div className="relative h-[360px] sm:h-[500px] overflow-hidden rounded-lg">
            <Image
              src="/images/Office-Image-1.jpg"
              alt="Operator working at a printing press"
              fill
              sizes="(min-width: 1280px) 600px, (min-width: 768px) 48vw, calc(100vw - 32px)"
              className="object-cover object-center"
            />
          </div>

          {/* Right Side - FAQ Items */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={faq.question} name="printing-faq" open={index === 0} className="group border-b border-light pb-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left [&::-webkit-details-marker]:hidden">
                  <span className="text-lg font-semibold text-primary group-open:text-accent">{faq.question}</span>
                  <ChevronDown aria-hidden="true" className="size-5 shrink-0 text-secondary group-open:rotate-180 group-open:text-accent" />
                </summary>
                <p className="mt-4 pr-8 text-secondary leading-relaxed">{faq.answer}</p>
              </details>
            ))}

            {/* Contact link */}
            <div className="pt-8">
              <Link prefetch={false} href="/contact#quote" className="inline-flex bg-accent hover:opacity-90 text-white font-semibold px-12 py-4 rounded-full transition-colors">
                Ask a question
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Striped bars at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-2 flex">
        <div className="flex-1 bg-gray-400" />
        <div className="flex-1 bg-gray-600" />
        <div className="flex-1 bg-gray-400" />
        <div className="flex-1 bg-gray-600" />
        <div className="flex-1 bg-gray-400" />
        <div className="flex-1 bg-gray-600" />
      </div>
    </section>
  )
}