'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Building2, Users, BarChart3, Leaf, ArrowRight, Menu } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            UrbanDev AI
          </h1>
          
          {/* Mobile Menu */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-6 w-6" />
          </button>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8 items-center">
              <li>
                <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-sm font-medium hover:text-primary transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" passHref>
                  <Button size="sm" className="shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
                    Get Started
                  </Button>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <nav className="container mx-auto px-4 py-4">
              <ul className="space-y-4">
                <li>
                  <Link href="#features" className="block text-sm font-medium hover:text-primary transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="block text-sm font-medium hover:text-primary transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/auth/login" className="block text-sm font-medium hover:text-primary transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/auth/signup" passHref>
                    <Button className="w-full shadow-lg shadow-primary/20">Get Started</Button>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-100/20" />
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Revolutionizing Urban Infrastructure
              </h2>
              <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                Empowering cities with AI-driven solutions for smarter, sustainable development. Join the future of urban
                planning today.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/auth/signup" passHref>
                  <Button size="lg" className="shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#features" passHref>
                  <Button variant="outline" size="lg" className="border-2">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<Building2 className="h-10 w-10" />}
                title="Smart Building Design"
                description="Optimize building layouts and energy efficiency with AI-powered insights"
              />
              <FeatureCard
                icon={<Users className="h-10 w-10" />}
                title="Urban Planning"
                description="Create sustainable city plans that prioritize community needs"
              />
              <FeatureCard
                icon={<BarChart3 className="h-10 w-10" />}
                title="Data-Driven Decisions"
                description="Make informed choices based on comprehensive urban data analysis"
              />
              <FeatureCard
                icon={<Leaf className="h-10 w-10" />}
                title="Sustainability Focus"
                description="Implement eco-friendly solutions for a greener urban future"
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <StepCard
                number="01"
                title="Input City Data"
                description="Upload your city's data, including maps, demographics, and infrastructure details."
              />
              <StepCard
                number="02"
                title="AI Analysis"
                description="Our advanced AI algorithms analyze the data to identify patterns and opportunities."
              />
              <StepCard
                number="03"
                title="Actionable Insights"
                description="Receive detailed reports and visualizations to guide your urban development decisions."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary to-purple-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your City?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Join the growing network of smart cities using UrbanDev AI and start building a better future today.
            </p>
            <Link href="/auth/signup" passHref>
              <Button size="lg" variant="secondary" className="shadow-xl shadow-black/20">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <h3 className="font-bold text-white mb-4">UrbanDev AI</h3>
              <p className="text-sm opacity-75">
                Empowering cities with AI-driven urban development solutions.
              </p>
            </div>
            <FooterLinks
              title="Quick Links"
              links={["About Us", "Our Services", "Case Studies", "Contact"]}
            />
            <FooterLinks
              title="Resources"
              links={["Blog", "Whitepapers", "Webinars", "FAQ"]}
            />
            <FooterLinks
              title="Connect With Us"
              links={["Twitter", "LinkedIn", "Facebook", "Instagram"]}
            />
          </div>
          <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm opacity-75">
            © 2024 UrbanDev AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
      <CardHeader>
        <div className="mb-4 text-primary group-hover:scale-110 transition-transform duration-300">{icon}</div>
        <CardTitle className="group-hover:text-primary transition-colors">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-slate-600">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 relative overflow-hidden border-0 shadow-lg">
      <div className="absolute -right-4 -top-4 text-8xl font-bold text-slate-50 group-hover:text-slate-100 transition-colors">
        {number}
      </div>
      <CardHeader>
        <CardTitle className="group-hover:text-primary transition-colors">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-slate-600 relative z-10">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

function FooterLinks({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="font-semibold text-white mb-4">{title}</h4>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link}>
            <Link href="#" className="text-sm hover:text-white transition-colors">
              {link}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}