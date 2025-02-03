"use client";

import React, { useEffect, useState } from 'react';
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
  traffic_metrics: {
    current_flow: number;
    peak_hours: Array<{
      hour: string;
      level: number;
    }>;
    area_statistics: {
      downtown: { flow: number; congestion: number };
      residential: { flow: number; congestion: number };
      industrial: { flow: number; congestion: number };
      suburban: { flow: number; congestion: number };
    };
  };
  sustainability_metrics: {
    green_coverage: number;
    emissions_reduction: number;
    energy_efficiency: number;
    trends: Array<{
      date: string;
      traffic_flow: number;
      congestion: number;
      public_transport: number;
    }>;
  };
  prediction_metrics: {
    historical_accuracy: number;
    current_confidence: number;
    forecast_trends: Array<{
      timeframe: string;
      prediction: number;
    }>;
  };
  urban_metrics: {
    density: {
      residential: number;
      commercial: number;
      industrial: number;
    };
    infrastructure: {
      roads: number;
      public_transport: number;
      green_spaces: number;
    };
    zone_activity: Array<{
      date: string;
      traffic_flow: number;
      congestion: number;
      public_transport: number;
    }>;
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
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://localhost:8000/api/dashboard-metrics');
        if (!response.ok) {
          throw new Error('Failed to fetch metrics');
        }
        const data = await response.json();
        setMetrics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="container py-8">
          <h1 className="text-4xl font-bold text-slate-900">Loading...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="container py-8">
          <h1 className="text-4xl font-bold text-slate-900">Error: {error}</h1>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

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
              { label: "Current Flow", value: metrics.traffic_metrics.current_flow / 100 },
              { label: "Peak Congestion", value: Math.max(...metrics.traffic_metrics.peak_hours.map(h => h.level)) / 100 }
            ]}
            href="/dashboard/traffic-flow"
          />
          <MetricCard
            title="Sustainability"
            icon={<Leaf />}
            metrics={[
              { label: "Green Coverage", value: metrics.sustainability_metrics.green_coverage / 100 },
              { label: "Energy Efficiency", value: metrics.sustainability_metrics.energy_efficiency / 100 }
            ]}
            href="/dashboard/sustainability"
          />
          <MetricCard
            title="Urban Analysis"
            icon={<Building2 />}
            metrics={[
              { label: "Infrastructure", value: metrics.urban_metrics.infrastructure.roads / 100 },
              { label: "Green Spaces", value: metrics.urban_metrics.infrastructure.green_spaces / 100 }
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
