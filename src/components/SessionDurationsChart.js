/**
 * Session Durations Bar Chart Component
 * Displays duration of each motion event with average line
 * Events labeled as "Event X, Session MM/DD HH:MM:SS"
 */

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Paper, Typography } from '@mui/material';

function SessionDurationsChart({ motionSessions, deviceStartTimeFormatted, isAllSessions = false }) {
  if (!motionSessions || motionSessions.length === 0) {
    return (
      <Paper sx={{ padding: '20px', height: '100%' }}>
        <Typography variant="h6" sx={{ marginBottom: '20px' }}>
          Session Durations
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No durations to display
        </Typography>
      </Paper>
    );
  }

  // Calculate durations
  const durations = motionSessions.map(session => {
    return (session.stop - session.start) / 1000; // Convert to seconds
  });

  const avgDuration = durations.reduce((sum, val) => sum + val, 0) / durations.length;
  const totalDuration = durations.reduce((sum, val) => sum + val, 0);

  const chartData = motionSessions.map((session, index) => {
    const duration = (session.stop - session.start) / 1000;
    const eventLabel = isAllSessions
      ? `E${session.eventNumber}`
      : `Event ${session.eventNumber}`;

    return {
      eventNumber: session.eventNumber,
      duration: parseFloat(duration.toFixed(2)),
      label: eventLabel,
      sessionTime: deviceStartTimeFormatted
    };
  });

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
          <p style={{ margin: 0, fontWeight: 'bold' }}>{data.label}</p>
          {data.sessionTime && (
            <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: '#666' }}>
              Session: {data.sessionTime}
            </p>
          )}
          <p style={{ margin: '5px 0 0 0' }}>Duration: {data.duration}s</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Paper sx={{ padding: '20px', height: '100%', overflow: 'hidden' }}>
      <Typography variant="h6" sx={{ marginBottom: '10px' }}>
        Motion Detection Event Durations
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '20px' }}>
        {motionSessions.length} detection events | Avg: {avgDuration.toFixed(2)}s | Total: {totalDuration.toFixed(2)}s
      </Typography>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={chartData}
          margin={{ top: 70, right: 120, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis
            dataKey="eventNumber"
            height={50}
            tick={{ fontSize: 12 }}
            tickMargin={8}
            label={{ value: 'Event Number', position: 'bottom', offset: 0 }}
          />
          <YAxis
            width={60}
            tick={{ fontSize: 12 }}
            label={{ value: 'Duration (s)', angle: -90, position: 'left' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" align="right" height={36} wrapperStyle={{ top: 0, right: 0 }} />
          <ReferenceLine
            y={avgDuration}
            stroke="red"
            strokeDasharray="3 3"
            label={{ value: `Avg: ${avgDuration.toFixed(2)}s`, position: 'right' }}
          />
          <Bar
            dataKey="duration"
            fill="#0072BD"
            name="Duration"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default SessionDurationsChart;
