"use client"

import { useState } from "react"
import styles from './styles.module.css'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Trees, Bus, Download, Activity, MapPin } from "lucide-react"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import dynamic from "next/dynamic"

const MapWithNoSSR = dynamic(() => import("@/components/map"), { ssr: false })

interface AnalysisData {
  congestion_score: number;
  green_space_ratio: number;
  public_transport_coverage: number;
  optimization_suggestions: string[];
  historical_data: {
    date: string;
    congestion: number;
    green_space: number;
    public_transport: number;
  }[];
  area_distribution: {
    category: string;
    percentage: number;
  }[];
}

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  unit?: string;
}

import { TooltipProps } from 'recharts';
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1A2238] border border-[#2A3441] p-3 rounded-lg shadow-lg">
        <p className="text-gray-200 font-medium">{label}</p>
        {payload.map((entry, index) => {
          const colorClass = entry.name === "Congestion" ? "text-orange-400" 
            : entry.name === "Green Space" ? "text-emerald-400"
            : "text-blue-400";
          return (
            <p key={index} className={`text-sm ${colorClass}`}>
              {entry.name}: {entry.value?.toFixed(1)}%
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};

function MetricCard({ title, value, icon, color, unit = "" }: MetricCardProps) {
  const getProgressColor = (color: string) => {
    switch (color) {
      case 'orange': return 'bg-orange-400';
      case 'emerald': return 'bg-emerald-400';
      case 'blue': return 'bg-blue-400';
      default: return 'bg-blue-400';
    }
  };

  return (
    <Card className="bg-[#1A2238] border-[#2A3441]">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-400 font-medium">{title}</p>
          {icon}
        </div>
        <div className="space-y-2">
          <p className="text-2xl font-bold text-gray-200">
            {value.toFixed(1)}{unit}
          </p>
          <div className="h-2 w-full bg-[#141B2D] rounded-full overflow-hidden">
            <div 
              className={`${styles.progressBar} ${styles.progressBarWidth} ${getProgressColor(color)}`}
              style={{'--progress-width': `${value}%`} as React.CSSProperties}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function UrbanAnalysis() {
  const [selectedArea, setSelectedArea] = useState("downtown")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>({
    congestion_score: 75,
    green_space_ratio: 0.35,
    public_transport_coverage: 0.65,
    optimization_suggestions: [
      "Increase pedestrian walkways",
      "Add more bike lanes",
      "Optimize bus routes"
    ],
    historical_data: [
      { date: 'Jan', congestion: 70, green_space: 30, public_transport: 60 },
      { date: 'Feb', congestion: 65, green_space: 32, public_transport: 62 },
      { date: 'Mar', congestion: 75, green_space: 33, public_transport: 65 },
      { date: 'Apr', congestion: 68, green_space: 35, public_transport: 68 },
      { date: 'May', congestion: 72, green_space: 35, public_transport: 70 },
    ],
    area_distribution: [
      { category: 'Residential', percentage: 45 },
      { category: 'Commercial', percentage: 25 },
      { category: 'Green Space', percentage: 15 },
      { category: 'Infrastructure', percentage: 15 },
    ]
  })

  const handleAnalyze = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('http://localhost:8000/api/analyze-urban-area', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ area: selectedArea, include_suggestions: true }),
      })
      if (!response.ok) throw new Error('Failed to analyze area')
      const data = await response.json()
      setAnalysisData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-gray-100">
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
            Urban Analysis
          </h1>
          <Button 
            className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20"
            disabled={isLoading}
            onClick={handleAnalyze}
          >
            {isLoading ? (
              <Activity className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <MapPin className="h-4 w-4 mr-2" />
            )}
            {isLoading ? "Analyzing..." : "Analyze Area"}
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-[#1A2238] border-[#2A3441]">
              <CardHeader>
                <CardTitle className="text-gray-200 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-400" />
                  City Layout Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] rounded-lg overflow-hidden bg-[#141B2D] p-1">
                  <MapWithNoSSR />
                </div>
              </CardContent>
            </Card>

            {analysisData && (
              <>
                <div className="grid md:grid-cols-3 gap-4">
                  <MetricCard 
                    title="Congestion"
                    value={analysisData.congestion_score}
                    icon={<Building2 className="h-5 w-5 text-orange-400" />}
                    color="orange"
                  />
                  <MetricCard 
                    title="Green Space"
                    value={analysisData.green_space_ratio * 100}
                    icon={<Trees className="h-5 w-5 text-emerald-400" />}
                    color="emerald"
                    unit="%"
                  />
                  <MetricCard 
                    title="Public Transit"
                    value={analysisData.public_transport_coverage * 100}
                    icon={<Bus className="h-5 w-5 text-blue-400" />}
                    color="blue"
                    unit="%"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-[#1A2238] border-[#2A3441]">
                    <CardHeader>
                      <CardTitle className="text-gray-200">Historical Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] bg-[#141B2D] rounded-lg p-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={analysisData.historical_data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2A3441" />
                            <XAxis 
                              dataKey="date" 
                              stroke="#64748b" 
                              tick={{ fill: '#64748b' }}
                            />
                            <YAxis 
                              stroke="#64748b" 
                              tick={{ fill: '#64748b' }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="congestion" 
                              name="Congestion"
                              stroke="#fb923c" 
                              strokeWidth={2}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="green_space" 
                              name="Green Space"
                              stroke="#34d399" 
                              strokeWidth={2}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="public_transport" 
                              name="Public Transport"
                              stroke="#60a5fa" 
                              strokeWidth={2}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#1A2238] border-[#2A3441]">
                    <CardHeader>
                      <CardTitle className="text-gray-200">Area Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] bg-[#141B2D] rounded-lg p-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={analysisData.area_distribution}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2A3441" />
                            <XAxis 
                              dataKey="category" 
                              stroke="#64748b" 
                              tick={{ fill: '#64748b' }}
                            />
                            <YAxis 
                              stroke="#64748b" 
                              tick={{ fill: '#64748b' }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar 
                              dataKey="percentage" 
                              name="Percentage"
                              fill="#60a5fa" 
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </div>

          <div className="space-y-6">
            <Card className="bg-[#1A2238] border-[#2A3441]">
              <CardHeader>
                <CardTitle className="text-gray-200">Area Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger className="bg-[#141B2D] border-[#2A3441]">
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="downtown">Downtown</SelectItem>
                    <SelectItem value="suburban">Suburban</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                  </SelectContent>
                </Select>

                {error && (
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                    {error}
                  </div>
                )}
              </CardContent>
            </Card>

            {analysisData && (
              <Card className="bg-[#1A2238] border-[#2A3441]">
                <CardHeader>
                  <CardTitle className="text-gray-200">Optimization Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysisData.optimization_suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300">
                        <div className="h-2 w-2 rounded-full bg-blue-400 mt-2"></div>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6 bg-[#141B2D] hover:bg-[#1A2238] border border-[#2A3441] text-gray-200">
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
