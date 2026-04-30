import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Paper, Typography } from '@mui/material';
import ChartNote from './ChartNote';

const COLORS = ['#4A90E2', '#E0E0E0'];

function ActiveIdlePieChart({ activeTime, idleTime }) {
  const total = activeTime + idleTime;

  if (total <= 0) {
    return (
      <Paper sx={{ padding: '20px', height: '100%' }}>
        <Typography variant="h6" sx={{ marginBottom: '20px' }}>
          Device-Flagged Events
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No data available
        </Typography>
      </Paper>
    );
  }

  const data = [
    { name: 'Active', value: parseFloat(activeTime.toFixed(2)) },
    { name: 'Idle', value: parseFloat(idleTime.toFixed(2)) }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const pct = ((item.value / total) * 100).toFixed(1);
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{item.name}</p>
          <p style={{ margin: '5px 0 0 0' }}>{item.value}s ({pct}%)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Paper sx={{ padding: '20px', height: '100%' }}>
      <Typography variant="h6" sx={{ marginBottom: '4px' }}>
        Device-Flagged Events
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '16px' }}>
        Total: {total.toFixed(2)}s
      </Typography>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <ChartNote text="Active = time the device reported a change in acceleration. Idle = gaps between events while the device was on. Idle does not mean the wheelchair was stationary — steady rolling produces no acceleration change and appears as Idle." />
    </Paper>
  );
}

export default ActiveIdlePieChart;
