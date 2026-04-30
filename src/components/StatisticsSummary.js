/**
 * Statistics Summary Component
 * Displays key metrics and statistics from analyzed data
 * Shows session information and whether viewing all sessions or single session
 */

import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Divider,
  Chip
} from '@mui/material';

function StatisticsSummary({ fileName, stats, sessionInfo, sessionStats }) {
  const {
    totalSessions = 0,
    meanDuration = 0,
    maxDuration = 0,
    minDuration = 0
  } = stats;

  const {
    daysWithMotion = 0,
    totalSessionLength = 0,
    dailyEventCounts = {}
  } = sessionStats || {};

  const dailyRows = Object.entries(dailyEventCounts).sort(([a], [b]) => a.localeCompare(b));

  return (
    <Paper sx={{ padding: '24px', height: '100%' }}>
      <Typography variant="h6" sx={{ marginBottom: '20px', fontWeight: 'bold' }}>
        Analysis Summary
      </Typography>

      {/* Session Info */}
      {sessionInfo && (
        <>
          <Box sx={{ marginBottom: '20px' }}>
            {sessionInfo.isAllSessions ? (
              <Chip
                label={`All Sessions (${sessionInfo.totalSessions})`}
                color="primary"
                sx={{ marginBottom: '10px' }}
              />
            ) : (
              <Chip
                label={`Single Session`}
                color="secondary"
                sx={{ marginBottom: '10px' }}
              />
            )}
            <Typography variant="body2" color="text.secondary" sx={{ marginTop: '10px' }}>
              <strong>Session:</strong> {sessionInfo.sessionTimestamp}
            </Typography>
          </Box>
          <Divider sx={{ marginBottom: '20px' }} />
        </>
      )}

      <Typography variant="subtitle1" sx={{ marginBottom: '10px', fontWeight: 'bold' }}>
        Session Statistics
      </Typography>

      <TableContainer>
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none' }}>
                Number of Sessions
              </TableCell>
              <TableCell align="right" sx={{ borderBottom: 'none' }}>
                <strong>{sessionInfo?.totalSessions || 0}</strong>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none' }}>
                Total Session Length
              </TableCell>
              <TableCell align="right" sx={{ borderBottom: 'none' }}>
                <strong>{totalSessionLength.toFixed(2)}s</strong>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none' }}>
                Days with Motion
              </TableCell>
              <TableCell align="right" sx={{ borderBottom: 'none' }}>
                <strong>{daysWithMotion}</strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ marginY: '20px' }} />

      <Typography variant="subtitle1" sx={{ marginBottom: '10px', fontWeight: 'bold' }}>
        Event Statistics
      </Typography>

      <TableContainer>
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none' }}>
                Total Detection Events
              </TableCell>
              <TableCell align="right" sx={{ borderBottom: 'none' }}>
                <strong>{totalSessions}</strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {totalSessions > 0 && (
        <>
          <TableContainer sx={{ marginTop: '10px' }}>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell sx={{ borderBottom: 'none' }}>Mean Duration</TableCell>
                  <TableCell align="right" sx={{ borderBottom: 'none' }}>
                    {meanDuration.toFixed(2)}s
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ borderBottom: 'none' }}>Max Duration</TableCell>
                  <TableCell align="right" sx={{ borderBottom: 'none' }}>
                    {maxDuration.toFixed(2)}s
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ borderBottom: 'none' }}>Min Duration</TableCell>
                  <TableCell align="right" sx={{ borderBottom: 'none' }}>
                    {minDuration.toFixed(2)}s
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {dailyRows.length > 0 && (
        <>
          <Divider sx={{ marginY: '20px' }} />
          <Typography variant="subtitle1" sx={{ marginBottom: '10px', fontWeight: 'bold' }}>
            Daily Motion Event Counts
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableBody>
                {dailyRows.map(([date, count]) => (
                  <TableRow key={date}>
                    <TableCell sx={{ borderBottom: 'none', fontSize: '0.8rem' }}>{date}</TableCell>
                    <TableCell align="right" sx={{ borderBottom: 'none' }}>
                      <strong>{count}</strong> event{count !== 1 ? 's' : ''}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      <Box sx={{ marginTop: '30px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
        <Typography variant="caption" color="text.secondary">
          Note: Motion detection events grouped by device startup sessions. Statistics computed from events with minimum duration of 1.0s.
        </Typography>
      </Box>
    </Paper>
  );
}

export default StatisticsSummary;
