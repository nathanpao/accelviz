/**
 * Event Selector Component
 * Allows user to select which motion session (device startup) to view
 * Plus an "All Sessions" option to view overall statistics
 */

import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Typography,
  Box
} from '@mui/material';

function EventSelector({ movementEvents, selectedSessionIndex, onSessionChange, overallStats, computeEventStats }) {
  if (!movementEvents || movementEvents.length === 0) {
    return null;
  }

  return (
    <Paper sx={{ padding: '20px', marginBottom: '20px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Typography variant="h6" sx={{ minWidth: '150px' }}>
          Select Session:
        </Typography>
        <FormControl fullWidth>
          <InputLabel id="session-selector-label">Motion Session</InputLabel>
          <Select
            labelId="session-selector-label"
            id="session-selector"
            value={selectedSessionIndex}
            label="Motion Session"
            onChange={(e) => onSessionChange(e.target.value)}
          >
            <MenuItem value={-1}>
              <strong>All Sessions</strong> ({movementEvents.length} sessions, {overallStats.totalSessions} events)
            </MenuItem>
            {movementEvents.map((event, index) => {
              const eventStats = computeEventStats(event);
              return (
                <MenuItem key={index} value={index}>
                  Session {index + 1}: {event.deviceStartTimeFormatted} ({eventStats.totalSessions} events)
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>
    </Paper>
  );
}

export default EventSelector;
