/**
 * MagnitudeDeviationChart
 *
 * Computes active/idle state from raw accelerometer data using
 * magnitude deviation thresholding. This is fully independent of the
 * device-reported start/stop event model used elsewhere in the app.
 *
 * Algorithm:
 *   1. Find the 1-second window (BASELINE_WINDOW_SAMPLES) with the lowest
 *      combined XYZ variance — this is the quietest segment, used as the
 *      gravity baseline. Robust even when most of the recording is motion.
 *   2. Per sample: deviation = sqrt((x-bx)^2 + (y-by)^2 + (z-bz)^2)
 *   3. Classify: deviation >= THRESHOLD_G → active, else idle
 *   4. Surface sample counts (not time estimates) because effective sample
 *      rate may differ significantly from the nominal 100 Hz.
 *
 * The named export `computeMagnitudeDeviations` is a pure function with no
 * React dependency — import it directly for validation against ground-truth data.
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
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Paper, Typography, Box } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// ── Tunable constants ─────────────────────────────────────────────────────────
const THRESHOLD_G = 0.1;

// Number of consecutive samples to consider as one baseline window.
// At nominal 100 Hz this is ~1 second. If effective rate is lower the window
// is shorter in wall-clock time but the algorithm still finds the quietest
// continuous segment, which is what matters.
const BASELINE_WINDOW_SAMPLES = 100;

const COLOR_ACTIVE = '#EF5350';
const COLOR_IDLE = '#90CAF9';
const COLOR_THRESHOLD = '#FF6F00';

// ── Pure algorithm function ───────────────────────────────────────────────────

/**
 * computeMagnitudeDeviations
 *
 * @param {Array<{x: number, y: number, z?: number, index: number}>} accelData
 * @returns {{
 *   chartData, activeCount, idleCount,
 *   baselineX, baselineY, baselineZ,
 *   motionEnergy, peakDeviation
 * }}
 */
