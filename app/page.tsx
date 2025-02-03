import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Building2, Users, BarChart3, Leaf, ArrowRight, Globe, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Remove motion imports since we're not using Framer Motion
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface StatsCardProps {
  number: string;
  label: string;
  icon: React.ReactNode;
}

function StatsCard({ number, label, icon }: StatsCardProps) {
  return (
    <Card className="bg-white/5 border-white/10">
      <CardContent className="p-6 flex items-center space-x-4">
        <div className="p-3 rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-200">{number}</p>
          <p className="text-sm text-gray-400">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="transform transition-all duration-200 hover:-translate-y-1">
      <Card className="bg-white/5 border-white/10 hover:border-primary/50 transition-colors">
        <CardHeader>
          <div className="mb-4 text-primary">{icon}</div>
          <CardTitle className="text-xl text-gray-200">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-gray-400">{description}</CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      {/* Hero Section with Background */}
      <div className="relative min-h-screen flex flex-col">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-transparent to-fuchsia-500/20" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-purple-400/20 blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-400/20 blur-3xl animate-pulse" />
        </div>

        {/* Header */}
        <header className="relative z-10 border-b border-white/10 bg-white/5 backdrop-blur-lg">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe className="h-6 w-6 text-primary animate-pulse" />
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500">
                UrbanDev AI
              </h1>
            </div>
            <nav className="flex items-center gap-6">
              <Link href="/auth/login" className="text-sm font-medium text-gray-300 hover:text-primary transition-colors">
                Login
              </Link>
              <Button asChild variant="default" size="sm" className="bg-primary hover:bg-primary/90">
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </nav>
          </div>
        </header>

        {/* Hero Content */}
        <div className="relative flex-1 flex items-center justify-center px-4 py-20">
          <div className="text-center max-w-3xl mx-auto">
            <div className="space-y-6">
              <h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500">
                Future of Urban Planning
              </h2>
              <p className="text-xl leading-relaxed text-gray-300">
                Transform your city with AI-powered insights and sustainable solutions.
                Join the revolution in urban development.
              </p>
              <div className="flex justify-center gap-4">
                <Button size="lg" className="group bg-primary hover:bg-primary/90">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button variant="outline" size="lg" className="border-primary/20 hover:bg-primary/10">
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="container mx-auto px-4 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatsCard number="98%" label="Accuracy Rate" icon={<Zap className="h-5 w-5" />} />
            <StatsCard number="50+" label="Cities Powered" icon={<Building2 className="h-5 w-5" />} />
            <StatsCard number="1M+" label="Data Points" icon={<BarChart3 className="h-5 w-5" />} />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500">
              Powerful Features
            </h2>
            <p className="text-gray-400">Advanced tools for modern urban development</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Building2 className="h-10 w-10" />}
              title="Smart Infrastructure"
              description="AI-powered analysis for optimal urban planning and development"
            />
            <FeatureCard
              icon={<Users className="h-10 w-10" />}
              title="Community Focus"
              description="Data-driven insights to enhance quality of life for citizens"
            />
            <FeatureCard
              icon={<Leaf className="h-10 w-10" />}
              title="Sustainability"
              description="Eco-friendly solutions for a greener future"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-lg border-t border-white/10 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500">
                UrbanDev AI
              </h3>
              <p className="text-sm text-gray-400">
                Empowering cities with AI-driven solutions
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-200">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-primary transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Solutions</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-200">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-primary transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-200">Connect</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-primary transition-colors">Twitter</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">LinkedIn</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">GitHub</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}