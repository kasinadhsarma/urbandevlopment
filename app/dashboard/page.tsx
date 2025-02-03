"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Car, 
  Leaf, 
  Building2, 
  Activity,
  BarChart3,
  TrendingUp,
  MapPin,
  Zap,
  RefreshCcw
} from "lucide-react";

interface MetricData {
  label: string;
  value: number;
  status?: string;
}

interface DashboardMetrics {
  traffic: {
    congestion_level: number;
    category: string;
  };
  sustainability: {
    emissions_score: number;
    energy_efficiency: number;
  };
  urban: {
    congestion_score: number;
    green_space_ratio: number;
  };
}

interface MetricProgressProps {
  label: string;
  value: number;
  status?: string;
}

interface MetricCardProps {
  title: string;
  icon: React.ReactNode;
  metrics: MetricData[];
  href: string;
}

const quickActions = [
  { icon: <BarChart3 className="h-4 w-4" />, label: "Analyze Traffic", href: "/dashboard/traffic-flow" },
  { icon: <Leaf className="h-4 w-4" />, label: "Check Sustainability", href: "/dashboard/sustainability" },
  { icon: <MapPin className="h-4 w-4" />, label: "Urban Planning", href: "/dashboard/urban-analysis" },
  { icon: <TrendingUp className="h-4 w-4" />, label: "Make Predictions", href: "/dashboard/predict" }
] as const;

const systemStatuses = [
  { label: "Traffic Analysis System", icon: <Car className="h-4 w-4" /> },
  { label: "Sustainability Monitoring", icon: <Leaf className="h-4 w-4" /> },
  { label: "Urban Analysis Tools", icon: <Building2 className="h-4 w-4" /> },
  { label: "Prediction Models", icon: <TrendingUp className="h-4 w-4" /> }
] as const;

function MetricProgress({ label, value, status }: MetricProgressProps) {
  const percentage = Math.round(value * 100);
  
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm text-slate-600">{label}</span>
        <span className="text-sm font-medium">{percentage}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${
            percentage >= 70 ? "bg-green-500" :
            percentage >= 40 ? "bg-yellow-500" :
            "bg-red-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {status && (
        <p className="text-sm mt-2 text-slate-500">Status: {status}</p>
      )}
    </div>
  );
}

function MetricCard({ title, icon, metrics, href }: MetricCardProps) {
  return (
    <Link href={href}>
      <Card className="h-full bg-white/50 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-slate-100 text-primary group-hover:scale-110 transition-all duration-300">
              {icon}
            </div>
            <CardTitle className="group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.map((metric, idx) => (
              <MetricProgress
                key={idx}
                label={metric.label}
                value={metric.value}
                status={metric.status}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function Dashboard() {
  const metrics: DashboardMetrics = {
    traffic: { congestion_level: 0.4, category: "Moderate" },
    sustainability: { emissions_score: 0.41, energy_efficiency: 0.64 },
    urban: { congestion_score: 0.85, green_space_ratio: 0.15 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              Dashboard <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Overview</span>
            </h1>
            <p className="text-slate-600 mt-2">Real-time urban metrics and analysis</p>
          </div>
          <Link href={`/dashboard?refresh=${Date.now()}`}>
            <Button 
              variant="outline" 
              className="gap-2 bg-white shadow-sm hover:shadow-md transition-all"
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh Data
            </Button>
          </Link>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <MetricCard
            title="Traffic Flow"
            icon={<Car />}
            metrics={[
              { label: "Current Congestion", value: metrics.traffic.congestion_level, status: metrics.traffic.category }
            ]}
            href="/dashboard/traffic-flow"
          />
          <MetricCard
            title="Sustainability"
            icon={<Leaf />}
            metrics={[
              { label: "Emissions Score", value: metrics.sustainability.emissions_score },
              { label: "Energy Efficiency", value: metrics.sustainability.energy_efficiency }
            ]}
            href="/dashboard/sustainability"
          />
          <MetricCard
            title="Urban Analysis"
            icon={<Building2 />}
            metrics={[
              { label: "Congestion Score", value: metrics.urban.congestion_score },
              { label: "Green Space Ratio", value: metrics.urban.green_space_ratio }
            ]}
            href="/dashboard/urban-analysis"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-white/50 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-slate-100">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Frequently used tools and analysis features
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, idx) => (
                  <Button
                    key={idx}
                    asChild
                    variant="outline"
                    className="h-24 bg-white hover:bg-slate-50 border-slate-200 hover:border-primary"
                  >
                    <Link href={action.href} className="flex flex-col gap-2 items-center">
                      <div className="p-2 rounded-lg bg-slate-100 text-primary">
                        {action.icon}
                      </div>
                      <span className="text-sm font-medium">{action.label}</span>
                    </Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-slate-100">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>
                    Current status of all analysis systems
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemStatuses.map((status, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-100 text-primary">
                        {status.icon}
                      </div>
                      <span className="text-sm font-medium">{status.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-sm text-green-600 font-medium">Active</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}