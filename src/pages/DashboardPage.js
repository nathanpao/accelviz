/**
 * Dashboard Page Component
 * Main visualization page that displays all charts and statistics
 * Grouped by motion sessions (device startup) with session selector
 */

import React, { useState } from 'react';
import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import FileUpload from '../components/FileUpload';
import EventSelector from '../components/EventSelector';
import SessionDurationsChart from '../components/SessionDurationsChart';
import TimeSeriesChart from '../components/TimeSeriesChart';
import MotionTimelineChart from '../components/MotionTimelineChart';
import StatisticsSummary from '../components/StatisticsSummary';
import DailyEventCountChart from '../components/DailyEventCountChart';
import ActiveIdlePieChart from '../components/ActiveIdlePieChart';
import {
  parseAccelFileByEvents,
  computeEventStats,
} from '../utils/dataParser';

function DashboardPage() {
  const [fileName, setFileName] = useState(null);
  const [movementEvents, setMovementEvents] = useState(null);
  const [overallStats, setOverallStats] = useState(null);
  const [selectedSessionIndex, setSelectedSessionIndex] = useState(-1); // -1 = All Sessions

  const handleFileLoaded = (fileData) => {
    try {
      // Parse the file content grouped by device startup events
      const { movementEvents, overallStats } = parseAccelFileByEvents(fileData.content);

      if (movementEvents.length === 0) {
        alert('No motion sessions found in the file.');
        return;
      }

      setMovementEvents(movementEvents);
      setOverallStats(overallStats);
      setFileName(fileData.fileName);

      // Default to first session if only one, otherwise show all
      setSelectedSessionIndex(movementEvents.length === 1 ? 0 : -1);
    } catch (error) {
      console.error('Error parsing file:', error);
      alert('Error parsing file. Please ensure it is a valid accelerometer data file.');
    }
  };

  const handleReset = () => {
    setFileName(null);
    setMovementEvents(null);
    setOverallStats(null);
    setSelectedSessionIndex(-1);
  };

  const handleSessionChange = (index) => {
    setSelectedSessionIndex(index);
  };

  // Get current view data based on selected session
  const getCurrentViewData = () => {
    if (!movementEvents) return null;

    if (selectedSessionIndex === -1) {
      // All Sessions view - combine all events
      const allMotionSessions = [];
      const allAccelData = [];

      movementEvents.forEach(event => {
        const eventStats = computeEventStats(event);
        allMotionSessions.push(...eventStats.filteredSessions);
        allAccelData.push(...event.accelData);
      });

      return {
        motionSessions: allMotionSessions,
        accelData: allAccelData,
        deviceStartTimeFormatted: 'All Sessions',
        stats: {
          totalSessions: overallStats.totalSessions,
          activeTime: overallStats.totalActiveTime,
          idleTime: overallStats.totalIdleTime,
          meanDuration: overallStats.meanDuration,
          maxDuration: overallStats.maxDuration,
          minDuration: overallStats.minDuration,
          totalSamples: overallStats.totalSamples
        },
        sessionStats: {
          totalSessionLength: overallStats.totalSessionLength,
          daysWithMotion: overallStats.daysWithMotion,
          daysWithMotionList: overallStats.daysWithMotionList,
          dailyEventCounts: overallStats.dailyEventCounts,
        },
        isAllSessions: true
      };
    } else {
      // Single session view
      const event = movementEvents[selectedSessionIndex];
      const eventStats = computeEventStats(event);

      // Compute per-session scoped stats
      const sessionLength =
        event.deviceStartTime && event.deviceStopTime
          ? (event.deviceStopTime - event.deviceStartTime) / 1000
          : 0;

      const sessionDailyEventCounts = {};
      const sessionDates = new Set();
      eventStats.filteredSessions.forEach(s => {
        if (s.start) {
          const d = s.start.toISOString().slice(0, 10);
          sessionDates.add(d);
          sessionDailyEventCounts[d] = (sessionDailyEventCounts[d] || 0) + 1;
        }
      });

      return {
        motionSessions: eventStats.filteredSessions,
        accelData: event.accelData,
        deviceStartTimeFormatted: event.deviceStartTimeFormatted,
        stats: {
          totalSessions: eventStats.totalSessions,
          activeTime: eventStats.activeTime,
          idleTime: eventStats.idleTime,
          meanDuration: eventStats.meanDuration,
          maxDuration: eventStats.maxDuration,
          minDuration: eventStats.minDuration,
          totalSamples: eventStats.totalSamples
        },
        sessionStats: {
          totalSessionLength: sessionLength,
          daysWithMotion: sessionDates.size,
          daysWithMotionList: Array.from(sessionDates).sort(),
          dailyEventCounts: sessionDailyEventCounts,
        },
        isAllSessions: false
      };
    }
  };

  const viewData = getCurrentViewData();

  return (
    <Box sx={{ padding: '20px', minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {/* Header */}
      <Box sx={{ marginBottom: '30px', textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
          AccelViz - Accelerometer Data Analysis
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Upload and visualize accelerometer motion data grouped by movement events
        </Typography>
      </Box>

      {/* File Upload Section */}
      {!movementEvents && (
        <Box sx={{ maxWidth: '800px', margin: '0 auto' }}>
          <FileUpload onFileLoaded={handleFileLoaded} />
        </Box>
      )}

      {/* Dashboard Content */}
      {movementEvents && viewData && (
        <>
          {/* File Info and Reset Button */}
          <Paper sx={{ padding: '20px', marginBottom: '20px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Analysis Results
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  File: {fileName} | {overallStats.totalEvents} session(s), {overallStats.totalSessions} event(s)
                </Typography>
              </Box>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<RefreshIcon />}
                onClick={handleReset}
              >
                Upload New File
              </Button>
            </Box>
          </Paper>

          {/* Session Selector */}
          <EventSelector
            movementEvents={movementEvents}
            selectedSessionIndex={selectedSessionIndex}
            onSessionChange={handleSessionChange}
            overallStats={overallStats}
            computeEventStats={computeEventStats}
          />

          {/* Main Content - Two Column Layout */}
          <Grid container spacing={3}>
            {/* Left Column - Charts */}
            <Grid item xs={12} lg={8}>
              <Grid container spacing={3}>
                {/* Motion Timeline */}
                <Grid item xs={12}>
                  <MotionTimelineChart
                    motionSessions={viewData.motionSessions}
                    deviceStartTimeFormatted={viewData.deviceStartTimeFormatted}
                    isAllSessions={viewData.isAllSessions}
                  />
                </Grid>

                {/* Daily Event Count Chart */}
                <Grid item xs={12}>
                  <DailyEventCountChart
                    dailyEventCounts={overallStats.dailyEventCounts}
                  />
                </Grid>

                {/* Session Durations */}
                <Grid item xs={12}>
                  <SessionDurationsChart
                    motionSessions={viewData.motionSessions}
                    deviceStartTimeFormatted={viewData.deviceStartTimeFormatted}
                    isAllSessions={viewData.isAllSessions}
                  />
                </Grid>

                {/* Time Series - Only show acceleration data during motion sessions */}
                <Grid item xs={12}>
                  <TimeSeriesChart
                    accelData={viewData.accelData}
                    fileName={fileName}
                  />
                </Grid>

                {/* Active vs Idle Pie Chart */}
                <Grid item xs={12}>
                  <ActiveIdlePieChart
                    activeTime={viewData.stats.activeTime}
                    idleTime={viewData.stats.idleTime}
                  />
                </Grid>

                {/* Magnitude Deviation — hidden from view, component kept for future use */}
              </Grid>
            </Grid>

            {/* Right Column - Statistics */}
            <Grid item xs={12} lg={4}>
              <StatisticsSummary
                fileName={fileName}
                stats={viewData.stats}
                sessionInfo={{
                  isAllSessions: viewData.isAllSessions,
                  sessionTimestamp: viewData.deviceStartTimeFormatted,
                  totalSessions: overallStats.totalEvents
                }}
                sessionStats={viewData.sessionStats}
              />
            </Grid>
          </Grid>
        </>
      )}

      {/* Footer */}
      <Box sx={{ marginTop: '50px', textAlign: 'center', paddingBottom: '20px' }}>
        <Typography variant="caption" color="text.secondary">
          AccelViz - Accelerometer Data Visualization Tool
        </Typography>
      </Box>
    </Box>
  );
}

export default DashboardPage;
