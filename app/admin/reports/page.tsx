'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function Reports() {
  const [reportType, setReportType] = useState('entries')
  const [reportData, setReportData] = useState<any>(null)

  useEffect(() => {
    fetchReportData()
  }, [reportType])

  const fetchReportData = async () => {
    try {
      const response = await fetch(`/api/reports?type=${reportType}`)
      if (response.ok) {
        const data = await response.json()
        setReportData(data)
      }
    } catch (error) {
      console.error('Error fetching report data:', error)
    }
  }

  const renderChart = () => {
    if (!reportData) return null

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
        },
      },
    }

    const data = {
      labels: reportData.labels,
      datasets: [
        {
          label: reportType,
          data: reportData.values,
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
      ],
    }

    return <Bar options={options} data={data} />
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Reports</h2>
      <div>
        <Select onValueChange={(value) => setReportType(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select report type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="entries">Entries Summary</SelectItem>
            <SelectItem value="activities">Collection Officers' Activities</SelectItem>
            <SelectItem value="regions">Region-wise Data</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {renderChart()}
      <Button onClick={() => window.print()}>Export Report</Button>
    </div>
  )
}

