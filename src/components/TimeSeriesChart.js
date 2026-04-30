import { useState } from 'react';
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
import { Paper, Typography, Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import ChartNote from './ChartNote';

const AXIS_CONFIG = {
  x: { color: '#D95319', label: 'X Acceleration' },
  y: { color: '#0072BD', label: 'Y Acceleration' },
  z: { color: '#77AC30', label: 'Z Acceleration' },
};

function TimeSeriesChart({ accelData }) {
  const [visibleAxes, setVisibleAxes] = useState(['x', 'y', 'z']);

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

  const sampleRate = Math.max(1, Math.floor(accelData.length / 500));
  const sampledData = accelData.filter((_, index) => index % sampleRate === 0);

  const chartData = sampledData.map((point, index) => ({
    elapsedSec: parseFloat(((point.index || index) * 0.01).toFixed(2)),
    x: parseFloat(point.x.toFixed(3)),
    y: parseFloat(point.y.toFixed(3)),
    z: point.z !== undefined ? parseFloat(point.z.toFixed(3)) : undefined,
  }));

  const hasZ = chartData.some(point => point.z !== undefined);
  const axes = hasZ ? ['x', 'y', 'z'] : ['x', 'y'];

  const handleAxisToggle = (_, newAxes) => {
    // Keep at least one axis selected
    if (newAxes.length > 0) setVisibleAxes(newAxes);
  };

  return (
    <Paper sx={{ padding: '20px', height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <Typography variant="h6">
          Acceleration Time Series
        </Typography>
        <ToggleButtonGroup
          value={visibleAxes}
          onChange={handleAxisToggle}
          size="small"
          aria-label="visible axes"
        >
          {axes.map(axis => (
            <ToggleButton
              key={axis}
              value={axis}
              sx={{
                fontWeight: 'bold',
                color: visibleAxes.includes(axis) ? `${AXIS_CONFIG[axis].color} !important` : undefined,
                borderColor: visibleAxes.includes(axis) ? `${AXIS_CONFIG[axis].color} !important` : undefined,
              }}
            >
              {axis.toUpperCase()}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '16px' }}>
        {accelData.length} samples {sampleRate > 1 ? `(showing every ${sampleRate}th point)` : ''}
      </Typography>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis
            dataKey="elapsedSec"
            label={{ value: 'Elapsed Time (nominal, s)', position: 'insideBottom', offset: -10 }}
          />
          <YAxis
            label={{ value: 'Acceleration (g)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            formatter={(value, name) => {
              const labels = { x: 'X Acceleration', y: 'Y Acceleration', z: 'Z Acceleration' };
              return [value, labels[name] || name];
            }}
            labelFormatter={(label) => `t = ${label} s (nominal)`}
          />
          <Legend verticalAlign="top" align="right" height={36} />
          {visibleAxes.includes('x') && (
            <Line
              type="monotone"
              dataKey="x"
              stroke={AXIS_CONFIG.x.color}
              name="X Acceleration"
              dot={false}
              strokeWidth={2}
              isAnimationActive={false}
            />
          )}
          {visibleAxes.includes('y') && (
            <Line
              type="monotone"
              dataKey="y"
              stroke={AXIS_CONFIG.y.color}
              name="Y Acceleration"
              dot={false}
              strokeWidth={2}
              isAnimationActive={false}
            />
          )}
          {hasZ && visibleAxes.includes('z') && (
            <Line
              type="monotone"
              dataKey="z"
              stroke={AXIS_CONFIG.z.color}
              name="Z Acceleration"
              dot={false}
              strokeWidth={2}
              isAnimationActive={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      <ChartNote text="Raw acceleration along each sensor axis during detected events. Spikes indicate rapid changes in speed or direction. X, Y, and Z are sensor-relative — because the wheelchair rotates, these axes do not consistently correspond to fixed directions like forward or sideways." />
    </Paper>
  );
}

export default TimeSeriesChart;
