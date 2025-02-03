"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ChartData {
  name: string
  value: number
}

export interface ChartProps {
  data: ChartData[]
}

const Chart = ({ data }: ChartProps): JSX.Element => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  )
}

Chart.displayName = 'Chart'

export { Chart }
export default Chart
