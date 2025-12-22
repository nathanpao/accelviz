/**
 * Motion Timeline Chart Component
 * Displays motion events as bars showing when motion occurred and duration
 * Events labeled with event number and session timestamp
 */

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Paper, Typography } from '@mui/material';

function MotionTimelineChart({ motionSessions, deviceStartTimeFormatted, isAllSessions = false }) {
  if (!motionSessions || motionSessions.length === 0) {
    return (
      <Paper sx={{ padding: '20px', height: '100%' }}>
        <Typography variant="h6" sx={{ marginBottom: '20px' }}>
          Motion Events Timeline
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No motion events found
        </Typography>
      </Paper>
    );
  }

  const baseTime = motionSessions[0].start;
  // UI sizing for scrollable stacked rows
  const ROW_HEIGHT = 60; // px per event row
  const VISIBLE_MAX_HEIGHT = 300; // px before scroll appears
  const CHART_PADDING = 60; // extra padding for margins/labels
  const chartData = motionSessions.map((session, index) => {
    if (!session.start || !session.stop) return null;

    // startOffset: seconds since first motion for the event start
    const startOffset = (session.start - baseTime) / 1000;
    const duration = (session.stop - session.start) / 1000; // duration in seconds

    const eventLabel = isAllSessions
      ? `E${session.eventNumber}`
      : `Event ${session.eventNumber}`;

    return {
      eventNumber: session.eventNumber,
      // start offset used to create the invisible stacked bar so the visible
      // duration bar begins at the correct x-position
      startOffset: parseFloat(startOffset.toFixed(2)),
      // keep original start offset also available as `offset` for tooltip
      offset: parseFloat(startOffset.toFixed(2)),
      duration: parseFloat(duration.toFixed(2)),
      label: eventLabel,
      sessionTime: deviceStartTimeFormatted
    };
  }).filter(item => item !== null);

  // Compute chart height so bars keep constant size; the parent wrapper will
  // scroll when the chart exceeds VISIBLE_MAX_HEIGHT.
  const chartHeight = chartData.length * ROW_HEIGHT + CHART_PADDING;
  const needsScroll = chartHeight > VISIBLE_MAX_HEIGHT;

  // Find max stop time (start + duration) for X-axis scaling
  const maxStop = Math.max(...chartData.map(d => d.startOffset + d.duration));

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
          <p style={{ margin: '5px 0 0 0' }}>Offset: {data.offset.toFixed(2)}s</p>
            <p style={{ margin: '5px 0 0 0' }}>Duration: {data.duration.toFixed(2)}s</p>
            <p style={{ margin: '5px 0 0 0' }}>End: {(data.offset + data.duration).toFixed(2)}s</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Paper sx={{ padding: '20px', height: '100%' }}>
      <Typography variant="h6" sx={{ marginBottom: '10px' }}>
        Motion Events Timeline
      </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '20px' }}>
        {motionSessions.length} motion events detected
      </Typography>
        {needsScroll && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Scroll to view more events
          </Typography>
        )}
        <div style={{ maxHeight: VISIBLE_MAX_HEIGHT, overflowY: 'auto' }}>
          <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 30, right: 30, left: 0, bottom: 20 }}
            barCategoryGap={Math.round(ROW_HEIGHT * 0.2)}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis
            // horizontal time axis: seconds since first motion
            type="number"
            label={{ value: 'Seconds since first motion', position: 'insideBottom', offset: -10 }}
            domain={[0, Math.ceil(maxStop * 1.1)]}
          />
          <YAxis
            // categorical axis listing events vertically
            type="category"
            dataKey="label"
            width={140}
          />
          <Tooltip content={<CustomTooltip />} />
          {/*
            Stack an invisible bar of length `startOffset` before the visible
            `duration` bar so that the visible bar starts at the event start time
            and extends to start+duration (i.e., a range bar along the x-axis).
          */}
          <Bar dataKey="startOffset" stackId="a" fill="transparent" stroke="none" />
          <Bar dataKey="duration" stackId="a" barSize={Math.round(ROW_HEIGHT * 0.8)}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="#77AC30" />
            ))}
          </Bar>
        </BarChart>
        </ResponsiveContainer>
      </div>
    </Paper>
  );
}

export default MotionTimelineChart;
