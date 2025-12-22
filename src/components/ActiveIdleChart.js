/**
 * Active vs Idle Time Pie Chart Component
 * Displays the proportion of active motion time vs idle time
 */

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Paper, Typography, Box } from '@mui/material';

const COLORS = ['#4CAF50', '#B0BEC5'];

function ActiveIdleChart({ activeTime, idleTime }) {
  const totalTime = activeTime + idleTime;

  if (totalTime <= 0) {
    return (
      <Paper sx={{ padding: '20px', height: '100%' }}>
        <Typography variant="h6" sx={{ marginBottom: '20px' }}>
          Active vs Idle Time
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No valid time intervals found
        </Typography>
      </Paper>
    );
  }

  const data = [
    { name: 'Active', value: Math.max(activeTime, 0) },
    { name: 'Idle', value: Math.max(idleTime, 0) }
  ];

  const renderLabel = (entry) => {
    const percentage = ((entry.value / totalTime) * 100).toFixed(1);
    return `${percentage}%`;
  };

  return (
    <Paper sx={{ padding: '20px', height: '100%' }}>
      <Typography variant="h6" sx={{ marginBottom: '10px' }}>
        Active vs Idle Time
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `${value.toFixed(2)}s`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
      <Box sx={{ marginTop: '10px', textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Active: {activeTime.toFixed(2)}s | Idle: {idleTime.toFixed(2)}s | Total: {totalTime.toFixed(2)}s
        </Typography>
      </Box>
    </Paper>
  );
}

export default ActiveIdleChart;
