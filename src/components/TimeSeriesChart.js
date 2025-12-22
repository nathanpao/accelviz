/**
 * Time Series Acceleration Chart Component
 * Displays X and Y acceleration values over time
 */

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Paper, Typography } from '@mui/material';

function TimeSeriesChart({ accelData, fileName }) {
  if (!accelData || accelData.length === 0) {
    return (
      <Paper sx={{ padding: '20px', height: '100%' }}>
        <Typography variant="h6" sx={{ marginBottom: '20px' }}>
          Acceleration Time Series
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No accelerometer data found
        </Typography>
      </Paper>
    );
  }

  // Sample data if too large for performance (show max 500 points)
  const sampleRate = Math.max(1, Math.floor(accelData.length / 500));
  const sampledData = accelData.filter((_, index) => index % sampleRate === 0);

  const chartData = sampledData.map((point, index) => ({
    index: point.index || index,
    x: parseFloat(point.x.toFixed(3)),
    y: parseFloat(point.y.toFixed(3)),
    time: point.timestamp ? point.timestamp.toLocaleTimeString() : `${index}`
  }));

  return (
    <Paper sx={{ padding: '20px', height: '100%' }}>
      <Typography variant="h6" sx={{ marginBottom: '10px' }}>
        Acceleration Time Series
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '20px' }}>
        {accelData.length} samples {sampleRate > 1 ? `(showing every ${sampleRate}th point)` : ''}
      </Typography>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={chartData}
          margin={{ top: 70, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis
            dataKey="index"
            label={{ value: 'Sample Index', position: 'insideBottom', offset: -10 }}
          />
          <YAxis
            label={{ value: 'Acceleration (g)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            formatter={(value, name) => [value, name === 'x' ? 'X Acceleration' : 'Y Acceleration']}
            labelFormatter={(label) => `Sample ${label}`}
          />
          <Legend verticalAlign="top" align="right" height={36} wrapperStyle={{ top: 0, right: 0 }} />
          <Line
            type="monotone"
            dataKey="x"
            stroke="#0072BD"
            name="X Acceleration"
            dot={false}
            strokeWidth={2}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="y"
            stroke="#D95319"
            name="Y Acceleration"
            dot={false}
            strokeWidth={2}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default TimeSeriesChart;
