/**
 * Daily Event Count Chart Component
 * Shows count of motion events per day as a simple bar chart
 */

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Paper, Typography } from '@mui/material';

function DailyEventCountChart({ dailyEventCounts }) {
  if (!dailyEventCounts || Object.keys(dailyEventCounts).length === 0) {
    return (
      <Paper sx={{ padding: '20px', height: '100%' }}>
        <Typography variant="h6" sx={{ marginBottom: '20px' }}>
          Daily Motion Event Counts
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No data available
        </Typography>
      </Paper>
    );
  }

  // Convert dailyEventCounts object to array for charting
  const chartData = Object.entries(dailyEventCounts)
    .map(([date, count]) => ({
      date,
      count
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const totalEvents = chartData.reduce((sum, item) => sum + item.count, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{data.date}</p>
          <p style={{ margin: '5px 0 0 0' }}>Events: {data.count}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Paper sx={{ padding: '20px', height: '100%' }}>
      <Typography variant="h6" sx={{ marginBottom: '10px' }}>
        Daily Motion Event Counts
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '20px' }}>
        {chartData.length} day(s) with motion | {totalEvents} total events
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis
            dataKey="date"
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            label={{ value: 'Event Count', angle: -90, position: 'insideLeft' }}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="count"
            fill="#4A90E2"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default DailyEventCountChart;
