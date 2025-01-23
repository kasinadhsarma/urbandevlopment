import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Building2, Users, BarChart3, Leaf, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">UrbanDev AI</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/auth/login" className="hover:underline">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="hover:underline">
                  Sign Up
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Revolutionizing Urban Infrastructure</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Empowering cities with AI-driven solutions for smarter, sustainable development. Join the future of urban
            planning today.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/auth/signup" passHref>
              <Button size="lg">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features" passHref>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </section>

        <section id="features" className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
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
        </section>

        <section className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>1. Input City Data</CardTitle>
              </CardHeader>
              <CardContent>
                Upload your city&apos;s data, including maps, demographics, and infrastructure details.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>2. AI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                Our advanced AI algorithms analyze the data to identify patterns and opportunities.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>3. Actionable Insights</CardTitle>
              </CardHeader>
              <CardContent>
                Receive detailed reports and visualizations to guide your urban development decisions.
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your City?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join the growing network of smart cities using UrbanDev AI
          </p>
          <Link href="/auth/signup" passHref>
            <Button size="lg">Start Free Trial</Button>
          </Link>
        </section>
      </main>
      <footer className="bg-muted py-8">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-2">UrbanDev AI</h3>
            <p className="text-sm text-muted-foreground">
              Empowering cities with AI-driven urban development solutions.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:underline">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Whitepapers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Webinars
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Connect With Us</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:underline">
                  Twitter
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  LinkedIn
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Facebook
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Instagram
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © 2023 UrbanDev AI. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="flex flex-col items-center text-center">
      <CardHeader>
        <div className="mb-4 text-primary">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