export function computeMagnitudeDeviations(accelData) {
  const n = accelData.length;

  // Step 1 — find baseline via minimum-variance sliding window.
  // For each window of BASELINE_WINDOW_SAMPLES consecutive samples, compute
  // the sum of per-axis variances. The window with the smallest combined
  // variance is the quietest segment; use its per-axis mean as the baseline.
  const winSize = Math.min(BASELINE_WINDOW_SAMPLES, n);
  let bestVar = Infinity;
  let baselineX = 0, baselineY = 0, baselineZ = 0;

  // Running sums for the initial window
  let sumX = 0, sumY = 0, sumZ = 0;
  let sumX2 = 0, sumY2 = 0, sumZ2 = 0;

  for (let i = 0; i < winSize; i++) {
    const s = accelData[i];
    const z = s.z !== undefined ? s.z : 0;
    sumX += s.x; sumX2 += s.x * s.x;
    sumY += s.y; sumY2 += s.y * s.y;
    sumZ += z;   sumZ2 += z * z;
  }

  const evalWindow = () => {
    const vx = sumX2 / winSize - (sumX / winSize) ** 2;
    const vy = sumY2 / winSize - (sumY / winSize) ** 2;
    const vz = sumZ2 / winSize - (sumZ / winSize) ** 2;
    return { totalVar: vx + vy + vz, mx: sumX / winSize, my: sumY / winSize, mz: sumZ / winSize };
  };

  let res = evalWindow();
  if (res.totalVar < bestVar) {
    bestVar = res.totalVar;
    baselineX = res.mx; baselineY = res.my; baselineZ = res.mz;
  }

  // Slide the window
  for (let i = winSize; i < n; i++) {
    const incoming = accelData[i];
    const outgoing = accelData[i - winSize];
    const inZ = incoming.z !== undefined ? incoming.z : 0;
    const outZ = outgoing.z !== undefined ? outgoing.z : 0;

    sumX  += incoming.x - outgoing.x;
    sumX2 += incoming.x * incoming.x - outgoing.x * outgoing.x;
    sumY  += incoming.y - outgoing.y;
    sumY2 += incoming.y * incoming.y - outgoing.y * outgoing.y;
    sumZ  += inZ - outZ;
    sumZ2 += inZ * inZ - outZ * outZ;

    res = evalWindow();
    if (res.totalVar < bestVar) {
      bestVar = res.totalVar;
      baselineX = res.mx; baselineY = res.my; baselineZ = res.mz;
    }
  }

  // Steps 2 & 3 — per-sample deviation and classification
  let activeCount = 0;
  let idleCount = 0;
  let motionEnergy = 0;
  let peakDeviation = 0;

  const chartData = accelData.map((sample) => {
    const dz = sample.z !== undefined ? sample.z - baselineZ : 0;
    const deviation = Math.sqrt(
      (sample.x - baselineX) ** 2 +
      (sample.y - baselineY) ** 2 +
      dz ** 2
    );

    if (deviation > peakDeviation) peakDeviation = deviation;
    motionEnergy += deviation; // ∫|deviation| (in sample units; divide by n for mean)

    const isActive = deviation >= THRESHOLD_G;
    if (isActive) activeCount++; else idleCount++;

    return {
      elapsedSec: parseFloat((sample.index * 0.01).toFixed(2)),
      deviation: parseFloat(deviation.toFixed(4)),
      state: isActive ? 'active' : 'idle',
      activeDeviation: isActive ? parseFloat(deviation.toFixed(4)) : null,
      idleDeviation: !isActive ? parseFloat(deviation.toFixed(4)) : null,
    };
  });

  return {
    chartData,
    activeCount,
    idleCount,
    baselineX,
    baselineY,
    baselineZ,
    motionEnergy: parseFloat(motionEnergy.toFixed(4)),
    peakDeviation: parseFloat(peakDeviation.toFixed(4)),
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

function MagnitudeDeviationChart({ accelData }) {
  if (!accelData || accelData.length === 0) {
    return (
      <Paper sx={{ padding: '20px', height: '100%' }}>
        <Typography variant="h6" sx={{ marginBottom: '20px' }}>
          Magnitude Deviation (Analytical Active/Idle)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No accelerometer data available
        </Typography>
      </Paper>
    );
  }

  const {
    chartData,
    activeCount,
    idleCount,
    baselineX,
    baselineY,
    baselineZ,
    motionEnergy,
    peakDeviation,
  } = computeMagnitudeDeviations(accelData);

  const sampleRate = Math.max(1, Math.floor(chartData.length / 500));
  const displayData = chartData.filter((_, i) => i % sampleRate === 0);

  const total = activeCount + idleCount;
  const activePct = ((activeCount / total) * 100).toFixed(1);
  const idlePct = ((idleCount / total) * 100).toFixed(1);

  const baselineMag = Math.sqrt(baselineX ** 2 + baselineY ** 2 + baselineZ ** 2);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '0.85rem',
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>t = {label} s (nominal)</p>
          <p style={{ margin: '4px 0 0' }}>Deviation: {point.deviation.toFixed(4)} g</p>
          <p style={{
            margin: '4px 0 0',
            color: point.state === 'active' ? COLOR_ACTIVE : COLOR_IDLE,
            fontWeight: 'bold',
          }}>
            {point.state.toUpperCase()}
          </p>
          <p style={{ margin: '4px 0 0', color: '#888' }}>
            Threshold: {THRESHOLD_G} g
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Paper sx={{ padding: '20px', height: '100%' }}>
      <Typography variant="h6" sx={{ marginBottom: '6px' }}>
        Magnitude Deviation — Analytical Active/Idle
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '2px' }}>
        {accelData.length} samples &nbsp;|&nbsp; Threshold: {THRESHOLD_G} g
        {sampleRate > 1 ? ` (displaying every ${sampleRate}th point)` : ''}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '16px' }}>
        Baseline (min-variance window) — X: {baselineX.toFixed(3)} g, Y: {baselineY.toFixed(3)} g,
        Z: {baselineZ.toFixed(3)} g &nbsp;|&nbsp; |baseline|: {baselineMag.toFixed(3)} g
      </Typography>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={displayData}
          margin={{ top: 20, right: 30, left: 0, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis
            dataKey="elapsedSec"
            label={{ value: 'Elapsed Time (nominal, s)', position: 'insideBottom', offset: -10 }}
          />
          <YAxis
            label={{ value: 'Deviation (g)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" align="right" height={36} />

          <ReferenceLine
            y={THRESHOLD_G}
            stroke={COLOR_THRESHOLD}
            strokeDasharray="5 5"
            label={{
              value: `Threshold: ${THRESHOLD_G} g`,
              position: 'insideTopRight',
              fill: COLOR_THRESHOLD,
              fontSize: 12,
            }}
          />

          <Line
            type="monotone"
            dataKey="activeDeviation"
            stroke={COLOR_ACTIVE}
            name="Active"
            dot={false}
            strokeWidth={1.5}
            isAnimationActive={false}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="idleDeviation"
            stroke={COLOR_IDLE}
            name="Idle"
            dot={false}
            strokeWidth={1.5}
            isAnimationActive={false}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Summary stat cards — sample counts only, no time estimates */}
      <Box sx={{ display: 'flex', gap: 2, marginTop: '20px', flexWrap: 'wrap' }}>
        <Box sx={{
          flex: 1,
          minWidth: 140,
          padding: '12px 16px',
          backgroundColor: '#FFEBEE',
          borderRadius: '8px',
          borderLeft: `4px solid ${COLOR_ACTIVE}`,
        }}>
          <Typography variant="caption" color="text.secondary">ACTIVE SAMPLES</Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: COLOR_ACTIVE }}>
            {activeCount}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {activePct}% of recording
          </Typography>
        </Box>

        <Box sx={{
          flex: 1,
          minWidth: 140,
          padding: '12px 16px',
          backgroundColor: '#E3F2FD',
          borderRadius: '8px',
          borderLeft: `4px solid ${COLOR_IDLE}`,
        }}>
          <Typography variant="caption" color="text.secondary">IDLE SAMPLES</Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1565C0' }}>
            {idleCount}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {idlePct}% of recording
          </Typography>
        </Box>

        <Box sx={{
          flex: 1,
          minWidth: 140,
          padding: '12px 16px',
          backgroundColor: '#FFF3E0',
          borderRadius: '8px',
          borderLeft: '4px solid #E65100',
        }}>
          <Typography variant="caption" color="text.secondary">PEAK DEVIATION</Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#E65100' }}>
            {peakDeviation.toFixed(3)} g
          </Typography>
          <Typography variant="body2" color="text.secondary">
            max single-sample
          </Typography>
        </Box>

        <Box sx={{
          flex: 1,
          minWidth: 140,
          padding: '12px 16px',
          backgroundColor: '#F3E5F5',
          borderRadius: '8px',
          borderLeft: '4px solid #7B1FA2',
        }}>
          <Typography variant="caption" color="text.secondary">MOTION ENERGY</Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#7B1FA2' }}>
            {motionEnergy.toFixed(1)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Σ|deviation| (g·samples)
          </Typography>
        </Box>
      </Box>

      {/* Help text */}
      <Box sx={{
        marginTop: '16px',
        padding: '12px',
        backgroundColor: '#E8F4FD',
        borderRadius: '4px',
        display: 'flex',
        gap: 1,
        alignItems: 'flex-start',
      }}>
        <InfoOutlinedIcon sx={{ fontSize: '1rem', color: '#1565C0', marginTop: '2px', flexShrink: 0 }} />
        <Typography variant="caption" color="text.secondary">
          <strong>What these numbers mean:</strong> Deviation magnitude measures the intensity of motion changes relative to the sensor's resting orientation — not speed or distance. Higher values mean more vigorous movement. Motion energy (Σ|deviation|) integrates intensity × duration into one number — useful for comparing sessions. The baseline is estimated from the quietest 1-second window in the recording; if no truly idle segment exists, the baseline may be slightly elevated.
        </Typography>
      </Box>

      <Box sx={{ marginTop: '8px', padding: '8px', backgroundColor: '#FFF9C4', borderRadius: '4px' }}>
        <Typography variant="caption" color="text.secondary">
          Sample counts are exact. Time labels on the x-axis assume 100 Hz nominal rate — effective rate may differ. Classification is independent of device-reported start/stop events.
        </Typography>
      </Box>
    </Paper>
  );
}

export default MagnitudeDeviationChart;
