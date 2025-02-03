import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Building2, Users, BarChart3, Leaf, ArrowRight } from "lucide-react"; // Ensure correct import
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">UrbanDev AI</h1>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/auth/login" className="hover:underline hover:text-primary-foreground/80">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="hover:underline hover:text-primary-foreground/80">
                  Sign Up
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Revolutionizing Urban Infrastructure</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Empowering cities with AI-driven solutions for smarter, sustainable development. Join the future of urban
            planning today.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/auth/signup" passHref>
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Get Started <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="#features" passHref>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <FeatureCard
            icon={<Building2 className="h-10 w-10 text-primary" aria-hidden="true" />}
            title="Smart Building Design"
            description="Optimize building layouts and energy efficiency with AI-powered insights"
          />
          <FeatureCard
            icon={<Users className="h-10 w-10 text-primary" aria-hidden="true" />}
            title="Urban Planning"
            description="Create sustainable city plans that prioritize community needs"
          />
          <FeatureCard
            icon={<BarChart3 className="h-10 w-10 text-primary" aria-hidden="true" />}
            title="Data-Driven Decisions"
            description="Make informed choices based on comprehensive urban data analysis"
          />
          <FeatureCard
            icon={<Leaf className="h-10 w-10 text-primary" aria-hidden="true" />}
            title="Sustainability Focus"
            description="Implement eco-friendly solutions for a greener urban future"
          />
        </section>

        {/* How It Works Section */}
        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
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

        {/* Call to Action Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your City?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join the growing network of smart cities using UrbanDev AI
          </p>
          <Link href="/auth/signup" passHref>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Start Free Trial
            </Button>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-4">UrbanDev AI</h3>
            <p className="text-sm text-muted-foreground">
              Empowering cities with AI-driven urban development solutions.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
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
            <h4 className="font-semibold mb-4">Resources</h4>
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
            <h4 className="font-semibold mb-4">Connect With Us</h4>
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
        <div className="container mx-auto px-4 mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          © 2023 UrbanDev AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

// FeatureCard Component
function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="flex flex-col items-center text-center p-6 hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="mb-4">{icon}</div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-muted-foreground">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}